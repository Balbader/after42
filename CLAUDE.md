# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js 16 + Mastra** project combining:
- **Next.js 16** (App Router) for the web application framework
- **Mastra** for AI agents, workflows, and tools
- **shadcn/ui** for UI components (New York style)
- **Tailwind CSS v4** for styling
- **TypeScript** with strict mode enabled
- **pnpm** as the package manager

## Commands

### Development
```bash
pnpm dev              # Start Next.js dev server (http://localhost:3000)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Package Management
```bash
pnpm install          # Install dependencies
```

Note: This project uses **pnpm**, not npm or yarn. The `pnpm-workspace.yaml` indicates potential monorepo support.

## Architecture

### Next.js Application Structure

- **`src/app/`** - Next.js App Router pages and layouts
  - `page.tsx` - Home page
  - `layout.tsx` - Root layout with Geist fonts
  - `globals.css` - Global styles and Tailwind directives
  - `api/chat/` - API route for chat functionality
  - `chat/` - Chat UI page

- **`src/components/`** - React components
  - `ui/` - shadcn/ui components (forms, buttons, tables, etc.)
  - `ai-elements/` - AI-specific UI components

- **`src/lib/`** - Shared utilities
  - `utils.ts` - Common utility functions (likely cn() for classnames)

- **`src/hooks/`** - React hooks (including `use-mobile.ts`)

### Mastra Integration

The Mastra framework is centralized in `src/mastra/`:

- **`src/mastra/index.ts`** - Main Mastra configuration
  - Configures LibSQLStore for persistent storage (`mastra.db`)
  - Sets up Pino logging
  - Configures observability with DefaultExporter and CloudExporter
  - Registers agents and workflows

- **`src/mastra/agents/`** - AI agent definitions
  - Example: `weather-agent.ts` uses Claude Sonnet 4.5 model
  - Agents include instructions, tools, and memory

- **`src/mastra/tools/`** - Reusable tools for agents
  - Example: `weather-tool.ts` provides weather data capabilities

- **`src/mastra/workflows/`** - Multi-step orchestrations
  - Example: `weather-workflow.ts` orchestrates weather-related tasks

### Key Configuration Files

- **`tsconfig.json`** - Path alias `@/*` maps to `./src/*`
- **`components.json`** - shadcn/ui configuration (New York style, stone base color)
- **`eslint.config.mjs`** - ESLint v9+ flat config with Next.js presets
- **`.env`** - Environment variables (notably `ANTHROPIC_API_KEY`)

## Development Patterns

### Adding Mastra Agents

1. Create agent file in `src/mastra/agents/[agent-name].ts`
2. Define agent with `new Agent()` from `@mastra/core/agent`
3. Specify model (e.g., `'anthropic/claude-sonnet-4-5'`)
4. Add instructions, tools, and memory
5. Export and register in `src/mastra/index.ts`

### Adding Tools

1. Create tool in `src/mastra/tools/[tool-name].ts`
2. Define tool schema and execution logic
3. Import and attach to relevant agents

### Adding UI Components

Use shadcn/ui CLI to add components:
```bash
npx shadcn@latest add [component-name]
```

Components are installed with:
- Style: New York
- Base color: stone
- CSS variables enabled
- Path aliases configured

## Mastra Skills

This project has Mastra skills configured for Claude Code and Cursor. See [AGENTS.md](./AGENTS.md) for complete details on:
- Project structure
- Skills usage
- Documentation links

## Important Notes

- **Model**: Default Mastra agent uses `anthropic/claude-sonnet-4-5`
- **Storage**: LibSQL stores data in `./mastra.db`
- **Observability**: Traces are sent to both local storage and Mastra Cloud (if token is set)
- **Fonts**: Uses Geist Sans and Geist Mono from Vercel
- **React**: Uses React 19 with concurrent features
