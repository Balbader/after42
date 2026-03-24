# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**after42** is a Next.js application built with TypeScript, combining modern web development with AI capabilities via Mastra. It's a recruitment platform where recruiters upload job posts (PDF/DOCX/TXT), AI extracts structured data, and coding challenges are generated for candidates.

Stack:
- **Next.js 16** with App Router, React 19
- **Mastra** (`mastra` CLI ^1.3.2, `@mastra/core` ^1.5.0) for AI agents, workflows, and tools
- **Better-auth** for authentication with email verification
- **Drizzle ORM** with Turso (LibSQL) database
- **React Email** with Resend for transactional emails
- **Tailwind CSS 4** + shadcn-style UI components in `src/components/ui/` and `@base-ui/react` for lower-level primitives
- **TanStack Form** (`@tanstack/react-form-nextjs`) for server-side form integration; `react-hook-form` also present for simpler cases

## Common Commands

### Development
```bash
npm run dev          # Start Next.js dev server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx mastra dev       # Start Mastra Studio separately (localhost:4111)
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

- `src/app/page.tsx` — Root page; imports `(pages)/home/page` and wraps it with `Header`/`Footer` from `src/components/layout/navigation/`
- `src/app/(pages)/` — Public routes: home, sign-in, sign-up, forgot/reset-password
- `src/app/(logged-in)/` — Protected routes: dashboard, chat, challenge (`/`, `/create`, `/my-challenges`, `/candidates`). The shared layout (`layout.tsx`) calls `authController.requireSession(await headers())` to enforce auth for all nested routes — this is the auth gating mechanism.
- `src/app/api/` — API routes: `auth/[...all]` (Better-auth handler), `chat` (streaming via `@mastra/ai-sdk`), `emails`
- `src/app/actions/` — Server actions (form submissions, not API routes): `auth.ts`, `job-post.ts`

### Component Structure

Beyond `src/components/ui/` (shadcn primitives), there are:
- `src/components/auth/` — Auth form components: `sign-in-form.tsx`, `sign-up-form.tsx`, `forgot-password-form.tsx`, `reset-password-form.tsx`, `auth-panel.tsx`, `sign-out-btn.tsx`
- `src/components/ai-elements/` — Chat UI building blocks (message, prompt-input, reasoning, model-selector, etc.) used in the chat page
- `src/components/job-post/` — Job post upload and display components
- `src/components/layout/` — `dynamic-breadcrumb.tsx` (auto-generates breadcrumbs) + `navigation/` (Header, Footer for public pages)
- `src/components/sidebar/` — `AppSidebar` + nav sub-components (`nav-main`, `nav-user`, `nav-projects`, `nav-secondary`)

### Chat Streaming

`src/app/api/chat/route.ts` — Streams AI responses using `handleChatStream` from `@mastra/ai-sdk`. The `POST` handler proxies messages to the `job-post-processor` agent with persistent memory (`threadId`/`resourceId`). The `GET` handler recalls thread history and converts it to AI SDK v5 format via `toAISdkV5Messages`. Frontend uses `src/components/ai-elements/` components (prompt-input, message, model-selector, reasoning, etc.) with `streamdown` for markdown/code rendering.

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
- `agents/` — `job-post-processor.ts` (routing + extraction)
- `tools/` — `job-post-extractor-tool.ts` (structured AI extraction via `generateObject()`)

**CRITICAL**: Before working with Mastra code, load the Mastra skill first using `/mastra` or the Skill tool. Mastra APIs change frequently. Start Mastra Studio with `npx mastra dev` (runs at `localhost:4111`, separate from the Next.js dev server).

See [AGENTS.md](./AGENTS.md) for full Mastra guidance.

### Authentication

Better-auth configured in `src/lib/auth.ts`:
- Email/password with required email verification (sent via Resend from `basil@after42.ai`)
- Password reset via email
- Custom user fields: `role`, `dateOfBirth`, `termsAcceptedAt`, `privacyPolicyAcceptedAt`
- `nextCookies()` plugin — auth server actions must pass `headers()` for cookies to work

Client-side auth: `src/lib/auth-client.ts` — lazy Proxy pattern, `organizationClient` + `lastLoginMethodClient` plugins.

Email templates live in `src/emails/` (React Email components): `verify-email.tsx`, `reset-password.tsx`, `organization-invitation.tsx`. Sent via the `src/app/api/emails` route using Resend.

Key auth files: `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/app/actions/auth.ts`, `src/bff/controllers/auth.controller.ts`, `src/bff/services/auth.service.ts`

### Database Schema

Better-auth managed: `user`, `session`, `account`, `verification` (in `src/db/schemas/schema.ts`)

Domain tables (separate schema files):
- `job_post` — recruiter uploads; fields include `processingStatus` (processing|completed|failed), `requiredSkills`/`niceToHaveSkills`/`responsibilities` as JSON arrays, salary range, `originalFileName`/`originalFileType`
- `challenge` — coding challenges linked to job posts; fields include `seniority_level`, `tech_stack`, salary range, `remote`, `equity`
- `programmer`, `recruiter`, `company` — profile tables (minimal, placeholder-level)

### Utilities

- `cn()` in `src/lib/utils.ts` — Tailwind class merger (`clsx` + `tailwind-merge`); use for all conditional className construction in components.
- `src/lib/log-helpers.ts` — Colored console helpers: `message()` (green), `log()` (yellow), `logError()` (red).

### Form Libraries

- **TanStack Form** (`@tanstack/react-form-nextjs`) — use for forms with server-side validation and server actions (e.g., auth forms)
- **react-hook-form** — use for simpler client-side-only forms

### Path Aliases

`@/*` → `src/*` (configured in `tsconfig.json`)

## Environment Variables

```
TURSO_CONNECTION_URL       # Turso database URL
TURSO_AUTH_TOKEN           # Turso authentication token
BETTER_AUTH_SECRET         # Secret for signing sessions (required)
BETTER_AUTH_URL            # Full app URL (e.g. http://localhost:3000)
RESEND_API_KEY             # Resend email API key
EMAIL_SENDER_NAME          # Display name for outgoing emails
EMAIL_SENDER_ADDRESS       # From address for outgoing emails
ANTHROPIC_API_KEY          # Claude API key (required for Mastra agents)
NEXT_PUBLIC_API_URL        # Public-facing API base URL
MASTRA_CLOUD_ACCESS_TOKEN  # Optional, for cloud tracing
```

## No Test Framework

There is no test suite configured in this project (no jest, vitest, or similar). `npm run lint` is the only automated quality check available.
