# after42

Recruitment platform built with **Next.js** (App Router), **Mastra**, and **Better-auth**. Recruiters upload job posts (PDF/DOCX/TXT); AI extracts structured data and generates coding challenges. Candidates work in GitHub forks; submissions are scored with AI assistance. Recruiter review is **blind** (candidates identified only by sequence number in company UI).

## Documentation

| Doc | Description |
|-----|-------------|
| [**docs/README.md**](./docs/README.md) | Index of all technical docs |
| [**docs/ARCHITECTURE.md**](./docs/ARCHITECTURE.md) | System architecture, routing, flows (**Mermaid** diagrams) |
| [**docs/DATA-MODEL.md**](./docs/DATA-MODEL.md) | Entities, relationships, blind-review rules |
| [**DESIGN.md**](./DESIGN.md) | Typography, colors, layout |
| [**CONTRIBUTING.md**](./CONTRIBUTING.md) | Local setup, DB workflow, PR notes |
| [**CLAUDE.md**](./CLAUDE.md) | Detailed guide for AI coding assistants |
| [**AGENTS.md**](./AGENTS.md) | Mastra project layout and skills |

## Quick start

```bash
pnpm install
cp .env.example .env   # fill in Turso, auth, Resend, Anthropic, etc.
pnpm dbm               # apply migrations
pnpm dev               # http://localhost:3000
```

Optional: `pnpm seed` for test users and sample challenges. Mastra Studio: `npx mastra dev` (separate port, see `AGENTS.md`).

## Stack (short)

- **Framework:** Next.js 16, React 19, TypeScript  
- **Data:** Drizzle ORM, Turso (LibSQL)  
- **Auth:** Better-auth, email verification (Resend)  
- **AI:** Mastra, Anthropic via `@ai-sdk/anthropic`  
- **i18n:** next-intl (`fr` default, `en`)  
- **UI:** Tailwind CSS 4, components under `src/components/`

## Repository layout

```
src/app/[locale]/     # Localized routes (route groups: pages, logged-in, candidate, company)
src/app/api/          # Auth handler, chat stream, emails
src/app/actions/      # Server actions
src/bff/              # Controllers + services
src/db/schemas/       # Drizzle schema
src/mastra/           # Agents, tools, workflows
src/components/       # UI by feature
src/messages/         # next-intl JSON
docs/                 # Architecture + data model (Mermaid)
```

## License

Private / see repository settings.
