# Sign-Up Route (`sign-up`)

## Overview
Public sign-up Server Component page (`src/app/[locale]/(pages)/sign-up`) rendering a responsive split layout pairing `AuthBrandAside` (with a localized sign-up tagline) alongside `SignUpFlow`.

## Interface
- `generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata>` — Returns localized `title` (`signUpTitle`) and `description` (`signUpDescription`) from the `'metadata'` namespace `[page.tsx:generateMetadata]`
- `default export Page({ params }: { params: Promise<{ locale: string }> }): Promise<JSX.Element>` — Server Component rendering `AuthBrandAside` and `SignUpFlow` `[page.tsx:Page]`

## Invariants
- Awaits `params` (`Promise<{ locale: string }>`) and invokes `setRequestLocale(locale)` `[page.tsx:Page]`
- Uses `next-intl` namespaces `'metadata'` (`signUpTitle`, `signUpDescription`) and `'authBrand'` (`signUpTagline`) `[page.tsx:generateMetadata,Page]`

## Side Effects
- Loads `'metadata'` translations via `getTranslations({ locale, namespace: 'metadata' })` in `generateMetadata` `[page.tsx:generateMetadata]`
- Configures `next-intl` request locale via `setRequestLocale(locale)` and loads `'authBrand'` translations via `getTranslations('authBrand')` in `Page` `[page.tsx:Page]`

## Verification
- Run: `pnpm lint && pnpm build`
