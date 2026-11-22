# tools

## Overview
Implements four Mastra tools (`createTool` from `@mastra/core/tools`) performing Zod-validated structured LLM generation via Vercel AI SDK (`generateObject` from `'ai'`) and Anthropic (`createAnthropic` from `'@ai-sdk/anthropic'`). Covers job-post extraction (`job-post-extractor-tool.ts`), coding-challenge generation (`challenge-generator-tool.ts`), candidate submission scoring (`submission-scorer-tool.ts`), and HR interview guide generation (`interview-guide-tool.ts`), while exporting their output schemas and TypeScript types for downstream workflows and persistence.

## Interface
- `challengeGeneratorTool`, `challengeGeneratorOutputSchema`, `ChallengeGeneratorOutput` (`[challenge-generator-tool.ts:challengeGeneratorTool]`, `[challenge-generator-tool.ts:challengeGeneratorOutputSchema]`, `[challenge-generator-tool.ts:ChallengeGeneratorOutput]`):
  - Tool `id`: `'generate-challenge'`. Input: `{ title, description, requiredSkills, experienceLevel: 'junior' | 'mid' | 'senior' | 'lead', techStack }`. Output: `{ title, readme, starterCode: Record<string, string>, evaluationCriteria: string[], estimatedDuration, difficulty: 'junior' | 'mid' | 'senior', engineeringCategory: 'frontend' | 'backend' | 'full-stack' | 'blockchain' | 'devops' | 'mobile' | 'data' | 'security' | 'other' }`.
- `interviewGuideTool`, `interviewGuideOutputSchema`, `InterviewGuideOutput` (`[interview-guide-tool.ts:interviewGuideTool]`, `[interview-guide-tool.ts:interviewGuideOutputSchema]`, `[interview-guide-tool.ts:InterviewGuideOutput]`):
  - Tool `id`: `'interview-guide'`. Input: `{ jobPost: { title, experienceLevel, requiredSkills }, challenge: { title, readme }, scorer: { score, strengths, gaps, recommendation } }`. Output: `{ guide: { question, expected_answer, focus_area? }[] }` (4–6 items).
- `jobPostExtractorTool`, `jobPostSchema`, `JobPostData` (`[job-post-extractor-tool.ts:jobPostExtractorTool]`, `[job-post-extractor-tool.ts:jobPostSchema]`, `[job-post-extractor-tool.ts:JobPostData]`):
  - Tool `id`: `'extract-job-post'`. Input: `{ text: string, modelPreference?: 'fast' | 'accurate' }` (default `'fast'`). Output: `{ title, company, description, location?, remote (default false), type: 'full-time' | 'part-time' | 'contract' | 'internship', experienceLevel: 'junior' | 'mid' | 'senior' | 'lead', requiredSkills, niceToHaveSkills (default []), responsibilities (default []), salary?: { min?, max?, currency? } }`.
- `submissionScorerTool`, `submissionScorerOutputSchema`, `SubmissionScorerOutput` (`[submission-scorer-tool.ts:submissionScorerTool]`, `[submission-scorer-tool.ts:submissionScorerOutputSchema]`, `[submission-scorer-tool.ts:SubmissionScorerOutput]`):
  - Tool `id`: `'score-submission'`. Input: `{ challenge: { title, readme, evaluationCriteria }, candidateCode, jobPost: { experienceLevel, requiredSkills } }`. Output: `{ score (0..100), recommendation: 'recommend' | 'consider' | 'pass', recommendationNote, strengths (3..5 items), gaps (0..5 items) }`.

## Invariants
- All four tools read `process.env.ANTHROPIC_API_KEY` directly into `createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })` with no explicit missing-key pre-check (`[challenge-generator-tool.ts:challengeGeneratorTool]`, `[interview-guide-tool.ts:interviewGuideTool]`, `[job-post-extractor-tool.ts:jobPostExtractorTool]`, `[submission-scorer-tool.ts:submissionScorerTool]`).
- Hardcoded Anthropic model IDs: `'claude-sonnet-4-5-20250929'` across challenge generation, interview guide, submission scoring, and `modelPreference === 'accurate'` extraction; `'claude-haiku-4-5-20251001'` for default `'fast'` extraction (`[job-post-extractor-tool.ts:jobPostExtractorTool]`).
- Output schema bounds: `challengeGeneratorOutputSchema.difficulty` excludes `'lead'` (`'junior' | 'mid' | 'senior'`), `interviewGuideOutputSchema.guide` requires 4–6 items, and `submissionScorerOutputSchema` bounds `score` to `0..100`, `strengths` to `3..5`, and `gaps` to `0..5` (`[challenge-generator-tool.ts:challengeGeneratorOutputSchema]`, `[interview-guide-tool.ts:interviewGuideOutputSchema]`, `[submission-scorer-tool.ts:submissionScorerOutputSchema]`).
- Prompt confidentiality boundaries: `challengeGeneratorTool` forbids leaking internal `evaluationCriteria` into candidate-facing `readme`, and `interviewGuideTool` requires plain-English HR guidance without leaking confidential scoring details (`[challenge-generator-tool.ts:challengeGeneratorTool]`, `[interview-guide-tool.ts:interviewGuideTool]`).
- Every tool catches `generateObject` errors and rethrows a prefixed `Error` (`Failed to ...: <message>` or `'Unknown error'`) (`[challenge-generator-tool.ts:challengeGeneratorTool]`, `[interview-guide-tool.ts:interviewGuideTool]`, `[job-post-extractor-tool.ts:jobPostExtractorTool]`, `[submission-scorer-tool.ts:submissionScorerTool]`).

## Side Effects
- Performs dynamic ESM imports (`import('ai')`, `import('@ai-sdk/anthropic')`) and reads `process.env.ANTHROPIC_API_KEY` on every `execute` call across all four tools (`[challenge-generator-tool.ts:challengeGeneratorTool]`, `[interview-guide-tool.ts:interviewGuideTool]`, `[job-post-extractor-tool.ts:jobPostExtractorTool]`, `[submission-scorer-tool.ts:submissionScorerTool]`).
- Makes outbound HTTPS LLM API calls to Anthropic via `generateObject` across all four tools.

## Verification
- Run: `pnpm lint && pnpm build`
