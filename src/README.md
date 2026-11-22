# Source Root (`src`)

## Overview
Application source root for `after42`, providing the `next-intl` request routing middleware (`proxy.ts`), ambient CSS module typing (`css.d.ts`), and ten child directories covering the Next.js App Router (`app`), BFF authentication layer (`bff`), React UI components (`components`), Drizzle/Turso database layer (`db`), React Email templates (`emails`), React hooks (`hooks`), i18n configuration (`i18n`), shared infrastructure libraries (`lib`), Mastra AI orchestration (`mastra`), and static i18n message catalogs (`messages`).

## Interface
- `declare module '*.css'` — Ambient TypeScript module declaration permitting `'*.css'` imports `[css.d.ts:declare module '*.css']`.
- `default export` — `next-intl` middleware created via `createMiddleware(routing)` using `routing` from `./i18n/routing` `[proxy.ts:default]`.
- `config` — Exported middleware matcher object `{ matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'] }` `[proxy.ts:config]`.
- Subdirectories:
  - [`./app/README.md`](./app/README.md) — Next.js App Router root layout, global styles, localized route groups (`(pages)`, `(logged-in)`, `(candidate)`, `(company)`), Server Actions (`actions`), and API route handlers (`api`).
  - [`./bff/README.md`](./bff/README.md) — Backend-for-Frontend authentication barrel (`AuthController`, `User`, `Session`, Zod auth schemas) encapsulating `AuthService`.
  - [`./components/README.md`](./components/README.md) — Theme/locale controls plus nine child component packages (`ui`, `ai-elements`, `auth`, `candidate`, `company`, `home`, `job-post`, `layout`, `sidebar`).
  - [`./db/README.md`](./db/README.md) — Singleton libSQL/Turso Drizzle client (`db`), 11 SQLite table schemas, Better Auth relations, and 5 sequential Drizzle Kit v7 migrations.
  - [`./emails/README.md`](./emails/README.md) — React Email transactional templates (`VerifyEmail`, `ResetPasswordEmail`, `OrganizationInvitationEmail`, `Email`) and `localeFromAuthUrl`.
  - [`./hooks/README.md`](./hooks/README.md) — Client React hooks (`useIsMobile`).
  - [`./i18n/README.md`](./i18n/README.md) — `next-intl` routing (`fr` default, `en`, `localePrefix: 'always'`), localized navigation wrappers, and server request message loading.
  - [`./lib/README.md`](./lib/README.md) — Cross-cutting infrastructure: Better Auth server/client instances, `requireRole`, GitHub App Octokit automation, file text extraction, sanitized Markdown rendering, and utilities.
  - [`./mastra/README.md`](./mastra/README.md) — Mastra singleton (`mastra`), `jobPostProcessorAgent`, 4 Anthropic LLM tools, `scoreSubmissionWorkflow`, and local `./mastra.db` storage.
  - `messages/` (static JSON catalogs `en.json` and `fr.json`, statically imported by `src/i18n/request.ts`).

## Invariants
- `proxy.ts` route matcher excludes paths starting with `api`, `_next`, `_vercel`, or containing a literal dot (`.*\..*`) `[proxy.ts:config.matcher]`.
- Locale middleware binds directly to `routing` exported from `./i18n/routing` (`locales: ['fr', 'en']`, `defaultLocale: 'fr'`, `localePrefix: 'always'`) `[proxy.ts:default]`.
- Child subsystems enforce strict server-side role/ownership guards (`requireRole`, `authController.requireSession`), atomic per-challenge candidate sequence numbering (`challenge_counter`), Drizzle SQLite schema contracts, and provider-scoped React context hooks.

## Side Effects
- Direct files (`css.d.ts`, `proxy.ts`) introduce no runtime I/O side effects beyond `next-intl` request routing middleware evaluation `[proxy.ts:default]`.
- Child subsystems perform Turso/libSQL reads/writes (`@/db`), local Mastra LibSQL reads/writes (`file:./mastra.db`), Better Auth session/cookie mutations, Resend outbound emails, GitHub REST API calls via Octokit, Anthropic LLM API calls, and browser DOM/storage/clipboard/media mutations.

## Verification
- Run: `pnpm lint && pnpm build`
