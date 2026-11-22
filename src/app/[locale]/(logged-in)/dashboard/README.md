# Authenticated Dashboard Route (`dashboard`)

## Overview
Role-branched authenticated dashboard Server Component (`src/app/[locale]/(logged-in)/dashboard`). Candidates see a welcome card linking to `/candidate/challenges`; non-candidate (recruiter) users receive parallel Drizzle aggregate metrics passed to `RecruiterUnifiedDashboardClient` inside a React `Suspense` boundary.

## Interface
- `default export DashboardPage({ params }: { params: Promise<{ locale: string }> }): Promise<JSX.Element>` — Server Component rendering role-specific candidate or recruiter dashboard views `[page.tsx:DashboardPage]`

## Invariants
- Requires an authenticated session via `await authController.requireSession(await headers())` `[page.tsx:DashboardPage]`
- Awaits `params` (`Promise<{ locale: string }>`) and invokes `setRequestLocale(locale)` `[page.tsx:DashboardPage]`
- Uses `next-intl` namespace `'dashboard'` keys: `there`, `label`, `greetingMorning`, `greetingAfternoon`, `greetingEvening`, `candidateLead`, `nextStep`, `browseTitle`, `browseBody`, `browseLink`, `recruiterLeadUnified`, `statsHint`, `ctaNewJob` `[page.tsx:DashboardPage,greetingKey]`
- Branches on `u.role === 'candidate'` (renders link to `/candidate/challenges`); all other roles run recruiter aggregate queries and render `RecruiterUnifiedDashboardClient` with a CTA link to `/dashboard?tab=pipeline` `[page.tsx:DashboardPage]`
- Internal `greetingKey()` maps server local hour `< 12` to `'greetingMorning'`, `< 18` to `'greetingAfternoon'`, else `'greetingEvening'` `[page.tsx:greetingKey]`
- Falls back to `u.name?.split(' ')[0] ?? t('there')` for first name and `0` when aggregate query rows are absent `[page.tsx:DashboardPage]`
- Wraps `RecruiterUnifiedDashboardClient` in `<Suspense fallback={<DashboardRecruiterSkeleton />}>` `[page.tsx:DashboardPage,DashboardRecruiterSkeleton]`

## Side Effects
- Sets `next-intl` request locale via `setRequestLocale(locale)` and loads `'dashboard'` translations via `getTranslations('dashboard')` `[page.tsx:DashboardPage]`
- Reads Next.js request headers via `headers()` and validates session via `authController.requireSession(await headers())` `[page.tsx:DashboardPage]`
- For non-candidate users, executes 3 parallel Drizzle `SELECT` queries via `Promise.all`: `count()` on `jobPost` (`recruiterId = u.id`), `count()` on `challenge` (`creatorId = u.id`), and `count()` + `count(candidateSubmission.score)` on `candidateSubmission` inner-joined with `challenge` (`challenge.creatorId = u.id`) `[page.tsx:DashboardPage]`

## Verification
- Run: `pnpm lint && pnpm build`
