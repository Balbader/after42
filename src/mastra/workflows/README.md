# workflows

## Overview
Defines multi-step Mastra workflows orchestrating database reads/writes and AI tools. Currently contains `scoreSubmissionWorkflow` (`[score-submission.ts:scoreSubmissionWorkflow]`), a 3-step sequential pipeline that fetches challenge and job-post records, scores a candidate's code submission, generates an HR interview guide, and persists evaluation results to `candidate_submission`.

## Interface
- `scoreSubmissionWorkflow` (`[score-submission.ts:scoreSubmissionWorkflow]`): Exported committed Mastra workflow (`id: 'scoreSubmissionWorkflow'`):
  - `inputSchema` (`[score-submission.ts:workflowInputSchema]`): `{ submissionId: string, challengeId: string, candidateCode: string }`.
  - `outputSchema`: `{ ok: true }`.
  - Sequential steps:
    1. `scoreSubmissionStep` (`id: 'score-submission'`, `[score-submission.ts:scoreSubmissionStep]`): loads `challenge` and `jobPost` from `@/db` and runs `submissionScorerTool`.
    2. `interviewGuideStep` (`id: 'generate-interview-guide'`, `[score-submission.ts:interviewGuideStep]`): runs `interviewGuideTool` using challenge, job-post, and scorer outputs.
    3. `saveResultsStep` (`id: 'save-results'`, `[score-submission.ts:saveResultsStep]`): persists `status: 'scored'`, `score`, `recommendation`, `recommendationNote`, `aiReport`, `interviewGuide`, and `scoredAt` to `candidateSubmission`.

## Invariants
- Strict step ordering: `'score-submission'` -> `'generate-interview-guide'` -> `'save-results'` (`[score-submission.ts:scoreSubmissionWorkflow]`).
- DB preconditions in `scoreSubmissionStep` (`[score-submission.ts:scoreSubmissionStep]`): throws `'Challenge or job post not found'` if `challenge` is missing or `jobPostId` is falsy, `'Challenge content is incomplete'` if `challengeContent?.readme` is falsy, and `'Job post not found'` if the referenced `jobPost` row does not exist; casts `jp.experienceLevel` without runtime enum validation.
- Steps 1 and 2 invoke `submissionScorerTool.execute!` and `interviewGuideTool.execute!` directly with `{}` cast as `never` rather than through an agent runtime (`[score-submission.ts:scoreSubmissionStep]`, `[score-submission.ts:interviewGuideStep]`).
- Failure recovery scope: only `saveResultsStep` catches errors to mark `candidateSubmission.status = 'failed'` before rethrowing; errors thrown in steps 1 or 2 are not caught to update submission status inside the workflow (`[score-submission.ts:saveResultsStep]`).
- `guideStepOutputSchema` relaxes the `.min(4).max(6)` array constraint enforced by `interviewGuideTool` (`[score-submission.ts:guideStepOutputSchema]`).

## Side Effects
- Reads `challenge` (`LIMIT 1`) and `jobPost` (`LIMIT 1`) via Drizzle `@/db` (`[score-submission.ts:scoreSubmissionStep]`).
- Triggers two sequential Anthropic Sonnet LLM calls via `submissionScorerTool` and `interviewGuideTool` (`[score-submission.ts:scoreSubmissionStep]`, `[score-submission.ts:interviewGuideStep]`).
- Updates `candidateSubmission` in `@/db` with scored evaluation data and `scoredAt: new Date()`, or attempts a fallback update setting `status: 'failed'` on error (`[score-submission.ts:saveResultsStep]`).
- Logs persistence and fallback-update errors via `logError` (`@/lib/log-helpers`) (`[score-submission.ts:saveResultsStep]`).

## Verification
- Run: `pnpm lint && pnpm build`
