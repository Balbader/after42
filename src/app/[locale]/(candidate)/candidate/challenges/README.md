# Candidate Challenges Catalog Route (`challenges`)

## Overview
Candidate Server Component catalog (`src/app/[locale]/(candidate)/candidate/challenges`) listing all active coding challenges ordered newest-first, annotated with the current candidate's submission status badge and next-step link.

## Interface
- `metadata`: `Metadata` — Static page metadata (`title: 'Browse Challenges — after42'`, `description: 'Browse available coding challenges and start your assessment.'`) `[page.tsx:metadata]`
- `default export Page(): Promise<JSX.Element>` — Server Component querying active challenges and the candidate's submissions `[page.tsx:Page]`
- Subdirectories:
  - [`[id]`](<./[id]/README.md>) — Candidate challenge brief viewer with `ForkChallengeBtn` / continue link and nested `submit` workspace.

## Invariants
- Enforces candidate role authorization via `await requireRole('candidate')` `[page.tsx:Page]`
- Displays only challenges with `status === 'active'`, ordered by `desc(challenge.createdAt)` `[page.tsx:Page]`
- Renders an empty state (`'No challenges yet.'`) when `challenges.length === 0` `[page.tsx:Page]`
- Internal `rowHref(challengeId, sub)` routes to `/candidate/challenges/${challengeId}/submit` when `sub.status` is in `['forked', 'submitted', 'scoring']`, and `/candidate/challenges/${challengeId}` otherwise `[page.tsx:rowHref]`
- Internal `StatusBadge({ status })` renders `'In Progress'` for `['forked', 'submitted', 'scoring']`, `'Scored'` for `'scored'`, `'Failed'` for `'failed'`, and `null` otherwise `[page.tsx:StatusBadge]`
- Internal `parseTechStack(raw)` parses JSON arrays joined by `', '`, falling back to the raw string when non-array or on `JSON.parse` failure `[page.tsx:parseTechStack]`

## Side Effects
- Verifies candidate auth session and role via `requireRole('candidate')` `[page.tsx:Page]`
- Queries Drizzle table `challenge` (`SELECT *` where `status = 'active'`, ordered by `desc(challenge.createdAt)`) `[page.tsx:Page]`
- Queries Drizzle table `candidateSubmission` (`SELECT { challengeId, status, submissionId: id }` where `candidateId = sessionUser.id`) `[page.tsx:Page]`

## Verification
- Run: `pnpm lint && pnpm build`
