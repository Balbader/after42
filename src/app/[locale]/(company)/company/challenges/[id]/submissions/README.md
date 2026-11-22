# Company Challenge Submissions Route (`submissions`)

## Overview
Recruiter Server Component page (`src/app/[locale]/(company)/company/challenges/[id]/submissions`) displaying ranked candidate submissions for an owned challenge, highlighting up to 3 top picks (`pickSubmissionTopRows`) alongside a clickable submissions table (`SubmissionsClickableRow`).

## Interface
- `metadata`: `Metadata` — Static page metadata (`title: 'Submissions — after42'`, `description: 'Review and rank candidate submissions for this challenge.'`) `[page.tsx:metadata]`
- `default export SubmissionsPage({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<JSX.Element>` — Server Component rendering ranked submission rows, top-pick cards, and empty states `[page.tsx:SubmissionsPage]`
- Subdirectories:
  - [`[submissionId]`](<./[submissionId]/README.md>) — Single-submission review workspace (`ReviewWorkspace`) displaying AI report, score, recommendation, and interview guide alongside ranked peer submissions.

## Invariants
- Awaits `params` (`Promise<{ locale: string; id: string }>`) and initializes locale with `setRequestLocale(locale)` before loading `'company'` translations `[page.tsx:SubmissionsPage]`
- Enforces recruiter role authorization via `await requireRole('recruiter')` `[page.tsx:SubmissionsPage]`
- Enforces challenge ownership by calling `notFound()` if `!ch || ch.creatorId !== sessionUser.id` `[page.tsx:SubmissionsPage]`
- Orders submissions by `desc(sql\`coalesce(${candidateSubmission.score}, -1)\`)` then `desc(candidateSubmission.submittedAt)`, formatting relative `submittedAt` via `formatDistanceToNow(..., { addSuffix: true })` or `'—'` `[page.tsx:SubmissionsPage]`
- Selects up to 3 top picks via `pickSubmissionTopRows(tableRows, 3)`, narrows `recommendation` to `'recommend' | 'consider' | 'pass' | null`, and renders `ScoreBadge`/`RecPill` only when `row.status === 'scored' && row.score != null` `[page.tsx:SubmissionsPage]`
- Renders `EmptyState` when `rows.length === 0`, and renders the header top-pick CTA link only when `total > 0 && topPicks[0]` `[page.tsx:SubmissionsPage]`

## Side Effects
- Sets `next-intl` request locale via `setRequestLocale(locale)` and loads `'company'` translations via `getTranslations('company')` `[page.tsx:SubmissionsPage]`
- Verifies recruiter auth session and role via `requireRole('recruiter')` `[page.tsx:SubmissionsPage]`
- Queries Drizzle table `challenge` (`SELECT *` by `id`, `limit(1)`) `[page.tsx:SubmissionsPage]`
- Queries Drizzle table `candidateSubmission` for ranked rows (`id`, `sequenceNum`, `score`, `recommendation`, `status`, `submittedAt`), total `count()`, and `status = 'scored'` `count()` filtered by `challengeId` `[page.tsx:SubmissionsPage]`
- Invokes `notFound()` (`next/navigation`) when the challenge is missing or not owned by the recruiter `[page.tsx:SubmissionsPage]`

## Verification
- Run: `pnpm lint && pnpm build`
