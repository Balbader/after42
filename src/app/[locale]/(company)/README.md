# Company Route Group (`(company)`)

## Overview
Company/recruiter route-group Server Component layout (`src/app/[locale]/(company)`) configuring `next-intl` request locale, enforcing recruiter role authorization, and rendering the shared sidebar application shell (`SidebarProvider`, `AppSidebar`, `SidebarInset`, and `DynamicBreadcrumb`).

## Interface
- `default export Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }): Promise<JSX.Element>` — Server Component enforcing recruiter role access and wrapping child routes in the sidebar navigation chrome `[layout.tsx:Layout]`
- Subdirectories:
  - [`company`](./company/README.md) — Recruiter route namespace housing `/company/candidates`, `/company/challenges` (with `[id]`, `submissions`, and `[submissionId]`), and `/company/profile`.

## Invariants
- Awaits `params` (`Promise<{ locale: string }>`) and invokes `setRequestLocale(locale)` `[layout.tsx:Layout]`
- Enforces recruiter role authorization via `await requireRole('recruiter')` before rendering `AppSidebar` (`user={userPlain}`) and child pages `[layout.tsx:Layout]`

## Side Effects
- Configures `next-intl` request locale via `setRequestLocale(locale)` `[layout.tsx:Layout]`
- Verifies recruiter auth session and role via `requireRole('recruiter')` `[layout.tsx:Layout]`

## Verification
- Run: `pnpm lint && pnpm build`
