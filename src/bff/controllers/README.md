# controllers

## Overview
Implements the server-side authentication controller (`AuthController` / `authController`) for Next.js Server Actions and Server Components. Parses `FormData`, validates credentials and registration payloads with Zod (`SignUpSchema`, `SignInSchema`), delegates execution to `authService`, serializes user payloads via `.toJSON()` for sign-up/sign-in responses, and enforces authenticated access via locale-aware redirects.

## Interface
- `AuthController` (`[auth.controller.ts:AuthController]`):
  - `signUp(formData: FormData, headers?: Headers)` (`[auth.controller.ts:AuthController.signUp]`): extracts `role`, `first_name`, `last_name`, `email`, `password`, `dateOfBirth`, `termsAcceptedAt`, `privacyPolicyAcceptedAt`; validates with `SignUpSchema.safeParse`; calls `authService.signUp(validation.data, '/dashboard', headers)`; returns `{ success: true, user }` (plain JSON via `toJSON()`) or `{ success: false, error, fieldErrors? }`.
  - `signIn(formData: FormData, headers?: Headers)` (`[auth.controller.ts:AuthController.signIn]`): extracts `email`, `password`; validates with `SignInSchema.safeParse`; calls `authService.signIn(validation.data, '/dashboard', headers)`; returns `{ success: true, user }` (plain JSON via `toJSON()`) or `{ success: false, error, fieldErrors? }`.
  - `signOut(headers: Headers)` (`[auth.controller.ts:AuthController.signOut]`): delegates to `authService.signOut(headers)` and returns `{ success: true }` or `{ success: false, error }`.
  - `getCurrentUser(headers: Headers)` (`[auth.controller.ts:AuthController.getCurrentUser]`): returns `User | null` from `authService.getSession(headers)`.
  - `getSession(headers: Headers)` (`[auth.controller.ts:AuthController.getSession]`): returns `{ session: Session | null, user: User | null }`.
  - `requireSession(headers: Headers)` (`[auth.controller.ts:AuthController.requireSession]`): validates session presence, redirecting to `'/'` with the active locale when `!session`, or returning `{ session, user }`.
- `authController` (`[auth.controller.ts:authController]`): Module-level singleton instance (`new AuthController()`).

## Invariants
- `signUp` and `signIn` validate raw `FormData` with `SignUpSchema.safeParse` / `SignInSchema.safeParse` before calling `authService`, returning `firstError.message` and flattened `fieldErrors` on failure (`[auth.controller.ts:AuthController.signUp]`, `[auth.controller.ts:AuthController.signIn]`).
- Both `signUp` and `signIn` pass a hardcoded `callbackURL = '/dashboard'` and forward optional `headers` needed for `nextCookies()` cookie mutation (`[auth.controller.ts:AuthController.signUp]`, `[auth.controller.ts:AuthController.signIn]`).
- Serialization boundary: `signUp` and `signIn` return plain objects (`result.user?.toJSON()`), whereas `getCurrentUser`, `getSession`, and `requireSession` return `User` and `Session` class instances or `null` (`[auth.controller.ts:AuthController.signUp]`, `[auth.controller.ts:AuthController.getSession]`).
- `getCurrentUser` normalizes failure/missing user to `null`, `getSession` normalizes failure to `{ session: null, user: null }`, and `requireSession` gates solely on `if (!session)` (`[auth.controller.ts:AuthController.getCurrentUser]`, `[auth.controller.ts:AuthController.getSession]`, `[auth.controller.ts:AuthController.requireSession]`).

## Side Effects
- Emits lifecycle logs via `message(...)` in `signUp`, `signIn`, and `signOut`, and `log('No session (requireSession)', 'error')` when unauthenticated (`[auth.controller.ts:AuthController.signUp]`, `[auth.controller.ts:AuthController.requireSession]`).
- Delegates to `authService` (`signUp`, `signIn`, `signOut`, `getSession`), triggering Better Auth API calls and session cookie updates (`[auth.controller.ts:AuthController.signUp]`, `[auth.controller.ts:AuthController.signIn]`, `[auth.controller.ts:AuthController.signOut]`, `[auth.controller.ts:AuthController.getSession]`).
- Resolves active locale via `next-intl/server` `getLocale()` and triggers a navigation redirect via `@/i18n/navigation` `redirect({ href: '/', locale })` when unauthenticated in `requireSession` (`[auth.controller.ts:AuthController.requireSession]`).

## Verification
- Run: `pnpm lint && pnpm build`
