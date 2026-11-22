# Authenticated Profile Route (`profile`)

## Overview
Authenticated Server Component page (`src/app/[locale]/(logged-in)/profile`) displaying read-only account attributes—name, email, localized role label, and locale-formatted membership date—sourced from the active session.

## Interface
- `metadata`: `Metadata` — Static page metadata (`title: 'Profile — after42'`, `description: 'View and manage your account profile.'`) `[page.tsx:metadata]`
- `default export ProfilePage({ params }: { params: Promise<{ locale: string }> }): Promise<JSX.Element>` — Server Component rendering profile fields via internal `ProfileField` `[page.tsx:ProfilePage]`

## Invariants
- Requires an authenticated session via `await authController.requireSession(await headers())` `[page.tsx:ProfilePage]`
- Awaits `params` (`Promise<{ locale: string }>`) and invokes `setRequestLocale(locale)` `[page.tsx:ProfilePage]`
- Uses `next-intl` namespace `'profile'` keys: `label`, `title`, `name`, `email`, `role`, `memberSince`, `recruiter`, `candidate` `[page.tsx:ProfilePage]`
- Selects `date-fns` locale `fr` when `locale === 'fr'` and `enUS` otherwise, formatting `u.createdAt` with `'MMMM yyyy'` and falling back to `'—'` when absent `[page.tsx:ProfilePage]`
- Maps `u.role === 'recruiter'` to `t('recruiter')` and all other roles to `t('candidate')`; defaults missing `u.name` to `''` `[page.tsx:ProfilePage]`

## Side Effects
- Sets `next-intl` request locale via `setRequestLocale(locale)` and loads `'profile'` translations via `getTranslations('profile')` `[page.tsx:ProfilePage]`
- Reads Next.js request headers via `headers()` and validates session via `authController.requireSession(await headers())` `[page.tsx:ProfilePage]`

## Verification
- Run: `pnpm lint && pnpm build`
