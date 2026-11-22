# Company Challenge Detail Route (`[id]`)

## Overview
Recruiter Server Component detail view (`src/app/[locale]/(company)/company/challenges/[id]`) for an owned challenge, presenting submission statistics, linked job-post attribution, a rendered markdown brief with interactive table of contents, structured role metadata, and a draft GitHub repository warning banner.

## Interface
- `metadata`: `Metadata` — Static page metadata (`title: 'Challenge Detail — after42'`, `description: 'View challenge details, stats, and candidate submissions.'`) `[page.tsx:metadata]`
- `default export ChallengeDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<JSX.Element>` — Server Component rendering ownership-verified challenge details and statistics `[page.tsx:ChallengeDetailPage]`
- Subdirectories:
  - [`submissions`](./submissions/README.md) — Ranked candidate submissions list with top-pick highlights and nested `[submissionId]` review workspace.

## Invariants
- Awaits `params` (`Promise<{ locale: string; id: string }>`) and initializes locale via `setRequestLocale(locale)` before loading `'company'` translations `[page.tsx:ChallengeDetailPage]`
- Enforces recruiter role authorization via `await requireRole('recruiter')` `[page.tsx:ChallengeDetailPage]`
- Enforces challenge ownership by calling `notFound()` if `!ch || ch.creatorId !== sessionUser.id` `[page.tsx:ChallengeDetailPage]`
- Queries `jobPost` conditionally only when `ch.jobPostId` is truthy `[page.tsx:ChallengeDetailPage]`
- Extracts the `readme` string from `ch.challengeContent` when it is an object, rendering brief HTML via `dangerouslySetInnerHTML` and an optional TOC aside only when `briefHtml` is non-empty `[page.tsx:ChallengeDetailPage]`
- Displays the draft GitHub warning banner (`t('challengeGithubWarning')`) only when `ch.status === 'draft' && !ch.githubRepoName` `[page.tsx:ChallengeDetailPage]`

## Side Effects
- Sets `next-intl` request locale via `setRequestLocale(locale)` and loads `'company'` translations via `getTranslations('company')` `[page.tsx:ChallengeDetailPage]`
- Verifies recruiter auth session and role via `requireRole('recruiter')` `[page.tsx:ChallengeDetailPage]`
- Queries Drizzle table `challenge` (`SELECT *` by `id`, `limit(1)`) `[page.tsx:ChallengeDetailPage]`
- Queries Drizzle table `candidateSubmission` for total `count()` and `status = 'scored'` `count()` + `max(score)` filtered by `challengeId` `[page.tsx:ChallengeDetailPage]`
- Conditionally queries Drizzle table `jobPost` (`SELECT { title, company }` by `ch.jobPostId`, `limit(1)`) when `ch.jobPostId` is set `[page.tsx:ChallengeDetailPage]`
- Renders sanitized brief HTML and table-of-contents entries via `renderRecruiterChallengeBrief(readme)` (`@/lib/recruiter-challenge-brief`) when `readme` is non-empty `[page.tsx:ChallengeDetailPage]`
- Invokes `notFound()` (`next/navigation`) when the challenge is missing or not owned by the recruiter `[page.tsx:ChallengeDetailPage]`

## Verification
- Run: `pnpm lint && pnpm build`
