# db

## Overview
Database entry point for after42. Loads environment variables from `.env`, wires all 11 Drizzle ORM SQLite table schemas (`src/db/schemas/`) and auth relations into a singleton libSQL/Turso client (`db`), and houses sequential Drizzle Kit v7 SQLite migrations (`src/db/migrations/`).

## Interface
- `db` (`[index.ts:db]`): Singleton `drizzle-orm/libsql` client initialized with `{ connection: { url: process.env.TURSO_CONNECTION_URL!, authToken: process.env.TURSO_AUTH_TOKEN! }, schema, relations: schemas.relations }`, registering all 11 tables (`user`, `session`, `account`, `verification`, `jobPost`, `challenge`, `candidateSubmission`, `challengeCounter`, `programmer`, `recruiter`, `company`).
- Subdirectories:
  - `schemas`: [./schemas/README.md](./schemas/README.md) - Declarative Drizzle SQLite definitions for all 11 tables (`user`, `session`, `account`, `verification`, `jobPost`, `challenge`, `candidateSubmission`, `challengeCounter`, `company`, `programmer`, `recruiter`) and auth `relations`.
  - `migrations`: [./migrations/README.md](./migrations/README.md) - Five sequential Drizzle Kit v7 SQLite migrations (`migration.sql` + chained `snapshot.json`) evolving the database from baseline Better Auth tables through hiring, challenge, and candidate submission tables.

## Invariants
- Requires `process.env.TURSO_CONNECTION_URL` and `process.env.TURSO_AUTH_TOKEN` to be defined at runtime (asserted non-null with TypeScript `!` with no runtime fallback or validation in `index.ts`) (`[index.ts:db]`).
- `config({ path: '.env' })` executes before `drizzle(...)` reads `process.env` (`[index.ts:config]`, `[index.ts:db]`).
- Registers all 11 SQLite tables in `schema` alongside `schemas.relations` (covering `user`, `session`, and `account` only), with no explicit connection-pool sizing, timeout, or `PRAGMA foreign_keys` setup in `index.ts` (`[index.ts:db]`).

## Side Effects
- Reads `.env` relative to `process.cwd()` and mutates `process.env` via `dotenv` `config({ path: '.env' })` on module import (`[index.ts:config]`).
- Reads `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` from `process.env` and instantiates the singleton libSQL Drizzle client `db` on module import (`[index.ts:db]`).

## Verification
- Run: `pnpm lint && pnpm build`
