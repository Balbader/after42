# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**after42** is a Next.js application built with TypeScript, combining modern web development with AI capabilities via Mastra. The stack includes:

- **Next.js 16** with App Router for frontend and API routes
- **Mastra** for AI agents, workflows, and tools
- **Better-auth** for authentication with email verification
- **Drizzle ORM** with Turso (LibSQL) database
- **React Email** with Resend for transactional emails
- **Tailwind CSS 4** for styling

## Common Commands

### Development
```bash
npm run dev          # Start Next.js dev server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database (Drizzle)
```bash
npm run dbg          # Generate migrations from schema changes
npm run dbm          # Run migrations
npm run dbp          # Push schema directly to database (dev only)
npm run dbs          # Open Drizzle Studio
```

**Database workflow**: Modify schemas in `src/db/schemas/*.ts`, then run `dbg` to generate migrations, followed by `dbm` to apply them.

## Architecture

### Directory Structure

- **`src/app/`** - Next.js App Router pages, layouts, and API routes
  - `(logged-in)/` - Protected routes for authenticated users
  - `(pages)/` - Public-facing pages
  - `actions/` - Server actions
  - `api/` - API route handlers (auth, chat, emails)

- **`src/bff/`** - Backend-for-Frontend layer
  - `controllers/` - Request handlers and business logic
  - `models/` - Data models and types
  - `services/` - Reusable business logic services

- **`src/db/`** - Database layer
  - `schemas/` - Drizzle table schemas (schema.ts, programmer.ts, recruiter.ts, company.ts, challenge.ts)
  - `migrations/` - Generated SQL migrations
  - `index.ts` - Database client configuration with Turso

- **`src/mastra/`** - AI framework (see [AGENTS.md](./AGENTS.md))
  - `agents/` - AI agent definitions
  - `tools/` - Reusable tools for agents
  - `workflows/` - Multi-step workflows

- **`src/components/`** - React components
- **`src/lib/`** - Shared utilities and configurations
- **`src/emails/`** - React Email templates
- **`src/hooks/`** - Custom React hooks

### Authentication

Uses **better-auth** with:
- Email/password authentication with verification
- Password reset via email (Resend)
- SQLite adapter with Drizzle
- Custom user fields: `role`, `dateOfBirth`, `termsAcceptedAt`, `privacyPolicyAcceptedAt`
- Session management with cookies (next-js plugin)

**Auth files**:
- `src/lib/auth.ts` - Server-side auth instance
- `src/lib/auth-client.ts` - Client-side auth hooks
- `src/app/actions/auth.ts` - Auth server actions
- `src/bff/controllers/auth.controller.ts` - Auth business logic

### Database Schema

Core tables managed by better-auth:
- `user` - User profiles with custom fields
- `session` - Active sessions
- `account` - OAuth provider accounts
- `verification` - Email verification tokens

Domain tables:
- `programmer` - 42 School programmer profiles
- `recruiter` - Recruiter profiles
- `company` - Company information
- `challenge` - Coding challenges

### Path Aliases

TypeScript paths are configured with `@/*` mapping to `src/*`:
```typescript
import { db } from '@/db';
import { auth } from '@/lib/auth';
```

## Mastra AI Framework

**CRITICAL**: Before working with Mastra code, load the Mastra skill first using `/mastra` or the Skill tool. Mastra APIs change frequently - always verify against current documentation.

For complete Mastra guidance, see [AGENTS.md](./AGENTS.md).

## Environment Variables

Required environment variables (in `.env` or `.env.local`):
- `TURSO_CONNECTION_URL` - Turso database URL
- `TURSO_AUTH_TOKEN` - Turso authentication token
- `RESEND_API_KEY` - Resend API key for emails
- Additional Mastra model provider keys (see `.env` files)
