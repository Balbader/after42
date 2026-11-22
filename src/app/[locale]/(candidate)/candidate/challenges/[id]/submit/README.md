# Candidate Challenge Submit Route (`submit`)

## Overview
Next.js App Router Server Component route (`src/app/[locale]/(candidate)/candidate/challenges/[id]/submit`) for submitting a forked coding challenge solution or viewing post-submission outcomes. Renders `SubmitWorkspace` while a submission is still active (`forked`), or `TerminalState` once it reaches a terminal lifecycle state.

## Interface
- `metadata`: `Metadata` — Static page metadata (`title: 'Submit Challenge — after42'`, `description: 'Submit your solution for this coding challenge.'`) `[page.tsx:metadata]`
- `default export Page({ params }: { params: Promise<{ id: string }> }): Promise<JSX.Element>` — Server Component rendering `TerminalState` or `SubmitWorkspace` `[page.tsx:Page]`

## Invariants
- Enforces candidate role authorization via `await requireRole('candidate')` `[page.tsx:Page]`
- Redirects to `/candidate/challenges/${challengeId}` with the active locale when no `candidateSubmission` exists for `(challengeId, sessionUser.id)` `[page.tsx:Page]`
- Invokes `notFound()` when no `challenge` record exists for `challengeId` `[page.tsx:Page]`
- Reads optional `process.env.GITHUB_ORG_NAME` (default `''`), forming `cloneUrl` as `https://github.com/${org}/${submission.githubForkName}.git` when non-empty or `''` otherwise `[page.tsx:Page]`
- Treats `terminalStatuses = ['submitted', 'scoring', 'scored', 'failed']` as terminal: renders `TerminalState({ submission: { status, score: score ?? null, submittedAt: submittedAt ?? null, sequenceNum } })` when matched, and `SubmitWorkspace({ challengeId, cloneUrl, submission: { id, githubForkName, sequenceNum }, challenge: { title, challengeContent } })` otherwise `[page.tsx:Page]`

## Side Effects
- Verifies candidate auth session and role via `requireRole('candidate')` `[page.tsx:Page]`
- Queries Drizzle table `candidateSubmission` (`SELECT *` filtered by `challengeId` and `candidateId`, `limit(1)`) `[page.tsx:Page]`
- Queries Drizzle table `challenge` (`SELECT *` filtered by `id`, `limit(1)`) `[page.tsx:Page]`
- Reads request locale via `getLocale()` (`next-intl/server`) and invokes localized `redirect()` (`@/i18n/navigation`) when no submission is found `[page.tsx:Page]`
- Invokes `notFound()` (`next/navigation`) when the challenge record is missing `[page.tsx:Page]`
- Reads `process.env.GITHUB_ORG_NAME` `[page.tsx:Page]`

## Verification
- Run: `pnpm lint && pnpm build`
