# Sign-In Route (`sign-in`)

## Overview
Public sign-in Server Component page (`src/app/[locale]/(pages)/sign-in`) rendering a responsive split layout pairing `AuthBrandAside` (with a localized sign-in tagline) alongside `SignInForm`.

## Interface
- `generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata>` — Returns localized `title` (`signInTitle`) and `description` (`signInDescription`) from the `'metadata'` namespace `[page.tsx:generateMetadata]`
- `default export Page({ params }: { params: Promise<{ locale: string }> }): Promise<JSX.Element>` — Server Component rendering `AuthBrandAside` and `SignInForm` `[page.tsx:Page]`

## Invariants
- Awaits `params` (`Promise<{ locale: string }>`) and invokes `setRequestLocale(locale)` `[page.tsx:Page]`
- Uses `next-intl` namespaces `'metadata'` (`signInTitle`, `signInDescription`) and `'authBrand'` (`signInTagline`) `[page.tsx:generateMetadata,Page]`

## Side Effects
- Loads `'metadata'` translations via `getTranslations({ locale, namespace: 'metadata' })` in `generateMetadata` `[page.tsx:generateMetadata]`
- Configures `next-intl` request locale via `setRequestLocale(locale)` and loads `'authBrand'` translations via `getTranslations('authBrand')` in `Page` `[page.tsx:Page]`

## Verification
- Run: `pnpm lint && pnpm build`
