# Mastra (`src/mastra/`)

Agents, tools, and Mastra app configuration for after42.

- **Entry:** [`index.ts`](./index.ts) — storage, logging, observability, registered agents.
- **Agents:** [`agents/`](./agents/) — e.g. job-post processor (routing + extraction).
- **Tools:** [`tools/`](./tools/) — structured extraction, challenge generation, scoring, interview guide.

Before changing Mastra APIs, read [**AGENTS.md**](../../AGENTS.md) (skills / docs) and the architecture overview [**docs/ARCHITECTURE.md**](../../docs/ARCHITECTURE.md).

Local studio: `npx mastra dev` (see `AGENTS.md`).
