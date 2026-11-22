# services

## Overview
Provides the BFF authentication service (`AuthService` / `authService`) integrating Better Auth server APIs (`auth.api` from `@/lib/auth`) for sign-up, sign-in, sign-out, and session retrieval alongside direct Drizzle ORM lookups against the `user` table. Maps raw auth/DB results into `User` and `Session` domain models while converting all exceptions into structured failure objects or `null`.

## Interface
- `AuthService` (`[auth.service.ts:AuthService]`):
  - `signUp(input: SignUpInput, callbackURL = '/dashboard', headers?: Headers)` (`[auth.service.ts:AuthService.signUp]`): calls `auth.api.signUpEmail` and returns `{ success: true, user: User | null }` or `{ success: false, error: string }`.
  - `signIn(input: SignInInput, callbackURL = '/dashboard', headers?: Headers)` (`[auth.service.ts:AuthService.signIn]`): calls `auth.api.signInEmail` and returns `{ success: true, user: User | null }` or `{ success: false, error: string }`.
  - `signOut(headers: Headers)` (`[auth.service.ts:AuthService.signOut]`): calls `auth.api.signOut({ headers })` and returns `{ success: true }` or `{ success: false, error: string }`.
  - `getSession(headers: Headers)` (`[auth.service.ts:AuthService.getSession]`): calls `auth.api.getSession({ headers })` and returns `{ success: true, session: Session, user: User | null }`, `{ success: false, session: null, user: null }`, or `{ success: false, error: string, session: null, user: null }`.
  - `getUserById(userId: string): Promise<User | null>` (`[auth.service.ts:AuthService.getUserById]`): queries `db.select().from(user).where(eq(user.id, userId)).limit(1)` and returns `User | null`.
- `authService` (`[auth.service.ts:authService]`): Module-level singleton instance (`new AuthService()`).

## Invariants
- All `AuthService` methods catch exceptions and never throw, normalizing unknown errors via internal `getErrorMessage` to fallback messages (`'Sign up failed'`, `'Sign in failed'`, `'Sign out failed'`, `'Failed to get session'`) or returning `null` in `getUserById` (`[auth.service.ts:getErrorMessage]`, `[auth.service.ts:AuthService.getUserById]`).
- `signUp` concatenates `${input.first_name} ${input.last_name}` as `name` and casts `input.role` (validated as `'candidate' | 'recruiter'`) via TypeScript assertion `as 'programmer' | 'recruiter'` without runtime value translation (`[auth.service.ts:AuthService.signUp]`).
- `signUp` and `signIn` default `callbackURL` to `'/dashboard'` and only forward `headers` when truthy (`[auth.service.ts:AuthService.signUp]`, `[auth.service.ts:AuthService.signIn]`).
- `getSession` treats `!result || !result.session` as unauthenticated `{ success: false, session: null, user: null }` without an `error` property (`[auth.service.ts:AuthService.getSession]`).
- `getUserById` performs a single-row lookup (`limit(1)`) by primary key equality on `user.id` (`[auth.service.ts:AuthService.getUserById]`).

## Side Effects
- Invokes Better Auth server APIs (`auth.api.signUpEmail`, `auth.api.signInEmail`, `auth.api.signOut`, `auth.api.getSession`), mutating user/session records and setting or clearing session cookies via `nextCookies()` when `headers` are supplied (`[auth.service.ts:AuthService.signUp]`, `[auth.service.ts:AuthService.signIn]`, `[auth.service.ts:AuthService.signOut]`, `[auth.service.ts:AuthService.getSession]`).
- Executes a Drizzle SQLite `SELECT` query against `user` (`[auth.service.ts:AuthService.getUserById]`).
- Writes error output via `console.error('Failed to get user:', error)` when `getUserById` catches an exception (`[auth.service.ts:AuthService.getUserById]`).

## Verification
- Run: `pnpm lint && pnpm build`
