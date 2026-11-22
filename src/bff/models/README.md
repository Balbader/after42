# models

## Overview
Defines BFF domain models (`Session`, `User`), Drizzle-derived adapter input types, and Zod authentication validation schemas (`SignUpSchema`, `SignInSchema`). Converts raw Drizzle ORM rows and Better Auth payloads into typed domain instances and JSON-serializable plain objects.

## Interface
- `Session` (`[session.model.ts:Session]`): Domain class with fields `id`, `userId`, `expiresAt: Date`, `token`, `ipAddress?`, `userAgent?`; methods `isExpired(): boolean` (`[session.model.ts:Session.isExpired]`), `isValid(): boolean` (`[session.model.ts:Session.isValid]`), `static fromDatabase(dbSession: SessionSource): Session` (`[session.model.ts:Session.fromDatabase]`), and `toJSON()` (`[session.model.ts:Session.toJSON]`).
- `User` (`[user.model.ts:User]`): Domain class with fields `id`, `name`, `email`, `role`, `dateOfBirth`, `termsAcceptedAt`, `privacyPolicyAcceptedAt`, `avatar`; methods `static fromDatabase(dbUser: UserSource): User` (`[user.model.ts:User.fromDatabase]`) and `toJSON()` (`[user.model.ts:User.toJSON]`).
- `SignUpSchema` & `SignUpInput` (`[user.model.ts:SignUpSchema]`, `[user.model.ts:SignUpInput]`): Zod schema and inferred type validating `role` (`'candidate' | 'recruiter'`), `first_name`, `last_name`, `email`, `password` (min 8 chars), and numeric-coerced `dateOfBirth`, `termsAcceptedAt`, and `privacyPolicyAcceptedAt` (each >= 1).
- `SignInSchema` & `SignInInput` (`[user.model.ts:SignInSchema]`, `[user.model.ts:SignInInput]`): Zod schema and inferred type validating `email` and `password` (min 8 chars).

## Invariants
- `Session.isExpired()` evaluates strict `new Date() > this.expiresAt`, and `Session.isValid()` returns `!this.isExpired()` (`[session.model.ts:Session.isExpired]`, `[session.model.ts:Session.isValid]`).
- `Session.fromDatabase` wraps `expiresAt` in `new Date(...)` and normalizes `null` `ipAddress`/`userAgent` to `undefined`; `Session.toJSON()` serializes `expiresAt` to ISO-8601 and includes `token` (`[session.model.ts:Session.fromDatabase]`, `[session.model.ts:Session.toJSON]`).
- `SignUpSchema` restricts `role` to `'candidate' | 'recruiter'`, enforces `password.min(8)`, and only requires `>= 1` after numeric coercion for `dateOfBirth`, `termsAcceptedAt`, and `privacyPolicyAcceptedAt` (no minimum-age or timestamp-range validation) (`[user.model.ts:SignUpSchema]`).
- `User.fromDatabase` always resolves a non-null `avatar` string via `dbUser.avatar ?? dbUser.image ?? ''` (`[user.model.ts:User.fromDatabase]`).

## Side Effects
- None (pure domain models and Zod schemas; `Session.isExpired()` only reads current wall-clock time via `new Date()` `[session.model.ts:Session.isExpired]`).

## Verification
- Run: `pnpm lint && pnpm build`
