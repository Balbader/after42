# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**after42** is a Next.js application built with TypeScript, combining modern web development with AI capabilities via Mastra. It's a recruitment platform where recruiters upload job posts (PDF/DOCX/TXT), AI extracts structured data, and coding challenges are generated for candidates.

Stack:
- **Next.js 16** with App Router, React 19
- **Mastra 1.3.2** for AI agents, workflows, and tools
- **Better-auth** for authentication with email verification
- **Drizzle ORM** with Turso (LibSQL) database
- **React Email** with Resend for transactional emails
- **Tailwind CSS 4** + shadcn-style UI components in `src/components/ui/`

## Common Commands

### Development
```bash
npm run dev          # Start Next.js dev server (localhost:3000)
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Database (Drizzle)
```bash
npm run dbg          # Generate migrations from schema changes
npm run dbm          # Run migrations
npm run dbp          # Push schema directly to database (dev only)
npm run dbs          # Open Drizzle Studio
```

**Database workflow**: Modify schemas in `src/db/schemas/*.ts`, then run `dbg` + `dbm`.

## Architecture

### Route Groups

- `src/app/(pages)/` — Public routes: home, sign-in, sign-up, forgot/reset-password
- `src/app/(logged-in)/` — Protected routes: dashboard, chat, challenge (create/list/candidates)
- `src/app/api/` — API routes: `auth/[...all]` (Better-auth handler), `chat` (streaming), `emails`
- `src/app/actions/` — Server actions (form submissions, not API routes): `auth.ts`, `job-post.ts`

### BFF Layer (`src/bff/`)

Clean separation of concerns for server-side logic:

```
Server Action → Controller → Service → Better-auth / DB
```

- **Controllers** (`controllers/auth.controller.ts`): Validate input (Zod), coordinate flow, return `{ success, error, data }` shape
- **Services** (`services/auth.service.ts`): Wrap external integrations (Better-auth API calls)
- **Models** (`models/`): Zod schemas (`SignUpSchema`, `SignInSchema`) + domain classes (`User`, `Session`) with `fromDatabase()` / `toJSON()`

### Job Post Processing Pipeline

The core AI workflow (files involved: `src/app/actions/job-post.ts`, `src/lib/file-extractor.ts`, `src/mastra/agents/job-post-processor.ts`, `src/mastra/tools/job-post-extractor-tool.ts`):

1. `JobPostUploader` (client) → `processJobPost()` server action
2. `extractTextFromFile()` — validates file (10MB limit, whitelist: PDF/DOCX/TXT/MD), extracts text via `pdf-parse` / `mammoth` / `TextDecoder`
3. `jobPostProcessorAgent.generate()` — Haiku for routing decision (fast vs accurate), then `jobPostExtractorTool` runs `generateObject()` to return structured `JobPostData`
4. Validate with Zod, save to `job_post` table via nanoid ID
5. Return `{ jobPostId, extractedData }` to client

**Smart model routing** in `job-post-processor.ts`: uses Haiku for short/clean posts, Sonnet for complex/long posts (cost optimization).

### Mastra (`src/mastra/`)

- `index.ts` — Initializes Mastra with LibSQL storage, PinoLogger, observability (DefaultExporter + CloudExporter with SensitiveDataFilter), registers agents
- `agents/` — `weather-agent.ts` (memory-enabled, example), `job-post-processor.ts` (routing + extraction)
- `tools/` — `weather-tool.ts` (OpenMeteo API), `job-post-extractor-tool.ts` (structured AI extraction)
- `workflows/` — `weather-workflow.ts` (two-step: fetch → plan activities)

**CRITICAL**: Before working with Mastra code, load the Mastra skill first using `/mastra` or the Skill tool. Mastra APIs change frequently. Mastra Studio runs at `localhost:4111`.

See [AGENTS.md](./AGENTS.md) for full Mastra guidance.

### Authentication

Better-auth configured in `src/lib/auth.ts`:
- Email/password with required email verification (sent via Resend from `basil@after42.ai`)
- Password reset via email
- Custom user fields: `role`, `dateOfBirth`, `termsAcceptedAt`, `privacyPolicyAcceptedAt`
- `nextCookies()` plugin — auth server actions must pass `headers()` for cookies to work

Client-side auth: `src/lib/auth-client.ts` — lazy Proxy pattern, `organizationClient` + `lastLoginMethodClient` plugins.

Key auth files: `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/app/actions/auth.ts`, `src/bff/controllers/auth.controller.ts`, `src/bff/services/auth.service.ts`

### Database Schema

Better-auth managed: `user`, `session`, `account`, `verification` (in `src/db/schemas/schema.ts`)

Domain tables (separate schema files):
- `job_post` — recruiter uploads; fields include `processingStatus` (processing|completed|failed), `requiredSkills`/`niceToHaveSkills`/`responsibilities` as JSON arrays, salary range, `originalFileName`/`originalFileType`
- `challenge` — coding challenges linked to job posts; fields include `seniority_level`, `tech_stack`, salary range, `remote`, `equity`
- `programmer`, `recruiter`, `company` — profile tables (minimal, placeholder-level)

### Path Aliases

`@/*` → `src/*` (configured in `tsconfig.json`)

## Environment Variables

```
TURSO_CONNECTION_URL       # Turso database URL
TURSO_AUTH_TOKEN           # Turso authentication token
RESEND_API_KEY             # Resend email API key
ANTHROPIC_API_KEY          # Claude API key (required for Mastra agents)
MASTRA_CLOUD_ACCESS_TOKEN  # Optional, for cloud tracing
```
