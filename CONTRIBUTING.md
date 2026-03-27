# Contributing to after42

## Prerequisites

- **Node.js** 20+
- **pnpm** (package manager used in this repo)
- **Turso** (or compatible LibSQL) database — URLs and token in environment variables

## Clone and install

```bash
git clone <repository-url>
cd after42
pnpm install
```

## Environment

Copy `.env.example` to `.env` and fill in values (database, Better Auth, Resend, Anthropic, optional GitHub App for challenge repos). See [`CLAUDE.md`](./CLAUDE.md) § Environment Variables for the full list.

## Database

After schema changes:

```bash
pnpm dbg   # generate SQL migrations from src/db/schemas/
pnpm dbm   # apply migrations
```

For local experimentation only, `pnpm dbp` can push schema without a migration file (avoid in shared / production workflows).

Seed test users and sample data:

```bash
pnpm seed
```

## Quality checks

```bash
pnpm lint
pnpm build
```

There is no automated test runner configured; rely on lint, manual QA, and typecheck via `pnpm exec tsc --noEmit` when needed.

## Documentation

- **Architecture and diagrams:** [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md), [`docs/DATA-MODEL.md`](./docs/DATA-MODEL.md)
- **Design system (UI):** [`DESIGN.md`](./DESIGN.md)
- **AI / Mastra conventions:** [`AGENTS.md`](./AGENTS.md)
- **Daily coding context for assistants:** [`CLAUDE.md`](./CLAUDE.md)

## Pull requests

- Keep changes scoped to the problem being solved.
- Match existing patterns (i18n via `next-intl`, locale-aware navigation from `src/i18n/navigation.ts`).
- Do not expose blind-review fields (`candidateId`, `githubForkName`) in recruiter-facing APIs or UI.
