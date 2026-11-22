# Better Auth Catch-All Route (`[...all]`)

## Overview
Next.js App Router catch-all API route (`src/app/api/auth/[...all]`) mounting Better Auth's HTTP handlers for all authentication endpoints under `/api/auth/*`.

## Interface
- `POST`: Next.js Route Handler (destructured from `toNextJsHandler(auth)`) `[route.ts:POST]`
- `GET`: Next.js Route Handler (destructured from `toNextJsHandler(auth)`) `[route.ts:GET]`

## Invariants
- None

## Side Effects
- Delegates all HTTP `GET` and `POST` requests under `/api/auth/*` to the Better Auth instance (`auth` from `@/lib/auth`) via `toNextJsHandler(auth)` from `better-auth/next-js` `[route.ts:POST,GET]`

## Verification
- Run: `pnpm lint && pnpm build`
