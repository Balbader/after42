# Mastra (`src/mastra/`)

## Overview
Central Mastra application entry point, agents, tools, and workflows for after42. `src/mastra/index.ts` initializes and exports the `mastra` runtime singleton (`[index.ts:mastra]`), wiring local LibSQL storage, Pino logging, observability with sensitive-data redaction, and registered AI resources.

Before changing Mastra APIs, read [**AGENTS.md**](../../AGENTS.md) (skills / docs) and the architecture overview [**docs/ARCHITECTURE.md**](../../docs/ARCHITECTURE.md). Local studio: `npx mastra dev` (see `AGENTS.md`).

## Interface
- `mastra` (`[index.ts:mastra]`): Exported `Mastra` runtime singleton (`@mastra/core/mastra`) configured with:
  - `agents`: `{ jobPostProcessorAgent }`
  - `tools`: `{ challengeGeneratorTool, submissionScorerTool, interviewGuideTool }`
  - `workflows`: `{ scoreSubmissionWorkflow }`
  - `storage`: `new LibSQLStore({ id: 'mastra-storage', url: 'file:./mastra.db' })`
  - `logger`: `new PinoLogger({ name: 'Mastra', level: 'info' })`
  - `observability`: `new Observability({ configs: { default: { serviceName: 'mastra', exporters: [new DefaultExporter(), new CloudExporter()], spanOutputProcessors: [new SensitiveDataFilter()] } } })`
- Subdirectories:
  - `agents`: [./agents/README.md](./agents/README.md) - `jobPostProcessorAgent` for job-post complexity routing and extraction delegation.
  - `tools`: [./tools/README.md](./tools/README.md) - Structured Anthropic LLM tools (`jobPostExtractorTool`, `challengeGeneratorTool`, `submissionScorerTool`, `interviewGuideTool`) and exported Zod output schemas.
  - `workflows`: [./workflows/README.md](./workflows/README.md) - `scoreSubmissionWorkflow` 3-step pipeline for scoring candidate submissions, generating HR interview guides, and persisting results.

## Invariants
- Registration split: `mastra` registers 1 agent (`jobPostProcessorAgent`), 3 top-level tools (`challengeGeneratorTool`, `submissionScorerTool`, `interviewGuideTool`), and 1 workflow (`scoreSubmissionWorkflow`); `jobPostExtractorTool` is intentionally attached only to `jobPostProcessorAgent` and omitted from top-level `mastra.tools` (`[index.ts:mastra]`).
- Storage isolation: Mastra runtime storage is hardcoded to relative local SQLite file `'file:./mastra.db'` (`id: 'mastra-storage'`), separate from the primary application Drizzle DB (`@/db`) (`[index.ts:mastra]`).
- Logging and redaction: `PinoLogger` runs at `'info'` level (`name: 'Mastra'`) and observability always attaches `SensitiveDataFilter` as a `spanOutputProcessor` to redact passwords, tokens, and keys (`[index.ts:mastra]`).
- Cloud tracing activates when `MASTRA_CLOUD_ACCESS_TOKEN` is set in the environment (`[index.ts:mastra]`).

## Side Effects
- Instantiates `Mastra`, `LibSQLStore`, `PinoLogger`, `Observability`, `DefaultExporter`, `CloudExporter`, and `SensitiveDataFilter` at module import time (`[index.ts:mastra]`).
- Reads and writes local SQLite file `./mastra.db` for agent memory, workflow state, and Studio trace persistence (`[index.ts:mastra]`).
- Emits structured logs at `'info'` level via `PinoLogger` and conditionally exports telemetry spans to Mastra Cloud via `CloudExporter` when `MASTRA_CLOUD_ACCESS_TOKEN` is configured (`[index.ts:mastra]`).

## Verification
- Run: `pnpm lint && pnpm build`
- Local studio: `npx mastra dev`
