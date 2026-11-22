# Company Submission Review Route (`[submissionId]`)

## Overview
Next.js App Router Server Component route (`src/app/[locale]/(company)/company/challenges/[id]/submissions/[submissionId]`) that loads a single candidate submission (score, lifecycle status, recommendation, AI report, and interview guide) alongside the challenge's ranked submission list and mounts `ReviewWorkspace`.

## Interface
- `metadata`: `Metadata` — Static page metadata (`title: 'Review Submission — after42'`, `description: 'Review candidate submission details, AI report, and interview guide.'`) `[page.tsx:metadata]`
- `default export Page({ params }: { params: Promise<{ id: string; submissionId: string }> }): Promise<JSX.Element>` — Server Component fetching ownership-scoped submission data and rendering `ReviewWorkspace` `[page.tsx:Page]`

## Invariants
- Enforces recruiter role authorization via `await requireRole('recruiter')` `[page.tsx:Page]`
- Enforces challenge ownership by calling `notFound()` if `!ch || ch.creatorId !== sessionUser.id` `[page.tsx:Page]`
- Enforces submission scoping by querying `candidateSubmission` matching both `id === submissionId` and `challengeId === challengeId`, calling `notFound()` if no row exists `[page.tsx:Page]`
- Orders `allSubs` by `desc(sql\`coalesce(${candidateSubmission.score}, -1)\`)` then `desc(candidateSubmission.submittedAt)` `[page.tsx:Page]`
- Casts `sub.recommendation` via an unchecked TypeScript type assertion (`as 'recommend' | 'consider' | 'pass' | null`, with no runtime narrowing) and serializes `submittedAt` and `scoredAt` via `.toISOString() ?? null` before passing to `ReviewWorkspace` `[page.tsx:Page]`

## Side Effects
- Verifies recruiter auth session and role via `requireRole('recruiter')` `[page.tsx:Page]`
- Queries Drizzle table `challenge` (`SELECT { id, title, creatorId }` by `id`, `limit(1)`) `[page.tsx:Page]`
- Queries Drizzle table `candidateSubmission` (`SELECT { id, sequenceNum, score, status, recommendation, recommendationNote, aiReport, interviewGuide, submittedAt, scoredAt }` by `id` and `challengeId`, `limit(1)`) `[page.tsx:Page]`
- Queries Drizzle table `candidateSubmission` (`SELECT { id, sequenceNum, score, recommendation, status }` by `challengeId`, ordered by coalesced score desc and `submittedAt` desc) `[page.tsx:Page]`
- Invokes `notFound()` (`next/navigation`) when the challenge is missing/unowned or the submission is missing `[page.tsx:Page]`

## Verification
- Run: `pnpm lint && pnpm build`
