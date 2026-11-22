# Company Challenges Route (`challenges`)

## Overview
Recruiter Server Component page (`src/app/[locale]/(company)/company/challenges`) listing all coding challenges created by the authenticated recruiter with aggregated submission counts, top scores, status badges, and navigation to challenge details, submissions, and the unified dashboard pipeline.

## Interface
- `metadata`: `Metadata` — Static page metadata (`title: 'Challenges — after42'`, `description: 'Manage your coding challenges and track candidate submissions.'`) `[page.tsx:metadata]`
- `default export ChallengesPage({ params }: { params: Promise<{ locale: string }> }): Promise<JSX.Element>` — Server Component querying recruiter-owned challenges and per-challenge submission aggregates `[page.tsx:ChallengesPage]`
- Subdirectories:
  - [`[id]`](<./[id]/README.md>) — Owned challenge detail view (stats, job-post attribution, brief with TOC, draft GitHub warning) plus nested `submissions` ranking and `[submissionId]` review routes.

## Invariants
- Awaits `params` (`Promise<{ locale: string }>`) and initializes locale via `setRequestLocale(locale)` before loading `'company'` translations `[page.tsx:ChallengesPage]`
- Enforces recruiter role authorization via `await requireRole('recruiter')` `[page.tsx:ChallengesPage]`
- Scopes the challenge query to `creatorId === sessionUser.id`, ordered by `desc(challenge.createdAt)` `[page.tsx:ChallengesPage]`
- Short-circuits to `EmptyState` (CTA linking to `/dashboard?tab=pipeline`) when `challenges.length === 0`, avoiding an empty `inArray` query on `candidateSubmission` `[page.tsx:ChallengesPage]`
- Renders `UnifiedDashboardBanner` (`tab="challenges"`) and displays `ScoreBadge` only when `topScore !== null` `[page.tsx:ChallengesPage]`

## Side Effects
- Sets `next-intl` request locale via `setRequestLocale(locale)` and loads `'company'` translations via `getTranslations('company')` `[page.tsx:ChallengesPage]`
- Verifies recruiter auth session and role via `requireRole('recruiter')` `[page.tsx:ChallengesPage]`
- Queries Drizzle table `challenge` (`SELECT *` filtered by `creatorId = sessionUser.id`, ordered by `desc(challenge.createdAt)`) `[page.tsx:ChallengesPage]`
- Queries Drizzle table `candidateSubmission` (`SELECT { challengeId, n: count(), topScore: max(score) }` filtered by `inArray(challengeId, ids)` grouped by `challengeId`) when `challenges.length > 0` `[page.tsx:ChallengesPage]`

## Verification
- Run: `pnpm lint && pnpm build`
