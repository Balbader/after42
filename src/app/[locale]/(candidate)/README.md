# Candidate Route Group (`(candidate)`)

## Overview
Candidate route-group Server Component layout (`src/app/[locale]/(candidate)`) configuring `next-intl` request locale, enforcing candidate role authorization, and rendering the shared sidebar application shell (`SidebarProvider`, `AppSidebar`, `SidebarInset`, and `DynamicBreadcrumb`).

## Interface
- `default export Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }): Promise<JSX.Element>` — Server Component enforcing candidate role access and wrapping child routes in the sidebar navigation chrome `[layout.tsx:Layout]`
- Subdirectories:
  - [`candidate`](./candidate/README.md) — Candidate route namespace housing `/candidate/challenges`, `[id]`, and `[id]/submit`.

## Invariants
- Awaits `params` (`Promise<{ locale: string }>`) and invokes `setRequestLocale(locale)` `[layout.tsx:Layout]`
- Enforces candidate role authorization via `await requireRole('candidate')` before rendering `AppSidebar` (`user={userPlain}`) and child pages `[layout.tsx:Layout]`

## Side Effects
- Configures `next-intl` request locale via `setRequestLocale(locale)` `[layout.tsx:Layout]`
- Verifies candidate auth session and role via `requireRole('candidate')` `[layout.tsx:Layout]`

## Verification
- Run: `pnpm lint && pnpm build`
