# src/i18n

## Overview
Internationalization configuration for the Next.js application powered by `next-intl`. Centralizes the supported locale routing definition (`routing.ts`), exposes locale-aware navigation primitives bound to that configuration (`navigation.ts`), and provides the server-side `next-intl/server` request configuration callback that validates incoming locales and resolves static message bundles (`request.ts`).

## Interface
- `routing` — `defineRouting({ locales: ['fr', 'en'], defaultLocale: 'fr', localePrefix: 'always' })` routing configuration `[routing.ts:routing]`
- `type AppLocale = (typeof routing.locales)[number]` — union type `'fr' | 'en'` `[routing.ts:AppLocale]`
- `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` — locale-aware navigation wrappers created via `createNavigation(routing)` `[navigation.ts:Link]`, `[navigation.ts:redirect]`, `[navigation.ts:usePathname]`, `[navigation.ts:useRouter]`, `[navigation.ts:getPathname]`
- `default` — `getRequestConfig` async resolver returning `{ locale, messages }` per server request `[request.ts:default]`

## Invariants
- **Supported locales and default**: Supported locales are strictly `['fr', 'en']`, default locale is `'fr'`, and `localePrefix: 'always'` requires locale prefixes on all localized routes `[routing.ts:routing]`, `[routing.ts:AppLocale]`.
- **Single routing source of truth**: Navigation primitives are derived directly from `routing` `[navigation.ts:Link]`.
- **Locale validation and fallback**: Incoming `requestLocale` is awaited and checked with `hasLocale(routing.locales, requested)`; invalid or missing locales fall back to `routing.defaultLocale` (`'fr'`) `[request.ts:default]`.
- **Static message map coupling**: Every locale in `routing.locales` must have a matching key in `const messages = { en, fr } as const` (imported from `@/messages/en.json` and `@/messages/fr.json`) so `messages[locale as keyof typeof messages]` resolves cleanly at runtime `[request.ts:messages]`, `[request.ts:default]`.

## Side Effects
- **Static JSON bundle imports and module initialization**: Statically imports `@/messages/en.json` and `@/messages/fr.json` `[request.ts:messages]`, and executes `defineRouting(...)` `[routing.ts:routing]`, `createNavigation(routing)` `[navigation.ts:Link]`, and `getRequestConfig(...)` `[request.ts:default]` at module evaluation.
- **Per-request locale resolution**: Awaits the `next-intl/server` `requestLocale` promise on each server request `[request.ts:default]`.

## Verification
- Run: `pnpm lint && pnpm build`
