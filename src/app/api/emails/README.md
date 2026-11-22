# Emails API Route (`emails`)

## Overview
Next.js App Router API route (`src/app/api/emails`) that renders the React `Email` template (`@/emails/email`) and sends a welcome email via Resend.

## Interface
- `POST(req: Request): Promise<NextResponse>` — Accepts JSON `{ url }`, dispatches a welcome email via Resend, and returns Resend's response payload (`200`) or `{ error: 'Failed to send email' }` (`500`) `[route.ts:POST]`

## Invariants
- Instantiates the `Resend` client at module evaluation using `process.env.RESEND_API_KEY` `[route.ts:resend]`
- Expects a JSON body destructurable as `{ url }` (`await req.json()`) `[route.ts:POST]`
- Uses hardcoded delivery fields `from: 'onboarding@resend.dev'`, `to: 'basil@after42.ai'`, `subject: 'Welcome to After42!'`, and renders `Email({ url })` `[route.ts:POST]`
- Enforces no authentication, authorization, or input validation on `POST` `[route.ts:POST]`
- Catches errors thrown by `resend.emails.send(...)` and returns HTTP `500` `{ error: 'Failed to send email' }` `[route.ts:POST]`

## Side Effects
- Initializes `new Resend(process.env.RESEND_API_KEY)` at module load `[route.ts:resend]`
- Sends an outbound transactional email via the Resend HTTP API (`resend.emails.send(...)`) using React component `Email({ url })` `[route.ts:POST]`

## Verification
- Run: `pnpm lint && pnpm build`
