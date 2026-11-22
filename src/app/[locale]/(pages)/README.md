# Public Pages Route Group (`(pages)`)

## Overview
Public Next.js route-group layout (`src/app/[locale]/(pages)`) wrapping unauthenticated marketing and authentication routes in shared `Header` and `Footer` chrome and supplying a localized default metadata description.

## Interface
- `generateMetadata({ params }: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>): Promise<Metadata>` — Returns localized `description` (`pagesDescription`) from the `'metadata'` namespace `[layout.tsx:generateMetadata]`
- `default export PagesLayout({ children, params }: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>): Promise<JSX.Element>` — Server Component wrapping child routes in `Header` and `Footer` `[layout.tsx:PagesLayout]`
- Subdirectories:
  - [`forgot-password`](./forgot-password/README.md) — Password-recovery request page rendering `ForgotPasswordForm` with localized metadata.
  - [`home`](./home/README.md) — Public landing page route delegating to `HomePage`.
  - [`reset-password`](./reset-password/README.md) — Password-reset completion page wrapping `ResetPasswordForm` in a `Suspense` boundary with `ResetPasswordLoading`.
  - [`sign-in`](./sign-in/README.md) — Split-layout sign-in page pairing `AuthBrandAside` with `SignInForm`.
  - [`sign-up`](./sign-up/README.md) — Split-layout sign-up page pairing `AuthBrandAside` with `SignUpFlow`.

## Invariants
- Awaits `params` (`Promise<{ locale: string }>`) and invokes `setRequestLocale(locale)` `[layout.tsx:PagesLayout]`
- Uses `next-intl` namespace `'metadata'` key `pagesDescription` `[layout.tsx:generateMetadata]`

## Side Effects
- Loads `'metadata'` translations via `getTranslations({ locale, namespace: 'metadata' })` in `generateMetadata` `[layout.tsx:generateMetadata]`
- Configures `next-intl` request locale via `setRequestLocale(locale)` in `PagesLayout` `[layout.tsx:PagesLayout]`

## Verification
- Run: `pnpm lint && pnpm build`
