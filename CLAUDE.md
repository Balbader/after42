# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**after42** is a Next.js application built with TypeScript, combining modern web development with AI capabilities via Mastra. It's a recruitment platform where recruiters upload job posts (PDF/DOCX/TXT), AI extracts structured data, and coding challenges are generated for candidates.

**Architecture docs (Mermaid diagrams):** [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) · [docs/DATA-MODEL.md](./docs/DATA-MODEL.md) · [docs/README.md](./docs/README.md)

Stack:
- **Next.js 16** (v16.2.1) with App Router, React 19
- **Mastra** (`mastra` CLI ^1.3.2, `@mastra/core` ^1.5.0) for AI agents, workflows, and tools
- **Better-auth** for authentication with email verification
- **Drizzle ORM** with Turso (LibSQL) database
- **React Email** with Resend for transactional emails
- **Tailwind CSS 4** + shadcn-style UI components in `src/components/ui/` and `@base-ui/react` for lower-level primitives
- **TanStack Form** (`@tanstack/react-form-nextjs`) for server-side form integration; `react-hook-form` also present for simpler cases

## Common Commands

### Development
```bash
pnpm dev          # Start Next.js dev server (localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
npx mastra dev       # Start Mastra Studio separately (localhost:4111)
```

### Database (Drizzle)
```bash
pnpm dbg          # Generate migrations from schema changes
pnpm dbm          # Run migrations
pnpm dbp          # Push schema directly to database (dev only)
pnpm dbs          # Open Drizzle Studio
pnpm seed         # Seed database with test data (recruiter + 3 candidates + challenge + submissions)
pnpm full-reset   # DELETE every row in every table, then re-seed
pnpm cmds         # List all package scripts
```

Seed accounts (all password `Seed1234!`, emails pre-verified): `sarah.chen@after42.dev` (recruiter), `alex.rivera@`, `jordan.patel@`, `morgan.kim@after42.dev` (candidates). Seed rows use `seed-` ID prefixes so `pnpm seed` is idempotent.

**Database workflow**: Modify schemas in `src/db/schemas/*.ts`, then run `dbg` + `dbm`.

## Architecture

### Internationalization (next-intl)

All routes are nested under `src/app/[locale]/`. Locales: `fr` (default), `en`. Locale prefix is **always** present in URLs (e.g. `/fr/dashboard`, `/en/sign-in`).

- `src/i18n/routing.ts` — Locale list and routing config
- `src/i18n/navigation.ts` — Locale-aware `Link`, `redirect`, `usePathname`, `useRouter`
- `src/i18n/request.ts` — Server-side message loading from `src/messages/{locale}.json`
- `src/proxy.ts` — next-intl locale routing (Next.js proxy convention; imports `next-intl/middleware`)

**Always use** `Link`/`redirect` from `src/i18n/navigation.ts` (not from `next/link` or `next/navigation`) so locale is preserved in URLs.

### Route Groups

All route groups live under `src/app/[locale]/`:

- `(pages)/` — Public routes: home, sign-in, sign-up, forgot/reset-password
- `(logged-in)/` — Protected routes for any role: `dashboard` (branches on `user.role`; recruiter view is the tabbed `?tab=pipeline|challenges|review` workspace), `profile`, `chat`, `challenge/create`, `challenge` (redirects to `/dashboard?tab=pipeline`). Layout calls `authController.requireSession(await headers())`.
- `(candidate)/` — Role-gated routes for candidates: `candidate/challenges/`, `candidate/challenges/[id]/`, `candidate/challenges/[id]/submit/`. Layout uses `requireRole('candidate')` from `src/lib/require-role.ts`.
- `(company)/` — Role-gated routes for recruiters: `company/challenges/`, `company/challenges/[id]/`, `company/challenges/[id]/submissions/`, `company/challenges/[id]/submissions/[submissionId]/`, `company/candidates`, `company/profile`. Layout uses `requireRole('recruiter')`.
- `src/app/api/` — API routes (not localized): `auth/[...all]` (Better-auth handler), `chat` (streaming via `@mastra/ai-sdk`), `emails`, `commits/[forkName]` (commit count polled by the candidate submit page)
- `src/app/actions/` — Server actions: `auth.ts`, `job-post.ts`, `challenge.ts`, `fork-challenge.ts`, `submit-challenge.ts`, `scoring.ts`

**Authorization lives in each server action, not only in layouts.** Server actions are publicly callable endpoints, so every action re-checks the session and role (`requireRole(...)` or `authController.requireSession(...)` + `user.role` check) and then ownership (`jobPost.recruiterId`, `challenge.creatorId`, `candidateSubmission.candidateId`). Follow the same pattern in new actions. Roles are `'candidate' | 'recruiter'` (Better-auth default `'candidate'`; the Drizzle column default `'user'` is stale).

### Component Structure

