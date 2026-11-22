# Authenticated Chat Route (`chat`)

## Overview
Authenticated AI chat interface (`src/app/[locale]/(logged-in)/chat`) pairing a Server Component (`page.tsx`) that recalls persisted conversation history from Mastra agent memory with a Client Component (`chat-client.tsx`) that streams live responses via the AI SDK `useChat` hook against `/api/chat`.

## Interface
- `metadata`: `Metadata` — Static page metadata (`title: 'Chat | After42'`, `description: 'Chat with your AI health companion'`) `[page.tsx:metadata]`
- `default export Chat(): Promise<JSX.Element>` — Server Component recalling Mastra `'jobPostProcessorAgent'` memory, converting history via `toAISdkV5Messages`, and rendering `ChatClient` `[page.tsx:Chat]`
- `default export ChatClient({ initialMessages }: { initialMessages: UIMessage[] }): JSX.Element` — Client Component (`'use client'`) wrapper delegating to internal `ChatClientInner` `[chat-client.tsx:ChatClient]`

## Invariants
- `page.tsx` uses hardcoded `THREAD_ID = 'example-user-id'` (with a TODO noting replacement by auth session user ID) `[page.tsx:THREAD_ID]`
- Internal `getResourceId()` derives a provider-scoped memory resource ID from `agent.model.split('/')[0]` when `agent.model` is a string (else `'default'`), yielding ``after42-chat-${provider}`` `[page.tsx:getResourceId]`
- `Chat` catches and suppresses Mastra `memory?.recall(...)` errors, falling back to `response?.messages || []` `[page.tsx:Chat]`
- `chat-client.tsx` declares the `'use client'` directive `[chat-client.tsx:'use client']`
- `handleSubmit` returns early when `!input.trim()` `[chat-client.tsx:handleSubmit]`
- `PromptInputTextarea` is disabled whenever `useChat` `status !== 'ready'` `[chat-client.tsx:ChatClientInner]`
- The capture-phase global `keydown` handler ignores non-printable keys (`key.length !== 1` or `Enter`/`Tab`/`Escape`/`Backspace`), ignores `metaKey`/`ctrlKey` combinations, and skips when `document.activeElement` is an `input`, `textarea`, `role="textbox"`, or `contenteditable="true"` `[chat-client.tsx:isPrintableKey,isInputFocused,ChatClientInner]`
- Renders message parts with `type === 'text'` via `Message`/`MessageResponse` and parts with `type?.startsWith('tool-')` via `Tool` (defaulting `state` to `'output-available'` and `input` to `{}`); returns `null` for other part types `[chat-client.tsx:ChatClientInner]`

## Side Effects
- Looks up Mastra agent `mastra.getAgent('jobPostProcessorAgent')` and its memory via `.getMemory()` `[page.tsx:getResourceId,Chat]`
- Reads persisted thread messages via `memory?.recall({ threadId: THREAD_ID, resourceId })` `[page.tsx:Chat]`
- Logs `'No previous messages found.'` via `console.log` when memory recall throws `[page.tsx:Chat]`
- Configures AI SDK `useChat` with `new DefaultChatTransport({ api: '/api/chat' })` and dispatches HTTP streaming requests via `sendMessage({ text: input })` `[chat-client.tsx:ChatClientInner,handleSubmit]`
- Registers and cleans up a capture-phase `document` `keydown` event listener that calls `preventDefault()`, `stopPropagation()`, focuses the chat textarea, and appends typed characters to `input` state `[chat-client.tsx:ChatClientInner]`

## Verification
- Run: `pnpm lint && pnpm build`
