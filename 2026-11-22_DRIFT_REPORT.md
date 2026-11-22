# EGM Drift Report — 2026-11-22

Scope: All 69 EGM contract `README.md` files created/updated by `egm-bootstrap` across `after42`.

- **Total contracts audited:** 69
- **Contracts with no drift:** 55
- **Contracts with drift:** 14 (22 findings)

---

## README.md

- **Hallucinated `.env.example` file (`README.md:22`)**: Quick start instructs running `cp .env.example .env`, but `.env.example` does not exist in the repository root.

## scripts/README.md

No drift detected.

## src/README.md

- **Subdirectory count & `src/messages/` omission (`src/README.md:4, 10-19`)**: States `src` contains "nine domain/infrastructure child subsystems" and lists 9 subdirectories (`app`, `bff`, `components`, `db`, `emails`, `hooks`, `i18n`, `lib`, `mastra`), omitting the 10th subdirectory `src/messages/` (`en.json`, `fr.json`, statically imported by `src/i18n/request.ts:4-5`).

## src/emails/README.md

- **Incomplete external email transport attribution (`src/emails/README.md:4`)**: States `"Email transport, HTML serialization, and subject-line assembly live outside this package (in src/lib/auth.ts)."`, omitting `src/app/api/emails/route.ts:3-15`, which also imports `Email` from `src/emails/email.tsx`, sets subject `'Welcome to After42!'`, and dispatches via Resend.

## src/hooks/README.md

No drift detected.

## src/i18n/README.md

No drift detected.

## src/lib/README.md

- **Inaccurate `requireSession` null-return claim (`src/lib/README.md:28`)**: Claims `requireRole` redirects to localized `/dashboard` `"whenever authController.requireSession(await headers()) returns null or userPlain.role !== role"`. `authController.requireSession` (`src/bff/controllers/auth.controller.ts:176-183`) never returns `null` (it redirects unauthenticated callers to localized `'/'` and otherwise returns `{ session, user }`); `requireRole` (`src/lib/require-role.ts:13-17`) destructures `{ user }` and redirects to localized `/dashboard` when `user` is falsy (`!userPlain`) or `userPlain.role !== role`.
- **Inaccurate `redirect` call signature (`src/lib/README.md:36`)**: States `triggers redirect('/dashboard')`, whereas `src/lib/require-role.ts:16` calls `next-intl`'s `redirect({ href: '/dashboard', locale: await getLocale() })` (object signature, not a string path).

## src/db/README.md

No drift detected.

## src/db/schemas/README.md

- **Timestamp default overgeneralization (`src/db/schemas/README.md:22`)**: States that aside from `session.updatedAt` and `account.updatedAt`, `"all other tables default createdAt and updatedAt to unixepoch('subsecond') * 1000"`, which contradicts `challengeCounter` (`src/db/schemas/challenge-counter.ts:14-17`) — `challenge_counter` only defines `challengeId` and `seq` and has no `createdAt` or `updatedAt` columns.
- **Omitted explicit `account` column names (`src/db/schemas/README.md:14`)**: Groups 7 columns on `account` (`src/db/schemas/schema.ts:55-65`) generically as `"OAuth/password fields"` instead of listing `accessToken`, `refreshToken`, `idToken`, `accessTokenExpiresAt`, `refreshTokenExpiresAt`, `scope`, and `password`.

## src/db/migrations/README.md

No drift detected.

## src/db/migrations/20260221111611_sudden_susan_delgado/README.md

No drift detected.

## src/db/migrations/20260221171841_cooing_the_hand/README.md

No drift detected.

## src/db/migrations/20260222094839_faithful_katie_power/README.md

- **SQLite minimum version claim (`src/db/migrations/20260222094839_faithful_katie_power/README.md:15`)**: Claims the migration `"Targets SQLite >= 3.38.0 dialect using backtick quoting and unixepoch('subsecond') millisecond defaults"`, whereas `migration.sql:20-21` (`job_post.created_at`, `job_post.updated_at`) uses the `'subsecond'` modifier of `unixepoch('subsecond')`, which requires SQLite >= 3.42.0 (3.38.0 added `unixepoch()` without `'subsecond'`).

## src/db/migrations/20260324161523_red_star_brand/README.md

No drift detected.

## src/db/migrations/20260326173703_slim_agent_zero/README.md

No drift detected.

## src/bff/README.md

No drift detected.

## src/bff/controllers/README.md

No drift detected.

## src/bff/models/README.md

No drift detected.

## src/bff/services/README.md

No drift detected.

## src/mastra/README.md

No drift detected.

## src/mastra/agents/README.md

No drift detected.

## src/mastra/tools/README.md

No drift detected.

## src/mastra/workflows/README.md