Beyond `src/components/ui/` (shadcn primitives), there are:
- `src/components/auth/` — Auth form components: `sign-in-form.tsx`, `sign-up-form.tsx`, `forgot-password-form.tsx`, `reset-password-form.tsx`, `auth-panel.tsx`, `sign-out-btn.tsx`
- `src/components/ai-elements/` — Chat UI building blocks (message, prompt-input, reasoning, model-selector, etc.) used in the chat page
- `src/components/job-post/` — Job post upload and display components
- `src/components/layout/` — `dynamic-breadcrumb.tsx` (auto-generates breadcrumbs) + `navigation/` (Header, Footer for public pages)
- `src/components/home/` — Split home page sections: `hero-section`, `vision-section`, `both-sides-section`, `how-it-works-section`, `cta-section`
- `src/components/candidate/` — Candidate-specific components: `fork-challenge-btn`, `submit-workspace`, `terminal-state`
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

**Smart model routing** in `job-post-processor.ts`: uses Haiku for short/clean posts, Sonnet for complex/long posts (cost optimization). The agent's tool-result shape varies by Mastra version, so `processJobPost` digs the payload out with `extractJobPostFromToolResults()` before Zod validation.

### Challenge → Fork → Submit → Score

End-to-end flow across `src/app/actions/`, `src/lib/github.ts` and `src/mastra/`:

1. **Generate** — `createChallenge(jobPostId)` calls `challengeGeneratorTool.execute!(input, {} as never)` directly (no agent), creates private repo `challenge-<id>` in the GitHub org with README + starter files, inserts `challenge`. Status is `active` if the repo was created, else `draft`. `evaluationCriteria` is stored in `challengeContent` and is internal-only (never in the candidate README).
2. **Fork** — `forkChallenge` (candidate) assigns `sequenceNum` atomically via `challenge_counter` in a transaction, forks to `challenge-<id>-cand-<N>`, inserts `candidate_submission` with status `forked`. Only `active` challenges with a repo can be forked.
3. **Push detection** — `SubmitWorkspace` polls `/api/commits/[forkName]` every 10s; submit button stays disabled until ≥1 commit beyond the initial one.
4. **Submit** — `submitChallenge` archives the fork, sets `submitted`, fires `triggerScoring` without awaiting.
5. **Score** — `triggerScoring` concatenates the fork tree (`github.getRepoTree`), sets `scoring`, runs `scoreSubmissionWorkflow` (`src/mastra/workflows/score-submission.ts`): scorer tool → interview-guide tool → save (`scored`, or `failed` on error). Recruiter review page polls via `router.refresh()` every 5s while scoring.

GitHub is optional in dev: without `GITHUB_APP_ID`/`GITHUB_APP_PRIVATE_KEY`, challenges stay `draft` and fork/submit/score return "not configured" errors. `src/lib/github.ts` uses a GitHub App installation (singleton Octokit) on `GITHUB_ORG_NAME`.

### Mastra (`src/mastra/`)

- `index.ts` — Initializes Mastra with LibSQL storage (local file `./mastra.db`, separate from Turso), PinoLogger, observability (DefaultExporter + CloudExporter with SensitiveDataFilter); registers the agent, tools and workflow
- `agents/` — `job-post-processor.ts` (routing + extraction; also backs the `/chat` page)
- `tools/` — `job-post-extractor-tool.ts` (structured extraction), `challenge-generator-tool.ts` (AI challenge generation), `submission-scorer-tool.ts` (scores candidate code), `interview-guide-tool.ts` (generates interview Q&A). Each calls `generateObject()` with a hardcoded Anthropic model ID and exports its Zod output schema for reuse by the DB layer.
- `workflows/` — `score-submission.ts` (`scoreSubmissionWorkflow`: score → interview guide → save)
- `mcp/` — Optional custom MCP servers for sharing tools with external agents
- `scorers/` — Optional agent performance evaluation scorers

**CRITICAL**: Before working with Mastra code, load the Mastra skill first using `/mastra` or the Skill tool. Mastra APIs change frequently. Start Mastra Studio with `npx mastra dev` (runs at `localhost:4111`, separate from the Next.js dev server).

See [AGENTS.md](./AGENTS.md) for full Mastra guidance.

### Authentication

Better-auth configured in `src/lib/auth.ts`:
- Email/password with required email verification (sent via Resend from `basil@after42.ai`)
- Password reset via email
- Custom user fields: `role`, `dateOfBirth`, `termsAcceptedAt`, `privacyPolicyAcceptedAt`
- `nextCookies()` plugin — auth server actions must pass `headers()` for cookies to work

Client-side auth: `src/lib/auth-client.ts` — lazy Proxy pattern, `organizationClient` + `lastLoginMethodClient` plugins.

Email templates live in `src/emails/` (React Email components): `verify-email.tsx`, `reset-password.tsx`, `organization-invitation.tsx`. Verification and reset emails are sent directly from the Better-auth callbacks in `src/lib/auth.ts` via Resend; `localeFromAuthUrl()` picks FR/EN copy from the `/fr/` segment in the auth URL. (`src/app/api/emails` is a separate test route.)

Sign-in calls `authClient.signIn.email()` from the client; sign-up goes through the `signUpAction` server action → BFF.

