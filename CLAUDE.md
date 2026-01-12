# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using the App Router, integrating Mastra (AI agent framework), Kinde authentication, Drizzle ORM with Turso database, and shadcn/ui components. The project demonstrates AI agent workflows with chat interfaces and weather-based activity planning.

## Development Commands

### Standard Operations
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database Operations (Drizzle + Turso)
- `npm run dbg` - Generate migrations from schema (drizzle-kit generate)
- `npm run dbm` - Apply migrations to database (drizzle-kit migrate)
- `npm run dbp` - Push schema directly to database (drizzle-kit push)
- `npm run dbs` - Open Drizzle Studio for database exploration

**Note:** Database schemas are in `src/db/shemas/` (note the typo: "shemas" not "schemas"). The Drizzle config points to this directory.

## Architecture

### Core Technologies
- **Framework:** Next.js 16.1.1 (App Router)
- **React:** 19.2.3
- **TypeScript:** Strict mode enabled, target ES2017
- **CSS:** Tailwind CSS 4 with @tailwindcss/postcss
- **UI Components:** shadcn/ui (New York style) + Radix UI primitives
- **Authentication:** Kinde (@kinde-oss/kinde-auth-nextjs)
- **Database:** Turso (libSQL) with Drizzle ORM
- **AI Framework:** Mastra (@mastra/core) with AI SDK integration

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page with Kinde auth links
│   ├── layout.tsx         # Root layout with Geist fonts
│   ├── globals.css        # Tailwind + CSS variables
│   ├── chat/              # Chat interface page
│   └── api/
│       ├── chat/          # Chat API route for Mastra agent
│       └── auth/[kindeAuth]/ # Kinde auth handler
├── components/
│   ├── ui/                # shadcn/ui components
│   └── ai-elements/       # Mastra AI UI components
├── db/
│   ├── index.ts           # Drizzle database client setup
│   └── shemas/            # Database schema definitions (note typo)
│       └── users.ts       # Users table schema
├── mastra/
│   ├── index.ts           # Mastra instance configuration
│   ├── agents/            # AI agent definitions
│   │   └── weather-agent.ts
│   ├── workflows/         # Mastra workflow definitions
│   │   └── weather-workflow.ts
│   └── tools/             # Agent tools
│       └── weather-tool.ts
├── lib/
│   └── utils.ts           # Utility functions (cn, etc.)
└── hooks/
    └── use-mobile.ts      # Mobile detection hook
```

### Mastra AI Framework

**Mastra Instance** (`src/mastra/index.ts`):
- Configured with PinoLogger (level: 'info')
- Uses LibSQLStore with in-memory storage (change to `file:../mastra.db` to persist)
- Observability enabled with DefaultExporter
- Registers all agents and workflows centrally

**Agent Pattern:**
- Agents use Claude Sonnet 4.5 (`anthropic/claude-sonnet-4-5`)
- Include Memory for conversation context
- Tools are registered with the agent
- Instructions guide agent behavior

**Workflow Pattern:**
- Use `createStep` for individual workflow steps
- Steps include id, description, inputSchema (Zod), outputSchema (Zod), and execute function
- Chain steps with `.then()` and call `.commit()` after building
- Access Mastra agents within workflow steps via `mastra?.getAgent(id)`

**Chat API Integration** (`src/app/api/chat/route.ts`):
- POST: Uses `handleChatStream` from @mastra/ai-sdk
- Returns `createUIMessageStreamResponse` for streaming
- GET: Recalls conversation history from agent memory
- Memory uses threadId and resourceId for conversation tracking

### Database (Drizzle + Turso)

**Configuration:**
- Connection via `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` environment variables
- Schema directory: `src/db/shemas/**/*.ts` (note directory name typo)
- Migrations output to `./migrations`
- Dialect: turso (libSQL)

**Schema Pattern:**
- Use `sqliteTable` from drizzle-orm/sqlite-core
- Export `$inferInsert` and `$inferSelect` types from tables
- Example: `src/db/shemas/users.ts`

**Client Setup:**
- Database client initialized in `src/db/index.ts`
- Uses `drizzle-orm/libsql` driver
- Loads env vars with dotenv

### Authentication (Kinde)

- Catch-all route handler at `src/app/api/auth/[kindeAuth]/route.js`
- Use `RegisterLink` and `LoginLink` components from Kinde
- Environment variables: `KINDE_*` prefix (configured in .env files)

### UI Components

**shadcn/ui Configuration:**
- Style: "new-york"
- RSC: true (React Server Components)
- Base color: neutral
- CSS variables enabled
- Icon library: lucide-react
- Aliases: @/components, @/lib, @/hooks, @/components/ui

**AI Components:**
- Located in `src/components/ai-elements/`
- Include message, prompt-input, code-block, artifact, reasoning, and more
- Used for building AI chat interfaces with Mastra

### Path Aliases

TypeScript path alias: `@/*` → `./src/*`

Aliases used throughout:
- `@/components` → src/components
- `@/lib` → src/lib
- `@/hooks` → src/hooks
- `@/mastra` → src/mastra
- `@/db` → src/db

## Environment Variables

Required environment variables (stored in `.env` and `.env.local`):
- `TURSO_CONNECTION_URL` - Turso database connection URL
- `TURSO_AUTH_TOKEN` - Turso authentication token
- `KINDE_*` - Kinde authentication configuration

Environment files are gitignored (`.env*` pattern).

## Important Notes

1. **Schema Directory Typo:** Database schemas are in `src/db/shemas/` (not "schemas"). The Drizzle config references this exact path.

2. **Mastra Storage:** The Mastra instance uses in-memory storage by default. To persist data, change the LibSQLStore URL in `src/mastra/index.ts` from `:memory:` to `file:../mastra.db`.

3. **Chat Memory:** The chat API uses hardcoded thread/resource IDs (`example-user-id` and `weather-chat`). Implement user-specific IDs for multi-user applications.

4. **AI Model:** Agents default to Claude Sonnet 4.5 (`anthropic/claude-sonnet-4-5`). Ensure API keys are configured for Anthropic.

5. **Strict TypeScript:** The project uses strict mode. All types should be properly defined.

6. **CSS Variables:** The project uses CSS variables for theming (see `src/app/globals.css`). Follow existing patterns when adding new components.