No drift detected.

## src/components/README.md

- **Provider-guarded hook count (`src/components/README.md:26`)**: States `"14 ai-elements hooks throw outside their providers"`, whereas `src/components/ai-elements/` actually defines **17** provider-guarded hooks across **14** modules (`prompt-input.tsx` defines 4: `usePromptInputController`, `useProviderAttachments`, `usePromptInputAttachments`, `usePromptInputReferencedSources`, alongside 13 single-hook modules).

## src/components/auth/README.md

No drift detected.

## src/components/candidate/README.md

No drift detected.

## src/components/company/README.md

- **Omitted barrel exclusions (`src/components/company/README.md:4`)**: States `index.ts` aggregates most public exports `"(excluding recruiter-tabs.tsx, recruiter-dashboard-challenges-tab.tsx, and score-rec-styles.ts)"`, omitting that `index.ts` also does not re-export `RecruiterUnifiedDashboardClientProps` (`recruiter-unified-dashboard-client.tsx:25`) or `RecruiterCandidatesReviewProps` (`recruiter-candidates-review.tsx:66`).
- **Incorrect `ScoreBadge` claim in `SubmissionsClickableRow` (`src/components/company/README.md:33`)**: States `SubmissionsClickableRow` `"shows ScoreBadge/RecPill only when scored"`, whereas `submissions-table-row.tsx:77-94` does not import or render `ScoreBadge`; it renders a plain `<span>` styled with `scoreClass(row.score!)` alongside `RecPill` (line 101) and `StatusBadge` (aliased as `StatusBadgeUI`, line 111).
- **Incomplete `EvidencePanel` branching (`src/components/company/README.md:34`)**: States `ReviewWorkspace` `"returns null in EvidencePanel when not scored or score == null"`, whereas `review-workspace.tsx:173-185` returns a pulsing loading skeleton when `submission.status === 'submitted' || submission.status === 'scoring'` and only returns `null` (line 185) for other non-scored statuses or when `submission.score == null`.

## src/components/home/README.md

- **Translation key count (`src/components/home/README.md:22`)**: States the five sections require `"the 27 referenced 'home' keys present"`, whereas they actually reference **29** unique `'home'` translation keys (31 total `t(...)` references across the 5 section components).

## src/components/job-post/README.md

No drift detected.

## src/components/layout/README.md

No drift detected.

## src/components/layout/navigation/README.md

No drift detected.

## src/components/sidebar/README.md

No drift detected.

## src/components/ui/README.md

- **Missing `(type)` qualifier (`src/components/ui/README.md:32`)**: Lists `FieldErrorsList` without a `(type)` qualifier (unlike `CarouselApi` and `ChartConfig`), even though `src/components/ui/field.tsx:186` exports it as a TypeScript type alias (`export type FieldErrorsList = Array<{ message?: string } | undefined>`).
- **Omitted non-portaled sub-content (`src/components/ui/README.md:74`)**: The parenthetical `"(while ContextMenuSubContent and MenubarSubContent render without an automatic portal)"` omits `DropdownMenuSubContent` (`src/components/ui/dropdown-menu.tsx:225-239`), which also renders `DropdownMenuPrimitive.SubContent` without an automatic `Portal` wrapper.

## src/components/ai-elements/README.md

- **Omitted fallback contexts (`src/components/ai-elements/README.md:74`)**: Lists `EnvironmentVariablesContext` and `FileTreeContext`, omitting `EnvironmentVariableContext` (`src/components/ai-elements/environment-variables.tsx:148-152`, consumed with fallback `{ name: "", value: "" }` by `EnvironmentVariableName`, `EnvironmentVariableValue`, and `EnvironmentVariableCopyButton`) as well as default-valued `FileTreeFolderContext` and `FileTreeFileContext` (`src/components/ai-elements/file-tree.tsx:104-108, 188-191`).
- **Omitted Collapsible-backed family (`src/components/ai-elements/README.md:79`)**: Lists `Commit`, `QueueSection`, `Sandbox`, `Sources`, `Task`, `TestSuite`, and `Tool` as Collapsible-backed families, omitting `Plan` (`src/components/ai-elements/plan.tsx:51, 118, 132`), where `Plan` renders `<Collapsible>` and `PlanContent`/`PlanTrigger` render `<CollapsibleContent>`/`<CollapsibleTrigger>` directly.
- **Uncontrolled `form.reset()` timing on `onSubmit` error (`src/components/ai-elements/README.md:81`)**: Claims `PromptInput` `"clears state only if sync/async onSubmit resolves without throwing"`, whereas in uncontrolled mode (`!usingProvider`), `src/components/ai-elements/prompt-input.tsx:736-738` calls `form.reset()` immediately before `convertBlobUrlToDataUrl` and before `onSubmit` runs—clearing uncontrolled form inputs even if `onSubmit` throws or rejects (only attachments/referenced sources and provider-managed `controller.textInput` wait for `onSubmit` to resolve at lines 759-778).
- **`PromptInputTextarea` modifier key handling on Enter (`src/components/ai-elements/README.md:82`)**: Claims `PromptInputTextarea` submits on `"unmodified Enter"`, whereas `src/components/ai-elements/prompt-input.tsx:855-862` only guards `if (e.shiftKey) return;` (not `ctrlKey`, `metaKey`, or `altKey`), so `Ctrl+Enter`, `Cmd+Enter`, and `Alt+Enter` still prevent default and submit the form.

