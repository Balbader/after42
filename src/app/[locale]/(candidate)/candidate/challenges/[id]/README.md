# Candidate Challenge Detail Route (`[id]`)

## Overview
Candidate Server Component detail page (`src/app/[locale]/(candidate)/candidate/challenges/[id]`) rendering an active coding challenge's sanitized markdown README brief and metadata, presenting either `ForkChallengeBtn` to start or a link to continue an already-forked submission.

## Interface
- `metadata`: `Metadata` — Static page metadata (`title: 'Challenge Details — after42'`, `description: 'View challenge details and start your coding assessment.'`) `[page.tsx:metadata]`
- `default export Page({ params }: { params: Promise<{ id: string }> }): Promise<JSX.Element>` — Server Component loading the active challenge and candidate submission state `[page.tsx:Page]`
- Subdirectories:
  - [`submit`](./submit/README.md) — Candidate submission workspace (`SubmitWorkspace`) and post-submission outcome view (`TerminalState`).

## Invariants
- Enforces candidate role authorization via `await requireRole('candidate')` `[page.tsx:Page]`
- Invokes `notFound()` if `!ch || ch.status !== 'active'` `[page.tsx:Page]`
- Redirects to `/candidate/challenges/${id}/submit` with the active locale if a submission exists and `submission.status !== 'forked'` `[page.tsx:Page]`
- Renders a localized `Link` to `/candidate/challenges/${id}/submit` (`'Continue Challenge →'`) when `submission?.status === 'forked'`, and `ForkChallengeBtn({ challengeId: id })` otherwise `[page.tsx:Page]`
- Internal `parseTechStack(raw)` parses JSON arrays joined by `', '`, falling back to the raw string when non-array or on `JSON.parse` failure `[page.tsx:parseTechStack]`
- Extracts `(ch.challengeContent as ChallengeContent | null)?.readme ?? ''`, rendering sanitized HTML via `dangerouslySetInnerHTML` when present or `'No brief available.'` otherwise `[page.tsx:Page]`

## Side Effects
- Verifies candidate auth session and role via `requireRole('candidate')` `[page.tsx:Page]`
- Queries Drizzle table `challenge` (`SELECT *` filtered by `id`, `limit(1)`) `[page.tsx:Page]`
- Queries Drizzle table `candidateSubmission` (`SELECT *` filtered by `challengeId` and `candidateId`, `limit(1)`) `[page.tsx:Page]`
- Invokes `notFound()` (`next/navigation`) when the challenge is missing or not `'active'` `[page.tsx:Page]`
- Reads request locale via `getLocale()` (`next-intl/server`) and invokes localized `redirect()` (`@/i18n/navigation`) when a non-`'forked'` submission exists `[page.tsx:Page]`
- Converts markdown README to sanitized HTML via `renderMarkdown(readme)` (`@/lib/safe-markdown`) when non-empty `[page.tsx:Page]`

## Verification
- Run: `pnpm lint && pnpm build`
