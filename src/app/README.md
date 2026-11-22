# Next.js App Router Root (`app`)

## Overview
Root Next.js App Router shell (`src/app`) defining HTML metadata, Google Font CSS variables, the locale-aware root layout with `ThemeProvider` and Sonner `Toaster` (`layout.tsx`), global Tailwind v4 / shadcn / after42 light & dark design tokens, scoped markdown prose styles, reduced-motion overrides, and print rules (`globals.css`), plus the static binary site icon (`favicon.ico`). Groups localized UI routes (`[locale]`), Server Actions (`actions`), and HTTP API Route Handlers (`api`).

## Interface
- `metadata`: `Metadata` — Root metadata `{ title: { default: 'after42', template: 'after42 — %s' }, description: 'Blind technical hiring: job posts become coding challenges; candidates are reviewed blind with AI scores and an interview guide.' }` `[layout.tsx:metadata]`
- `default export RootLayout({ children }: Readonly<{ children: React.ReactNode }>): Promise<JSX.Element>` — Root Server Component resolving `<html lang>`, applying Google Font CSS variables, and mounting `ThemeProvider` and `Toaster` `[layout.tsx:RootLayout]`
- CSS custom variant: `@custom-variant dark (&:is(.dark *))` `[globals.css:@custom-variant]`
- CSS `@theme inline` tokens: `--color-background`, `--color-foreground`, `--font-sans`, `--font-mono`, `--color-sidebar*`, `--color-chart-1`..`--color-chart-5`, `--color-ring`, `--color-input`, `--color-border`, `--color-destructive`, `--color-accent*`, `--color-muted*`, `--color-secondary*`, `--color-primary*`, `--color-popover*`, `--color-card*`, `--radius-sm`..`--radius-4xl` `[globals.css:@theme]`
- CSS `:root` and `.dark` custom properties: `--radius` (`:root`), shadcn/Tailwind palette variables, and after42 design tokens (`--a42-bg`, `--a42-surface`, `--a42-surface-2`, `--a42-border`, `--a42-border-strong`, `--a42-text`, `--a42-text-muted`, `--a42-text-faint`, `--a42-accent`, `--a42-accent-hover`, `--a42-accent-light`, `--a42-score-high*`, `--a42-score-mid*`, `--a42-score-low*`) `[globals.css::root,.dark]`
- CSS scoped prose & print classes: `.candidate-readme` (and `.dark .candidate-readme`), `.recruiter-challenge-brief`, `.interview-guide-print`, `.guide-answer` `[globals.css:.candidate-readme,.recruiter-challenge-brief,@media print]`
- Static binary asset: `favicon.ico` (Next.js App Router default site icon)
- Subdirectories:
  - [`[locale]`](<./[locale]/README.md>) — Localized UI routes across public `(pages)`, session-gated `(logged-in)`, candidate-gated `(candidate)`, and recruiter-gated `(company)` route groups.
  - [`actions`](./actions/README.md) — `'use server'` Server Actions for auth delegation, job-post ingestion/CRUD, challenge generation/closing, idempotent challenge forking, submission archiving, and Mastra scoring execution.
  - [`api`](./api/README.md) — HTTP Route Handlers for Better Auth (`/api/auth/[...all]`), Mastra streaming chat (`/api/chat`), GitHub fork commits (`/api/commits/[forkName]`), and Resend welcome emails (`/api/emails`).

## Invariants
- `RootLayout` resolves `<html lang>` from request headers `x-next-intl-locale` or `X-NEXT-INTL-LOCALE`, falling back to `routing.defaultLocale` (`@/i18n/routing`) `[layout.tsx:RootLayout]`
- `<html>` sets `suppressHydrationWarning` to support class-based theme hydration with `ThemeProvider` (`attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`) `[layout.tsx:RootLayout]`
- Loads five Google Fonts via `next/font/google` (`Geist` -> `--font-geist-sans`, `Geist_Mono` -> `--font-geist-mono`, `DM_Sans` -> `--font-dm-sans`, `Fraunces` -> `--font-fraunces`, `JetBrains_Mono` -> `--font-mono`) and attaches all five variable classes plus `antialiased` to `<body>` `[layout.tsx:geistSans,geistMono,dmSans,fraunces,jetbrainsMono,RootLayout]`
- `layout.tsx` binds `JetBrains_Mono` to `--font-mono` on `<body>`, while `globals.css` `@theme inline` maps `--font-mono: var(--font-geist-mono)` `[layout.tsx:jetbrainsMono,globals.css:@theme]`
- Dark mode activates via the `.dark` ancestor class (`@custom-variant dark (&:is(.dark *))`) `[globals.css:@custom-variant]`
- `@media (prefers-reduced-motion: reduce)` forces `animation-duration: 0.01ms !important`, `animation-iteration-count: 1 !important`, `transition-duration: 0.01ms !important`, and `scroll-behavior: auto !important` on all elements and pseudo-elements `[globals.css:@media prefers-reduced-motion]`
- `@media print` hides all `body *` except `.interview-guide-print` and its descendants, positions `.interview-guide-print` full-width at top-left, and forces `.guide-answer { display: block !important }` `[globals.css:@media print]`

## Side Effects
- Imports `./globals.css`, pulling in `tailwindcss`, `tw-animate-css`, and `shadcn/tailwind.css` `[layout.tsx:import,globals.css:@import]`
- Reads Next.js dynamic request headers via `await headers()` on every render of `RootLayout` `[layout.tsx:RootLayout]`
- Mounts global client providers/UI chrome: `ThemeProvider` (`@/components/theme-provider`) and `<Toaster closeButton />` (`@/components/ui/sonner`) `[layout.tsx:RootLayout]`
- Applies global `@layer base` DOM styles: `*` border/outline defaults, `h1..h4` `text-wrap: balance`, and `body` background (`--a42-bg`), text color (`--a42-text`), and font family (`--font-dm-sans`) `[globals.css:@layer base]`

## Verification
- Run: `pnpm lint && pnpm build`
