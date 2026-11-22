# Logged-In Route Group (`(logged-in)`)

## Overview
Authenticated Next.js route-group layout (`src/app/[locale]/(logged-in)`) enforcing session validation across all nested authenticated pages and rendering the shared sidebar navigation shell (`SidebarProvider`, `AppSidebar`, `SidebarInset`, `SidebarTrigger`, `Separator`, and `DynamicBreadcrumb`).

## Interface
- `default export Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }): Promise<JSX.Element>` — Server Component validating session, configuring locale, and rendering the sidebar navigation shell `[layout.tsx:Layout]`
- Subdirectories:
  - [`challenge`](./challenge/README.md) — Authenticated `/challenge` redirect to `/dashboard?tab=pipeline` plus recruiter-only `create` job-post-to-challenge flow.
  - [`chat`](./chat/README.md) — Mastra-backed AI chat Server/Client route with memory recall and AI SDK `useChat` streaming over `/api/chat`.
  - [`dashboard`](./dashboard/README.md) — Role-branched dashboard serving candidate guidance or recruiter aggregate stats and `RecruiterUnifiedDashboardClient`.
  - [`profile`](./profile/README.md) — Read-only authenticated account profile view formatted for the active locale.

## Invariants
- Enforces authentication across the entire `(logged-in)` route group via `await authController.requireSession(await headers())` `[layout.tsx:Layout]`
- Awaits `params` (`Promise<{ locale: string }>`) and invokes `setRequestLocale(locale)` `[layout.tsx:Layout]`
- Serializes the session user model via `user ? (user as User).toJSON() : null` before passing it into the client component `AppSidebar` `[layout.tsx:Layout]`

## Side Effects
- Configures `next-intl` request locale via `setRequestLocale(locale)` `[layout.tsx:Layout]`
- Reads Next.js request headers via `headers()` and validates session via `authController.requireSession(await headers())` `[layout.tsx:Layout]`

## Verification
- Run: `pnpm lint && pnpm build`
