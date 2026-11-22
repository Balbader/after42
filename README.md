# after42 Blueprint

## System Overview
Recruitment platform built with **Next.js** (App Router), **Mastra**, and **Better-auth**. Recruiters upload job posts (PDF/DOCX/TXT/MD); AI extracts structured data and generates coding challenges. Candidates work in GitHub forks; submissions are scored with AI assistance. Recruiter review is **blind** (candidates identified only by sequence number in company UI).

### Documentation

| Doc | Description |
|-----|-------------|
| [**docs/README.md**](./docs/README.md) | Index of all technical docs |
| [**docs/ARCHITECTURE.md**](./docs/ARCHITECTURE.md) | System architecture, routing, flows (**Mermaid** diagrams) |
| [**docs/DATA-MODEL.md**](./docs/DATA-MODEL.md) | Entities, relationships, blind-review rules |
| [**DESIGN.md**](./DESIGN.md) | Typography, colors, layout |
| [**CONTRIBUTING.md**](./CONTRIBUTING.md) | Local setup, DB workflow, PR notes |
| [**CLAUDE.md**](./CLAUDE.md) | Detailed guide for AI coding assistants |
| [**AGENTS.md**](./AGENTS.md) | Mastra project layout and skills |

### Quick start

```bash
pnpm install
# Create .env (e.g. `vercel env pull .env`) with Turso, auth, Resend, Anthropic, and GitHub App vars
pnpm dbm               # apply migrations
pnpm dev               # http://localhost:3000
```

Optional: `pnpm seed` for test users and sample challenges. Mastra Studio: `npx mastra dev` (separate port, see `AGENTS.md`).

### Stack (short)

- **Framework:** Next.js 16, React 19, TypeScript
- **Data:** Drizzle ORM, Turso (LibSQL)
- **Auth:** Better-auth, email verification (Resend)
- **AI:** Mastra, Anthropic via `@ai-sdk/anthropic`
- **i18n:** next-intl (`fr` default, `en`)
- **UI:** Tailwind CSS 4, components under `src/components/`

## Local Interface & Invariants
- `drizzle.config.ts` (`default`) — Drizzle Kit config (`schema: './src/db/schemas/**/*.ts'`, `out: './src/db/migrations'`, `dialect: 'turso'`, credentials from `TURSO_CONNECTION_URL!` and `TURSO_AUTH_TOKEN!`); loads `.env` via top-level `dotenv` `config({ path: '.env' })` `[drizzle.config.ts:default]` `[drizzle.config.ts:config]`.
- `eslint.config.mjs` (`default`) — Flat ESLint config composing `eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`, and `globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts'])` `[eslint.config.mjs:default]` `[eslint.config.mjs:globalIgnores]`.
- `next.config.ts` (`default`) — Wraps `NextConfig` with `createNextIntlPlugin('./src/i18n/request.ts')` `[next.config.ts:default]` `[next.config.ts:withNextIntl]`.
- `postcss.config.mjs` (`default`) — Enables `@tailwindcss/postcss` plugin `[postcss.config.mjs:default]`.

## Subdirectories & System Boundaries
- **Source (`src`)**: [`./src/README.md`](./src/README.md) — Application source tree containing Next.js App Router pages/actions/API routes (`./src/app/README.md`), BFF auth layer (`./src/bff/README.md`), React UI and AI component libraries (`./src/components/README.md`), Drizzle/Turso database schemas and migrations (`./src/db/README.md`), React Email templates (`./src/emails/README.md`), hooks (`./src/hooks/README.md`), `next-intl` config (`./src/i18n/README.md`), shared libraries (`./src/lib/README.md`), and Mastra agents/tools/workflows (`./src/mastra/README.md`).
- **Database Scripts (`scripts`)**: [`./scripts/README.md`](./scripts/README.md) — Standalone TypeScript CLI scripts for idempotent dev fixture seeding (`seed.ts`) and destructive FK-ordered full database reset + re-seed (`full-reset.ts`).
- **Technical Documentation (`docs`)**: [`./docs/README.md`](./docs/README.md) — Architecture, data model, and system documentation index.

## Global Invariants
- **Strict Locale Routing**: Supported locales are strictly `['fr', 'en']` with `defaultLocale: 'fr'` and `localePrefix: 'always'`; `src/proxy.ts` excludes `api`, `_next`, `_vercel`, and dotted asset paths from locale rewriting `[src/i18n/routing.ts:routing]` `[src/proxy.ts:config.matcher]`.
- **Database & Schema Contracts**: All 11 application tables use caller-supplied text primary keys in SQLite/Turso; only `session.userId` and `account.userId` enforce SQL `ON DELETE CASCADE` foreign keys, while domain relationships (`job_post`, `challenge`, `candidate_submission`, `challenge_counter`) are enforced in application logic and FK-ordered script deletes `[src/db/schemas/schema.ts:session]` `[scripts/full-reset.ts:TABLES_IN_DELETE_ORDER]`.
- **Auth, Role & Ownership Boundaries**: Authenticated routes enforce session via `authController.requireSession` and role access via `requireRole('candidate' | 'recruiter')`; recruiter mutations verify `challenge.creatorId === sessionUser.id`, and candidate submissions enforce ownership and state transitions (`forked -> submitted -> scoring -> scored | failed`) with atomic per-challenge `sequenceNum` allocation via `challenge_counter` `[src/lib/require-role.ts:requireRole]` `[src/app/actions/fork-challenge.ts:forkChallenge]`.
- **Separate AI Memory Storage**: Mastra initializes an independent local LibSQL store (`file:./mastra.db`) distinct from the application's Turso `@/db` client `[src/mastra/index.ts:mastra]` `[src/db/index.ts:db]`.
- **Required Environment Variables**: Database access requires `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN`; email routes/auth instantiate `Resend` at module load requiring `RESEND_API_KEY`; GitHub repo automation requires `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY` (base64 PEM), and `GITHUB_ORG_NAME` (falling back to draft/zero-commit behavior when unset); Mastra LLM tools require `ANTHROPIC_API_KEY` `[src/db/index.ts:db]` `[src/lib/auth.ts:resend]` `[src/lib/github.ts:requireGithubEnv]` `[src/mastra/tools/challenge-generator-tool.ts:challengeGeneratorTool]`.

## Global Side Effects
- **Database Persistence**: Reads and mutates Turso/libSQL via Drizzle (`@/db`), executes raw SQL deletes in maintenance scripts (`scripts/full-reset.ts`), and reads/writes local `./mastra.db` for Mastra agent memory and traces.
- **External Service Integrations**: Calls Anthropic HTTPS APIs (`claude-haiku-4-5-20251001`, `claude-sonnet-4-5-20250929`) via Mastra/Vercel AI SDK, GitHub REST APIs via Octokit (repo creation, forking, polling, archiving, tree/commit reads), Resend APIs for transactional emails, and optional Mastra Cloud telemetry export when `MASTRA_CLOUD_ACCESS_TOKEN` is set.
- **Session, Cookies & Browser State**: Mutates HTTP cookies via Better Auth (`nextCookies()`) and client sidebar preference cookies (`sidebar_state`), manages theme/locale state on the client, and triggers background scoring via unawaited `triggerScoring` after candidate submission.

## System Verification
- Run: `pnpm lint && pnpm build`

## License
Private / see repository settings.
