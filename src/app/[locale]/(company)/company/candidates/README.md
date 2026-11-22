# Company Candidates Route (`candidates`)

## Overview
Standalone recruiter candidates review route (`src/app/[locale]/(company)/company/candidates`) pairing a static-metadata passthrough layout (`layout.tsx`) with a Client Component page (`page.tsx`) wrapping `UnifiedDashboardBanner` (`tab="review"`) and `RecruiterCandidatesReview` (`embedded={false}`).

## Interface
- `metadata`: `Metadata` — Static route metadata (`title: 'All Candidates — after42'`, `description: 'View and filter all candidate submissions across your challenges.'`) `[layout.tsx:metadata]`
- `default export CandidatesLayout({ children }: { children: React.ReactNode }): React.ReactNode` — Passthrough layout supplying route metadata `[layout.tsx:CandidatesLayout]`
- `default export AllCandidatesPage(): JSX.Element` — Client Component (`'use client'`) rendering the standalone recruiter candidate review interface `[page.tsx:AllCandidatesPage]`

## Invariants
- `page.tsx` declares the `'use client'` directive `[page.tsx:'use client']`
- Loads `'company'` i18n namespace via `useTranslations('company')` `[page.tsx:AllCandidatesPage]`
- Renders `UnifiedDashboardBanner` (`tab="review"`), a header action link to `/dashboard?tab=review`, and `RecruiterCandidatesReview` (`embedded={false}`) `[page.tsx:AllCandidatesPage]`
- Performs no local role check in `layout.tsx` or `page.tsx`, relying on parent `(company)/layout.tsx` recruiter role enforcement `[layout.tsx:CandidatesLayout]`

## Side Effects
- None

## Verification
- Run: `pnpm lint && pnpm build`
