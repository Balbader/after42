# Create Challenge Route (`create`)

## Overview
Recruiter-only authenticated route (`src/app/[locale]/(logged-in)/challenge/create`) for uploading a job posting and generating a coding challenge inside the recruiter page layout shell (`RecruiterPage`, `RecruiterPageHeader`, `RecruiterCard`, and `JobPostUploader`).

## Interface
- `metadata`: `Metadata` — Static page metadata (`title: 'Create Challenge | after42'`, `description: 'Upload a job post to generate a coding challenge'`) `[page.tsx:metadata]`
- `default export CreateChallengePage({ params }: { params: Promise<{ locale: string }> }): Promise<JSX.Element>` — Server Component rendering `JobPostUploader` with `embedded={true}` inside recruiter layout components `[page.tsx:CreateChallengePage]`

## Invariants
- Enforces recruiter-only role access via `await requireRole('recruiter')` `[page.tsx:CreateChallengePage]`
- Awaits `params` (`Promise<{ locale: string }>`) and invokes `setRequestLocale(locale)` before reading translations `[page.tsx:CreateChallengePage]`
- Requires `next-intl` namespace `'company'` keys: `createFlowEyebrow`, `createFlowTitle`, `createFlowLead` `[page.tsx:CreateChallengePage]`
- Mounts `JobPostUploader` with the `embedded` prop enabled `[page.tsx:CreateChallengePage]`

## Side Effects
- Configures `next-intl` request locale via `setRequestLocale(locale)` and loads `'company'` translations via `getTranslations('company')` `[page.tsx:CreateChallengePage]`
- Verifies authenticated recruiter session via `requireRole('recruiter')` (`@/lib/require-role`) `[page.tsx:CreateChallengePage]`

## Verification
- Run: `pnpm lint && pnpm build`
