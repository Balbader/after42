# Layout (`src/components/layout`)

## Overview
Provides shared layout navigation primitives for the application shell. At this directory level, `DynamicBreadcrumb` renders a localized, client-side breadcrumb trail derived from the active route pathname using `@/i18n/navigation`'s `usePathname`, an allowlist of `next-intl` translation keys, and `@/components/ui/breadcrumb` primitives. Global header and footer chrome live in the `./navigation` child package.

## Interface
- `DynamicBreadcrumb()` (`'use client'`, named export, no props): Renders `<Breadcrumb>` from the active locale-stripped pathname via `usePathname()` and `useTranslations('breadcrumb')`, linking non-terminal segments with `@/i18n/navigation` `<Link>` and rendering the terminal segment as `<BreadcrumbPage>` `[dynamic-breadcrumb.tsx:DynamicBreadcrumb]`.
- Subdirectories:
  - [`./navigation/README.md`](./navigation/README.md) — Site-wide async Server Component navigation chrome (`Header` default export with `'/'`, `'/sign-in'`, `'/sign-up'` links plus `<LanguageSwitcher />` and `<ModeToggle />`; `Footer` default export with `'/'` brand link and dynamic current-year copyright).

## Invariants
- `DynamicBreadcrumb` is a client-only component (`'use client'`) requiring `next-intl` client provider context for `useTranslations('breadcrumb')` and `@/i18n/navigation` routing context for `usePathname()` `[dynamic-breadcrumb.tsx:DynamicBreadcrumb]`.
- Pathname segmentation splits on `'/'` and filters empty segments via `pathname.split('/').filter(Boolean)` `[dynamic-breadcrumb.tsx:DynamicBreadcrumb]`.
- Root/dashboard collapse: when `segments.length === 0 || (segments.length === 1 && segments[0] === 'dashboard')`, returns early with a single `<BreadcrumbPage>{t('dashboard')}</BreadcrumbPage>` without links or separators `[dynamic-breadcrumb.tsx:DynamicBreadcrumb]`.
- Leading dashboard prefix: for all other pathnames, unconditionally prepends `<BreadcrumbItem className='hidden md:block'>` linking to `'/dashboard'` before mapping every segment in `segments` (note: on nested `/dashboard/...` paths, `'dashboard'` is rendered both as the prepended item and as the first mapped segment) `[dynamic-breadcrumb.tsx:DynamicBreadcrumb]`.
- Translation key allowlist guard: `t(segment)` is only called when `isBreadcrumbKey(segment)` matches `BREADCRUMB_KEYS` (`'dashboard'`, `'challenge'`, `'create'`, `'my-challenges'`, `'profile'`, `'chat'`, `'candidate'`, `'company'`, `'challenges'`, `'submissions'`, `'candidates'`, `'submit'`); all other segments fall back to `titleCaseSegment(segment)` (`segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())`) `[dynamic-breadcrumb.tsx:BREADCRUMB_KEYS]`, `[dynamic-breadcrumb.tsx:isBreadcrumbKey]`, `[dynamic-breadcrumb.tsx:titleCaseSegment]`, `[dynamic-breadcrumb.tsx:DynamicBreadcrumb]`.
- Terminal segment rule: `i === segments.length - 1` renders `<BreadcrumbPage>`; earlier segments render `<BreadcrumbLink asChild><Link href={path}>` keyed by cumulative `path = '/' + segments.slice(0, i + 1).join('/')`, with leading root item and all `<BreadcrumbSeparator>` elements carrying `className='hidden md:block'` `[dynamic-breadcrumb.tsx:DynamicBreadcrumb]`.

## Side Effects
- Subscribes to active pathname updates via `usePathname()` (`@/i18n/navigation`) and reads client-side translations via `useTranslations('breadcrumb')` `[dynamic-breadcrumb.tsx:DynamicBreadcrumb]`.
- Performs declarative client-side navigation via `@/i18n/navigation` `<Link>` to `'/dashboard'` and cumulative segment paths `'/' + segments.slice(0, i + 1).join('/')` `[dynamic-breadcrumb.tsx:DynamicBreadcrumb]`.
- Child package `./navigation` performs async server-side translation reads (`getTranslations`), system clock read (`new Date().getFullYear()`), declarative route links (`'/'`, `'/sign-in'`, `'/sign-up'`), and delegates locale/theme toggling to `<LanguageSwitcher />` and `<ModeToggle />` (see [`./navigation/README.md`](./navigation/README.md)).

## Verification
- Run: `pnpm lint && pnpm build`
