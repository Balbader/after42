# after42 — documentation index

Human-readable architecture and data documentation for contributors and AI agents. Operational detail for day-to-day coding lives in [`CLAUDE.md`](../CLAUDE.md) (Cursor / Claude Code) and [`AGENTS.md`](../AGENTS.md) (Mastra-specific workflow).

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System layers, routing, BFF pattern, core product flows (**Mermaid** diagrams) |
| [DATA-MODEL.md](./DATA-MODEL.md) | Domain entities, relationships, blind-review rules (**ER diagram**) |
| [../DESIGN.md](../DESIGN.md) | Visual design system (fonts, colors, layouts) |
| [../CONTRIBUTING.md](../CONTRIBUTING.md) | Local setup, database workflow, quality checks |
| [../INTEGRATION-EXAMPLE.md](../INTEGRATION-EXAMPLE.md) | External integration patterns (historical / examples) |

## Diagram rendering

Mermaid blocks render on GitHub, in many IDEs (Markdown preview), and in docs sites. If a preview does not support Mermaid, copy the fenced block into [mermaid.live](https://mermaid.live).

## Source map (quick)

| Area | Location |
|------|----------|
| App Router (localized) | `src/app/[locale]/` |
| API routes | `src/app/api/` |
| Server actions | `src/app/actions/` |
| BFF (controllers / services) | `src/bff/` |
| Drizzle schemas | `src/db/schemas/` |
| Mastra (agents, tools) | `src/mastra/` |
| UI components | `src/components/` |
| i18n messages | `src/messages/{en,fr}.json` |
