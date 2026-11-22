# Chat API Route (`chat`)

## Overview
Next.js App Router API route (`src/app/api/chat`) exposing streaming AI chat (`POST`) and persisted chat history recall (`GET`) backed by the Mastra job-post processor agent and AI SDK v5 UI message helpers.

## Interface
- `POST(req: Request): Promise<Response>` — Parses JSON request body, injects hardcoded memory identifiers, streams Mastra agent responses via `handleChatStream`, and returns `createUIMessageStreamResponse({ stream })` `[route.ts:POST]`
- `GET(): Promise<NextResponse>` — Recalls Mastra agent memory messages, converts them via `toAISdkV5Messages`, and returns a JSON array `[route.ts:GET]`

## Invariants
- Hardcoded constants `THREAD_ID = 'example-user-id'` and `RESOURCE_ID = 'after42-chat-anthropic'` unconditionally overwrite `params.memory.thread` and `params.memory.resource` on `POST` and scope memory recall on `GET` `[route.ts:THREAD_ID,RESOURCE_ID,POST,GET]`
- `POST` targets Mastra `agentId: 'job-post-processor'`, whereas `GET` resolves the agent via `mastra.getAgent('jobPostProcessorAgent')` `[route.ts:POST,GET]`
- `POST` expects a valid JSON request body (`await req.json()`) `[route.ts:POST]`
- `GET` catches any error thrown by `memory?.recall(...)` and falls back to `response?.messages || []` `[route.ts:GET]`
- Neither `POST` nor `GET` enforces authentication or role authorization `[route.ts:POST,GET]`

## Side Effects
- `POST` invokes Mastra agent `'job-post-processor'` via `handleChatStream({ mastra, agentId: 'job-post-processor', params })`, performing LLM inference and Mastra memory read/write for thread `'example-user-id'` / resource `'after42-chat-anthropic'`, and streams an AI SDK UI message response `[route.ts:POST]`
- `GET` queries Mastra agent memory via `mastra.getAgent('jobPostProcessorAgent').getMemory()` and `memory?.recall({ threadId: 'example-user-id', resourceId: 'after42-chat-anthropic' })` `[route.ts:GET]`
- `GET` logs `'No previous messages found.'` via `console.log` when `memory?.recall(...)` throws `[route.ts:GET]`

## Verification
- Run: `pnpm lint && pnpm build`
