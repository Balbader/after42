# Logged-In Challenge Index Route (`challenge`)

## Overview
Authenticated `/challenge` index route (`src/app/[locale]/(logged-in)/challenge`) that unconditionally redirects visitors to the unified dashboard pipeline tab (`/dashboard?tab=pipeline`) while preserving the active locale, and groups the nested challenge-creation route.

## Interface
- `metadata`: `Metadata` — Static page metadata (`title: 'Challenges | after42'`, `description: 'View and manage your coding challenges'`) `[page.tsx:metadata]`
- `default export ChallengesDashboardPage({ params }: { params: Promise<{ locale: string }> }): Promise<never>` — Server Component redirecting all requests to `/dashboard?tab=pipeline` `[page.tsx:ChallengesDashboardPage]`
- Subdirectories:
  - [`create`](./create/README.md) — Recruiter-only route rendering `JobPostUploader` (`embedded={true}`) inside recruiter page chrome to generate a coding challenge from a job post.

## Invariants
- Awaits `params` (`Promise<{ locale: string }>`) to resolve the active locale `[page.tsx:ChallengesDashboardPage]`
- Unconditionally redirects all requests to `'/dashboard?tab=pipeline'` without rendering page UI `[page.tsx:ChallengesDashboardPage]`

## Side Effects
- Invokes locale-aware `redirect({ href: '/dashboard?tab=pipeline', locale })` from `@/i18n/navigation` `[page.tsx:ChallengesDashboardPage]`

## Verification
- Run: `pnpm lint && pnpm build`
