# API Routes (`api`)

## Overview
Intermediate API route blueprint (`src/app/api`) grouping all Next.js App Router HTTP route handlers for authentication, AI chat streaming/memory, candidate GitHub fork commit counting, and transactional welcome emails.

## Subdirectories & Boundaries
- `auth`: [`auth`](./auth/README.md) - Better Auth catch-all HTTP endpoints mounted at `/api/auth/[...all]`.
- `chat`: [`chat`](./chat/README.md) - Streaming Mastra agent chat (`POST`) and memory history recall (`GET`) at `/api/chat`.
- `commits`: [`commits`](./commits/README.md) - Candidate-owned GitHub fork commit count lookup at `/api/commits/[forkName]`.
- `emails`: [`emails`](./emails/README.md) - Resend transactional welcome email dispatch endpoint (`POST`) at `/api/emails`.
