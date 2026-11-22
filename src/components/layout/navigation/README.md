# Layout Navigation (`src/components/layout/navigation`)

## Overview
Provides the site-wide top navigation bar (`Header`) and footer (`Footer`) as async Next.js React Server Components. Both components load localized copy on the server via `next-intl/server` (`getTranslations`), render locale-aware `<Link>` elements from `@/i18n/navigation`, and style themselves with `--a42-*` CSS custom properties. `Header` renders the sticky navigation bar containing the brand link, authentication route links, and the interactive `LanguageSwitcher` and `ModeToggle` controls; `Footer` renders the bottom bar with the brand link and a dynamic current-year copyright notice.

## Interface
- `Footer` (default export, async React Server Component, no props): Renders the site `<footer>` with a locale-aware `<Link href='/'>` brand mark and localized copyright notice (`getTranslations('navigation')` keys `brandAfter`, `brandSuffix`; `getTranslations('footer')` keys `copyright` with `{ year }`, `copyrightSuffix`) `[Footer.tsx:Footer]`.
- `Header` (default export, async React Server Component, no props): Renders the sticky `<header>` with `<nav aria-label='Main navigation'>`, locale-aware `<Link>` elements for `'/'`, `'/sign-in'`, and `'/sign-up'`, localized copy from `getTranslations('navigation')` (`brandAfter`, `brandSuffix`, `signIn`, `signUp`), and mounted child controls `<LanguageSwitcher />` (`@/components/language-switcher`) and `<ModeToggle />` (`@/components/dark-mode-toggle`) `[Header.tsx:Header]`.

## Invariants
- Both `Footer` and `Header` are `async` Server Components (no `'use client'` directive) calling `next-intl/server` `getTranslations(...)`, so they must execute within a Next.js server request context with `next-intl` configured and translation keys present in `'navigation'` (`brandAfter`, `brandSuffix`, `signIn`, `signUp`) and `'footer'` (`copyright`, `copyrightSuffix`) `[Footer.tsx:Footer]`, `[Header.tsx:Header]`.
- All internal navigation links must use `@/i18n/navigation`'s `Link` rather than `next/link` to preserve locale-prefixed routing `[Footer.tsx:Footer]`, `[Header.tsx:Header]`.
- `Footer` computes the copyright year dynamically via `new Date().getFullYear()` and interpolates `{ year }` into `tf('copyright', { year })` `[Footer.tsx:Footer]`.
- Styling depends on CSS custom properties `--a42-border`, `--a42-surface`, `--a42-accent`, `--a42-text`, `--a42-text-muted`, `--font-fraunces`, `--font-dm-sans`, and (in `Header`) `--a42-accent-hover` being defined in scope `[Footer.tsx:Footer]`, `[Header.tsx:Header]`.

## Side Effects
- Reads server-side translation catalogs asynchronously via `await getTranslations('navigation')` and `await getTranslations('footer')` `[Footer.tsx:Footer]`, `[Header.tsx:Header]`.
- Reads the runtime system clock via `new Date().getFullYear()` during render `[Footer.tsx:Footer]`.
- Performs declarative client-side route navigation via `@/i18n/navigation` `<Link>` to `'/'` (`[Footer.tsx:Footer]`) and `'/'`, `'/sign-in'`, `'/sign-up'` (`[Header.tsx:Header]`).
- Delegates locale-switching and theme-toggling side effects to rendered child components `<LanguageSwitcher />` and `<ModeToggle />` `[Header.tsx:Header]`.

## Verification
- Run: `pnpm lint && pnpm build`