## src/app/README.md

No drift detected.

## src/app/actions/README.md

- **Exact error string mismatch (`src/app/actions/README.md:51`)**: Documents the missing GitHub config error returned by `submitChallenge` as `'GitHub integration is not configured'`, whereas `src/app/actions/submit-challenge.ts:35` (`submitChallenge`) returns `{ error: 'GitHub integration not configured' }` (without `"is"`).

## src/app/api/README.md

No drift detected.

## src/app/api/auth/README.md

No drift detected.

## src/app/api/auth/[...all]/README.md

No drift detected.

## src/app/api/chat/README.md

No drift detected.

## src/app/api/commits/README.md

No drift detected.

## src/app/api/commits/[forkName]/README.md

No drift detected.

## src/app/api/emails/README.md

No drift detected.

## src/app/[locale]/README.md

No drift detected.

## src/app/[locale]/(pages)/README.md

No drift detected.

## src/app/[locale]/(pages)/forgot-password/README.md

No drift detected.

## src/app/[locale]/(pages)/home/README.md

No drift detected.

## src/app/[locale]/(pages)/reset-password/README.md

No drift detected.

## src/app/[locale]/(pages)/sign-in/README.md

No drift detected.

## src/app/[locale]/(pages)/sign-up/README.md

No drift detected.

## src/app/[locale]/(logged-in)/README.md

No drift detected.

## src/app/[locale]/(logged-in)/challenge/README.md

No drift detected.

## src/app/[locale]/(logged-in)/challenge/create/README.md

No drift detected.

## src/app/[locale]/(logged-in)/chat/README.md

No drift detected.

## src/app/[locale]/(logged-in)/dashboard/README.md

No drift detected.

## src/app/[locale]/(logged-in)/profile/README.md

No drift detected.

## src/app/[locale]/(candidate)/README.md

No drift detected.

## src/app/[locale]/(candidate)/candidate/README.md

No drift detected.

## src/app/[locale]/(candidate)/candidate/challenges/README.md

No drift detected.

## src/app/[locale]/(candidate)/candidate/challenges/[id]/README.md

No drift detected.

## src/app/[locale]/(candidate)/candidate/challenges/[id]/submit/README.md

- **`TerminalState` prop shape (`src/app/[locale]/(candidate)/candidate/challenges/[id]/submit/README.md:15`)**: Documents `TerminalState({ status, score: score ?? null, submittedAt: submittedAt ?? null, sequenceNum })` as flat props, whereas `src/app/[locale]/(candidate)/candidate/challenges/[id]/submit/page.tsx:74-81` (`Page`) passes a nested `submission` prop: `<TerminalState submission={{ status: submission.status, score: submission.score ?? null, submittedAt: submission.submittedAt ?? null, sequenceNum: submission.sequenceNum }} />`.

## src/app/[locale]/(company)/README.md

No drift detected.

## src/app/[locale]/(company)/company/README.md

No drift detected.

## src/app/[locale]/(company)/company/candidates/README.md

No drift detected.

## src/app/[locale]/(company)/company/challenges/README.md

No drift detected.

## src/app/[locale]/(company)/company/challenges/[id]/README.md

No drift detected.

## src/app/[locale]/(company)/company/challenges/[id]/submissions/README.md

No drift detected.

## src/app/[locale]/(company)/company/challenges/[id]/submissions/[submissionId]/README.md

- **Unchecked type assertion vs. runtime narrowing (`src/app/[locale]/(company)/company/challenges/[id]/submissions/[submissionId]/README.md:15`)**: States `Page` `"Narrows sub.recommendation to 'recommend' | 'consider' | 'pass' | null"`, whereas `src/app/[locale]/(company)/company/challenges/[id]/submissions/[submissionId]/page.tsx:85-89` only applies an unchecked TypeScript assertion (`sub.recommendation as 'recommend' | 'consider' | 'pass' | null`) with no runtime narrowing or fallback to `null`.

## src/app/[locale]/(company)/company/profile/README.md

No drift detected.
