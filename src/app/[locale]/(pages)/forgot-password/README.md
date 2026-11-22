# Forgot Password Route (`forgot-password`)

## Overview
Public password-recovery request Server Component page (`src/app/[locale]/(pages)/forgot-password`) rendering `ForgotPasswordForm` framed by `Header` and `Footer` with localized page metadata.

## Interface
- `generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata>` — Returns localized `title` (`forgotPasswordTitle`) and `description` (`forgotPasswordDescription`) from the `'metadata'` namespace `[page.tsx:generateMetadata]`
- `default export ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }): Promise<JSX.Element>` — Server Component rendering `Header`, centered `ForgotPasswordForm`, and `Footer` `[page.tsx:ForgotPasswordPage]`

## Invariants
- Awaits `params` (`Promise<{ locale: string }>`) and invokes `setRequestLocale(locale)` `[page.tsx:ForgotPasswordPage]`
- Uses `next-intl` namespace `'metadata'` keys: `forgotPasswordTitle`, `forgotPasswordDescription` `[page.tsx:generateMetadata]`
- Directly renders `Header` and `Footer` inside the page despite being nested under `(pages)/layout.tsx` `[page.tsx:ForgotPasswordPage]`

## Side Effects
- Loads `'metadata'` translations via `getTranslations({ locale, namespace: 'metadata' })` in `generateMetadata` `[page.tsx:generateMetadata]`
- Configures `next-intl` request locale via `setRequestLocale(locale)` in `ForgotPasswordPage` `[page.tsx:ForgotPasswordPage]`

## Verification
- Run: `pnpm lint && pnpm build`
