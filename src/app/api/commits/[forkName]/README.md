# Fork Commits API Route (`[forkName]`)

## Overview
Next.js App Router dynamic API route (`src/app/api/commits/[forkName]`) returning the candidate's commit count (excluding the initial baseline commit) for an owned GitHub fork repository.

## Interface
- `GET(_request: Request, context: { params: Promise<{ forkName: string }> }): Promise<NextResponse<{ commits: number } | { error: string }>>` — Authenticates candidate ownership of the fork and returns `{ commits }` `[route.ts:GET]`

## Invariants
- Awaits `context.params` and decodes `forkName` via `decodeURIComponent(forkNameParam)` `[route.ts:GET]`
- Requires an authenticated session (`session` and `user` from `authController.getSession`); returns HTTP `401` `{ error: 'Unauthorized' }` if absent `[route.ts:GET]`
- Requires `sessionUser.role === 'candidate'`; returns HTTP `403` `{ error: 'Forbidden' }` for non-candidate roles `[route.ts:GET]`
- Enforces submission ownership by querying `candidateSubmission` matching both `githubForkName = forkName` and `candidateId = sessionUser.id`; returns HTTP `403` `{ error: 'Forbidden' }` if no row matches `[route.ts:GET]`
- Requires both `process.env.GITHUB_APP_ID` and `process.env.GITHUB_APP_PRIVATE_KEY` to query GitHub; if either is unset, short-circuits with HTTP `200` `{ commits: 0 }` `[route.ts:GET]`
- Subtracts 1 baseline commit from the GitHub total and clamps to non-negative via `Math.max(0, total - 1)` `[route.ts:GET]`
- Top-level `catch` suppresses runtime, network, or DB errors and returns HTTP `200` `{ commits: 0 }` `[route.ts:GET]`

## Side Effects
- Reads incoming Next.js request headers via `await headers()` and validates auth session via `authController.getSession(...)` `[route.ts:GET]`
- Executes Drizzle `SELECT` on `candidateSubmission` filtered by `githubForkName` and `candidateId` (`limit(1)`) `[route.ts:GET]`
- Calls external GitHub API helper `github.getCommitCount(forkName)` (`@/lib/github`) when GitHub App environment variables are configured `[route.ts:GET]`

## Verification
- Run: `pnpm lint && pnpm build`
