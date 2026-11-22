# bff

## Overview
Backend-for-Frontend (BFF) authentication layer for Next.js Server Actions and Server Components. Exposes the `AuthController` (`authController`), domain models (`User`, `Session`), and Zod validation schemas (`SignUpSchema`, `SignInSchema`) via `src/bff/index.ts` while encapsulating the Better Auth / Drizzle service implementation inside `src/bff/services/`.

## Interface
- Barrel re-exports (`[index.ts:export*]`):
  - `export * from './controllers/auth.controller'` — `AuthController`, `authController`.
  - `export * from './models/user.model'` — `SignUpSchema`, `SignInSchema`, `SignUpInput`, `SignInInput`, `User`.
  - `export * from './models/session.model'` — `Session`.
- Subdirectories:
  - `controllers`: [./controllers/README.md](./controllers/README.md) - Server-side `AuthController` (`authController`) parsing `FormData`, validating with Zod, delegating to `authService`, serializing sign-up/sign-in users via `.toJSON()`, and guarding routes via locale-aware redirects.
  - `models`: [./models/README.md](./models/README.md) - Domain classes (`Session`, `User`), Drizzle/Better Auth adapters (`fromDatabase`), and Zod auth schemas (`SignUpSchema`, `SignInSchema`).
  - `services`: [./services/README.md](./services/README.md) - `AuthService` (`authService`) integrating Better Auth `auth.api` and direct Drizzle `user` table reads with no-throw error normalization.

## Invariants
- Layer encapsulation: `src/bff/services/auth.service` (`AuthService`, `authService`) is intentionally omitted from the `src/bff/index.ts` public barrel (`[index.ts:export*]`).
- All auth inputs flowing through the public controller boundary are validated against `SignUpSchema` / `SignInSchema` before reaching Better Auth (`[index.ts:export*]`, `[controllers/auth.controller.ts:AuthController.signUp]`, `[controllers/auth.controller.ts:AuthController.signIn]`).

## Side Effects
- Importing `src/bff/index.ts` loads `./controllers/auth.controller`, instantiating the module-level singletons `authController` and transitively `authService` (`[index.ts:export*]`).

## Verification
- Run: `pnpm lint && pnpm build`