Key auth files: `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/app/actions/auth.ts`, `src/bff/controllers/auth.controller.ts`, `src/bff/services/auth.service.ts`

### Database Schema

Database client entry point: `src/db/index.ts` — import the Drizzle client from here.

Better-auth managed: `user`, `session`, `account`, `verification` (in `src/db/schemas/schema.ts`)

Domain tables (separate schema files):
- `job_post` — recruiter uploads; fields include `processingStatus` (processing|completed|failed), `requiredSkills`/`niceToHaveSkills`/`responsibilities` as JSON arrays, salary range, `originalFileName`/`originalFileType`
- `challenge` — coding challenges linked to job posts; fields include `seniority_level`, `tech_stack`, salary range, `remote`, `equity`, plus workflow fields for AI generation and GitHub integration
- `candidate_submission` — candidate submissions per challenge; tracks `status` state machine (`forked → submitted → scoring → scored → failed`), `score`, `recommendation` (`recommend|consider|pass`), `aiReport` (strengths/gaps JSON), `interviewGuide` (paired Q+A JSON), `sequenceNum` for blind review
- `challenge_counter` — per-challenge atomic counter for assigning `sequenceNum` without races
- `programmer`, `recruiter`, `company` — profile tables (minimal, placeholder-level)

**BLIND REVIEW RULE**: `candidateId` and `githubForkName` from `candidate_submission` must **never** appear in company-facing API responses or UI. Recruiters see only: `sequenceNum` ("Candidate #N"), `score`, `recommendation`, `aiReport`, `interviewGuide`.

### Utilities

- `cn()` in `src/lib/utils.ts` — Tailwind class merger (`clsx` + `tailwind-merge`); use for all conditional className construction in components.
- `src/lib/log-helpers.ts` — Colored console helpers: `message()` (green), `log()` (yellow), `logError()` (red).
- `src/lib/safe-markdown.ts` — `renderMarkdown(raw)` renders markdown to sanitized HTML via `marked` + `DOMPurify`. Use instead of `dangerouslySetInnerHTML` with raw markdown.
- `src/lib/require-role.ts` — `requireRole('candidate' | 'recruiter')` — async guard for role-gated layouts; redirects to `/dashboard` on mismatch.

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
EMAIL_SENDER_NAME          # Not read by code yet (sender is hardcoded in src/lib/auth.ts)
EMAIL_SENDER_ADDRESS       # Not read by code yet
ANTHROPIC_API_KEY          # Claude API key (required for Mastra agents)
NEXT_PUBLIC_API_URL        # Public-facing API base URL
MASTRA_CLOUD_ACCESS_TOKEN  # Optional, for cloud tracing
GITHUB_APP_ID              # GitHub App for challenge repos/forks (optional in dev)
GITHUB_APP_PRIVATE_KEY     # Base64-encoded PEM of the GitHub App key
GITHUB_ORG_NAME            # Org that hosts challenge repos and forks
```

## No Test Framework

There is no test suite configured in this project (no jest, vitest, or similar). `pnpm lint` is the only automated quality check available.

## Known Acceptable ESLint Warnings

Four warnings are intentionally left unresolved — do not attempt to "fix" them:
1. `useEffect` with `setState` calls in chat components (intentional streaming pattern)
2. `useState` initialized from a prop (intentional for model selector default)
3. Array index keys for slider thumbs and stack trace items (no stable identifier available)
4. Inline render function in a specific component (would require invasive refactor)

## Design System

Always read `DESIGN.md` before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.

Key decisions to remember:
- **Fonts:** Fraunces (display/serif), DM Sans (body/UI), JetBrains Mono (code) — never substitute Inter, Roboto, or system-ui
- **Accent color:** `#C2410C` orange-700 (light), `#EA580C` orange-600 (dark)
- **Background:** `#FAFAF8` warm white — not pure `#FFFFFF`
- **Score font:** Fraunces for score numbers (91/100 feels substantial as a serif)
- **Recruiter workspace:** Three-zone layout (280px left | 1fr center | 240px right) — not stacked cards
- **Candidate workspace:** Two-zone layout (1fr left | 320px right) with push detection status banner

In QA mode, flag any code that doesn't match DESIGN.md.

## Known Technical Debt

**Dark mode is partially converted.** Recruiter (`src/components/company/`) and dashboard UI use `--a42-*` tokens (e.g. `text-(--a42-text)`), which the `.dark { }` overrides in `globals.css` reach. About 75 hardcoded hex colors (e.g. `text-[#1C1917]`) remain, mostly in candidate pages/components and `profile/page.tsx`. Use tokens in new code; convert hex when touching a file.

**Open TODOs** are tracked in `TODOS.md` (e.g. TODO-1: PII scrubber for candidate code before scoring). TODO-2 (sidebar `'programmer'` role) is already fixed.

**Shared rec/score styles:** `src/components/company/score-rec-styles.ts` is the single source of truth for recommendation pill colors (`REC_COLORS`) and score color helpers (`scoreHex`, `scoreClass`). Always import from there — do not redefine inline.
