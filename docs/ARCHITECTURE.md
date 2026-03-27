# Architecture

**after42** is a recruitment platform: recruiters upload job posts, AI extracts structured fields and generates coding challenges; candidates fork repos, submit work, and receive AI-assisted scoring. Recruiters review submissions under **blind review** rules (no direct candidate identity in company UI).

Extended stack and file pointers: [`CLAUDE.md`](../CLAUDE.md).

---

## System context

```mermaid
flowchart TB
  subgraph clients["Clients"]
    R[Recruiter browser]
    C[Candidate browser]
  end

  subgraph after42["after42 — Next.js app"]
    APP[App Router + Server Actions]
    API[API routes — auth, chat, email]
  end

  subgraph data["Data"]
    DB[(Turso / LibSQL)]
  end

  subgraph external["External services"]
    GH[GitHub App — challenge repos]
    AN[Anthropic — Mastra agents]
    RS[Resend — transactional email]
  end

  R --> APP
  C --> APP
  R --> API
  C --> API
  APP --> DB
  API --> DB
  APP --> AN
  APP --> GH
  API --> RS
```

---

## Request path and layers

Localized pages live under `src/app/[locale]/`. The Next.js **proxy** (`src/proxy.ts`) applies `next-intl` locale routing so URLs always include a locale prefix (e.g. `/fr/dashboard`).

```mermaid
flowchart LR
  subgraph edge["Edge / server"]
    P[proxy.ts — locale]
    L[Layouts — session / role]
    PG[Pages — RSC data fetch]
  end

  subgraph logic["Application logic"]
    SA[Server actions — src/app/actions/]
    BFF["BFF — src/bff/ — controller → service"]
    MA[Mastra tools / agents — src/mastra/]
  end

  subgraph persistence["Persistence"]
    DR[Drizzle — src/db/]
    TUR[(Turso)]
  end

  P --> L --> PG
  PG --> SA
  SA --> BFF
  SA --> MA
  SA --> DR
  BFF --> DR
  DR --> TUR
```

**Navigation rule:** use `Link`, `redirect`, `useRouter`, and `usePathname` from [`src/i18n/navigation.ts`](../src/i18n/navigation.ts), not from `next/link` or `next/navigation`, so locale is preserved.

---

## Route groups (mental model)

```mermaid
flowchart TB
  ROOT["/[locale]"]

  ROOT --> PAGES["(pages)/ — public marketing + auth"]
  ROOT --> LOGGED["(logged-in)/ — session required"]
  ROOT --> CAND["(candidate)/ — requireRole(candidate)"]
  ROOT --> COMP["(company)/ — requireRole(recruiter)"]

  PAGES --> H[Home, sign-in, sign-up, …]
  LOGGED --> D[Dashboard, chat, …]
  CAND --> CC[candidate/challenges/…]
  COMP --> CH[company/challenges/…]
```

API routes under `src/app/api/` are **not** prefixed with locale.

---

## Job post extraction pipeline

```mermaid
sequenceDiagram
  participant UI as JobPostUploader
  participant SA as processJobPost action
  participant EX as file-extractor
  participant AG as job-post-processor agent
  participant TO as job-post-extractor tool
  participant DB as job_post table

  UI->>SA: upload file
  SA->>EX: extractTextFromFile
  EX-->>SA: plain text
  SA->>AG: generate / route model
  AG->>TO: structured extraction
  TO-->>AG: JobPostData
  AG-->>SA: validated fields
  SA->>DB: insert row
  SA-->>UI: jobPostId + extractedData
```

---

## Challenge generation

```mermaid
sequenceDiagram
  participant UI as Generate challenge UI
  participant SA as createChallenge action
  participant TO as challenge-generator tool
  participant GH as GitHub App
  participant DB as challenge table

  UI->>SA: jobPostId
  SA->>SA: load job_post, authorize recruiter
  SA->>TO: job context — skills, level, description
  TO-->>SA: title, readme, starterCode, engineeringCategory, …
  opt GitHub configured
    SA->>GH: create repo from template content
    GH-->>SA: repo name
  end
  SA->>DB: insert challenge row
  SA-->>UI: challengeId, status
```

`engineering_category` is chosen by the generator from a fixed enum and stored on `challenge` for recruiter dashboard display.

---

## Candidate fork → submit → score (simplified)

```mermaid
stateDiagram-v2
  [*] --> forked: Fork GitHub repo
  forked --> submitted: Push + submit action
  submitted --> scoring: Mastra / workflow
  scoring --> scored: AI scorer completes
  scoring --> failed: Error / timeout
  scored --> [*]
  failed --> [*]
```

Company-facing APIs and UI must not expose `candidateId` or `githubForkName`; recruiters see `sequenceNum` as “Candidate #N”. See [DATA-MODEL.md](./DATA-MODEL.md).

---

## Recruiter unified dashboard tabs

Dashboard tab state is driven by the `tab` query parameter (`?tab=challenges`). Default is the pipeline view.

```mermaid
stateDiagram-v2
  [*] --> pipeline: /dashboard or ?tab=pipeline
  pipeline --> challenges: ?tab=challenges
  pipeline --> review: ?tab=review
  challenges --> pipeline: router.replace
  review --> pipeline: router.replace
  challenges --> review
  review --> challenges
```

Implementation: [`RecruiterTabProvider` / `RecruiterTabNav`](../src/components/company/recruiter-tabs.tsx).

---

## Chat (job post assistant)

`POST /api/chat` streams responses via `@mastra/ai-sdk` to the **job-post-processor** agent with thread memory (`threadId` / `resourceId`). The chat UI lives under the logged-in area; see [`CLAUDE.md`](../CLAUDE.md) § Chat Streaming.

---

## Related files

| Topic | Primary files |
|-------|----------------|
| Auth | `src/lib/auth.ts`, `src/app/api/auth/[...all]/` |
| Role gates | `src/lib/require-role.ts`, `(candidate)` / `(company)` layouts |
| Job posts | `src/app/actions/job-post.ts`, `src/mastra/agents/job-post-processor.ts` |
| Challenges | `src/app/actions/challenge.ts`, `src/mastra/tools/challenge-generator-tool.ts` |
| Scoring | `src/app/actions/scoring.ts`, `src/mastra/workflows/score-submission.ts` |
