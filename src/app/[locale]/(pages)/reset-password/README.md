# Reset Password Route (`reset-password`)

## Overview
Public password-reset completion route (`src/app/[locale]/(pages)/reset-password`) wrapping `ResetPasswordForm` inside a React `Suspense` boundary with a localized client loading card fallback (`ResetPasswordLoading`).

## Interface
- `generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata>` — Returns localized `title` (`resetPasswordTitle`) and `description` (`resetPasswordDescription`) from the `'metadata'` namespace `[page.tsx:generateMetadata]`
- `default export ResetPasswordPage({ params }: { params: Promise<{ locale: string }> }): Promise<JSX.Element>` — Server Component wrapping `ResetPasswordForm` in `<Suspense fallback={<ResetPasswordLoading />}>` `[page.tsx:ResetPasswordPage]`
- `ResetPasswordLoading(): JSX.Element` — Client Component (`'use client'`) rendering a localized loading `Card` with a spinning `Loader2` icon `[reset-password-loading.tsx:ResetPasswordLoading]`

## Invariants
- Awaits `params` (`Promise<{ locale: string }>`) and invokes `setRequestLocale(locale)` `[page.tsx:ResetPasswordPage]`
- Uses `next-intl` namespace `'metadata'` keys: `resetPasswordTitle`, `resetPasswordDescription` `[page.tsx:generateMetadata]`
- Wraps `ResetPasswordForm` in `<Suspense fallback={<ResetPasswordLoading />}>` `[page.tsx:ResetPasswordPage]`
- `reset-password-loading.tsx` declares the `'use client'` directive and reads `next-intl` namespace `'authReset'` keys `title` and `loading` via `useTranslations` `[reset-password-loading.tsx:'use client',ResetPasswordLoading]`

## Side Effects
- Loads `'metadata'` translations via `getTranslations({ locale, namespace: 'metadata' })` in `generateMetadata` `[page.tsx:generateMetadata]`
- Configures `next-intl` request locale via `setRequestLocale(locale)` in `ResetPasswordPage` `[page.tsx:ResetPasswordPage]`

## Verification
- Run: `pnpm lint && pnpm build`
