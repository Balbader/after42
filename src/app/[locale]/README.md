# Locale Root Segment (`[locale]`)

## Overview
Dynamic locale segment layout and landing entry point (`src/app/[locale]`). `layout.tsx` validates the `[locale]` route parameter against `routing.locales`, pre-generates static locale params, and hydrates `NextIntlClientProvider`; `page.tsx` renders `Header`, `Home` (imported from `./(pages)/home/page`), and `Footer` with localized home metadata.

## Interface
- `generateStaticParams(): { locale: string }[]` — Maps `routing.locales` to static `{ locale }` route params `[layout.tsx:generateStaticParams]`
- `default export LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }): Promise<JSX.Element>` — Server Component validating `[locale]`, loading locale messages, and wrapping children in `NextIntlClientProvider` `[layout.tsx:LocaleLayout]`
- `generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata>` — Returns localized `title` (`homeTitle`) and `description` (`homeDescription`) from the `'metadata'` namespace `[page.tsx:generateMetadata]`
- `default export Page({ params }: { params: Promise<{ locale: string }> }): Promise<JSX.Element>` — Server Component rendering `Header`, `Home`, and `Footer` `[page.tsx:Page]`
- Subdirectories:
  - [`(candidate)`](<./(candidate)/README.md>) — Candidate role-gated sidebar layout and `/candidate/challenges` assessment flow.
  - [`(company)`](<./(company)/README.md>) — Recruiter role-gated sidebar layout and `/company/*` challenge/candidate management routes.
  - [`(logged-in)`](<./(logged-in)/README.md>) — Session-gated sidebar layout housing `/dashboard`, `/profile`, `/chat`, and `/challenge` routes.
  - [`(pages)`](<./(pages)/README.md>) — Public layout (`Header`/`Footer`) housing landing (`/home`) and authentication (`/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`) pages.

## Invariants
- Validates the dynamic `locale` param with `hasLocale(routing.locales, locale)` and invokes `notFound()` if invalid `[layout.tsx:LocaleLayout]`
- Static locale params are constrained to `routing.locales` from `@/i18n/routing` `[layout.tsx:generateStaticParams]`
- Awaits `params` (`Promise<{ locale: string }>`) and invokes `setRequestLocale(locale)` in both `LocaleLayout` and `Page` `[layout.tsx:LocaleLayout,page.tsx:Page]`
- Uses `next-intl` namespace `'metadata'` keys `homeTitle` and `homeDescription` `[page.tsx:generateMetadata]`

## Side Effects
- Invokes `notFound()` (`next/navigation`) when `[locale]` is unsupported `[layout.tsx:LocaleLayout]`
- Calls `setRequestLocale(locale)` and `getMessages()` (`next-intl/server`) to hydrate `NextIntlClientProvider` `[layout.tsx:LocaleLayout]`
- Loads `'metadata'` translations via `getTranslations({ locale, namespace: 'metadata' })` in `generateMetadata` and calls `setRequestLocale(locale)` in `Page` `[page.tsx:generateMetadata,Page]`

## Verification
- Run: `pnpm lint && pnpm build`
