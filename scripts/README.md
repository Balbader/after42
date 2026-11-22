# scripts

## Overview
Standalone TypeScript database maintenance CLI scripts supporting local development and testing workflows. `seed.ts` idempotently cleans previously seeded fixture records and populates a consistent baseline dataset (4 Better Auth users, 1 job post, 1 active challenge, 3 candidate submissions across `scored`/`submitted`/`forked` states, and a matching `challenge_counter`). `full-reset.ts` destructively wipes all rows across every domain and Better Auth table in foreign-key-safe order before dynamically importing `seed.ts` to re-seed the database.

## Interface
No ES module symbols are exported; both scripts execute immediately at module load as standalone CLI entrypoints (`pnpm full-reset` and `pnpm seed`):
- `scripts/full-reset.ts` (`fullReset`, `TABLES_IN_DELETE_ORDER`): wipes all 11 tables in foreign-key-safe order and invokes `./seed` `[full-reset.ts:fullReset]`, `[full-reset.ts:TABLES_IN_DELETE_ORDER]`
- `scripts/seed.ts` (`main`, `cleanup`, `createUsers`, `seedData`, `makeSubmissions`, `SEED_PASSWORD`, `SEED_USERS`, `SEED_EMAILS`, `JOB_POST`, `CHALLENGE`): cleans prior `seed-%` rows and seed users, creates 4 verified Better Auth accounts, and inserts deterministic domain fixtures `[seed.ts:main]`, `[seed.ts:cleanup]`, `[seed.ts:createUsers]`, `[seed.ts:seedData]`, `[seed.ts:makeSubmissions]`

## Invariants
- **FK-safe full-wipe deletion order**: `TABLES_IN_DELETE_ORDER` must delete child tables before parent tables in exact sequence: `candidate_submission` -> `challenge_counter` -> `challenge` -> `job_post` -> `programmer` -> `recruiter` -> `company` -> `session` -> `account` -> `verification` -> `user` `[full-reset.ts:TABLES_IN_DELETE_ORDER]`.
- **Wipe-before-seed sequencing**: `fullReset` dynamically imports `./seed` only after all 11 table deletions complete; `seed.ts` runs `main()` as a top-level self-executing promise rather than an awaited export `[full-reset.ts:fullReset]`, `[seed.ts:main]`.
- **Scoped seed idempotency**: `cleanup()` deletes only domain rows with IDs matching `LIKE 'seed-%'` (`candidateSubmission` -> `challengeCounter` -> `challenge` -> `jobPost`) and auth rows (`session` -> `account` -> `user`) matching `SEED_EMAILS` (guarded by `seedUserIds.length > 0`), leaving non-seed records intact `[seed.ts:cleanup]`.
- **Deterministic fixture IDs and counter alignment**: Seeded records use fixed IDs (`seed-jp-001`, `seed-ch-001`, `seed-sub-001`..`seed-sub-003`), `githubRepoName: 'challenge-seed-001'`, `status: 'active'`, and `challenge_counter.seq: 3` matching the highest seeded `sequenceNum` (`3`) `[seed.ts:JOB_POST]`, `[seed.ts:CHALLENGE]`, `[seed.ts:makeSubmissions]`, `[seed.ts:seedData]`.
- **Seeded account state and guard**: All 4 accounts (`sarah.chen@after42.dev` recruiter; `alex.rivera@after42.dev`, `jordan.patel@after42.dev`, `morgan.kim@after42.dev` candidates) share password `'Seed1234!'`, set `termsAcceptedAt`/`privacyPolicyAcceptedAt` to `Date.now()`, and are marked `emailVerified: true`; missing `created.user?.id` throws to abort seeding `[seed.ts:SEED_PASSWORD]`, `[seed.ts:SEED_USERS]`, `[seed.ts:createUsers]`.
- **No environment safety guard**: Neither script checks `NODE_ENV` or prompts for confirmation before deleting data `[full-reset.ts:fullReset]`, `[seed.ts:cleanup]`.

## Side Effects
- **Destructive raw SQL deletes**: Executes `db.run(sql.raw('DELETE FROM "<table>"'))` across all 11 tables `[full-reset.ts:fullReset]`.
- **Dynamic module execution**: Dynamically imports `./seed`, triggering top-level `main()` `[full-reset.ts:fullReset]`.
- **Drizzle DB queries, deletes, updates, and inserts**: Reads `user` by `SEED_EMAILS`, deletes matching seed rows across 7 tables, updates `user.emailVerified = true`, and inserts `job_post`, `challenge`, `candidate_submission`, and `challenge_counter` rows `[seed.ts:cleanup]`, `[seed.ts:createUsers]`, `[seed.ts:seedData]`.
- **Better Auth registration API**: Calls `auth.api.signUpEmail(...)` for each of the 4 seed users `[seed.ts:createUsers]`.
- **Console output**: Logs progress, row counts, errors (`console.error`), and plaintext seed credentials to stdout/stderr `[full-reset.ts:fullReset]`, `[seed.ts:cleanup]`, `[seed.ts:createUsers]`, `[seed.ts:seedData]`, `[seed.ts:main]`.
- **Process termination**: Calls `process.exit(1)` on errors in both scripts and `process.exit(0)` on completion in `seed.ts` `[full-reset.ts:fullReset]`, `[seed.ts:main]`.

## Verification
- Run: `pnpm lint && pnpm build`
