# agents

## Overview
Defines Mastra autonomous agents for after42. Currently contains `jobPostProcessorAgent` (`[job-post-processor.ts:jobPostProcessorAgent]`), which evaluates raw job posting complexity and delegates structured JSON extraction to `jobPostExtractorTool` (`extract-job-post`) using either fast (Haiku) or accurate (Sonnet) mode.

## Interface
- `jobPostProcessorAgent` (`[job-post-processor.ts:jobPostProcessorAgent]`): Exported Mastra `Agent` (`@mastra/core/agent`) with:
  - `id`: `'job-post-processor'`
  - `name`: `'Job Post Processor'`
  - `model`: `'anthropic/claude-haiku-4-5-20251001'`
  - `tools`: `{ jobPostExtractorTool }` (from `../tools/job-post-extractor-tool`)
  - `memory`: `new Memory()` (`@mastra/memory`, default config)
  - `instructions`: System prompt defining complexity routing heuristics (`< 2000` chars well-formatted/standard -> `'fast'`, `> 2000` chars/unstructured/multilingual/jargon -> `'accurate'`).

## Invariants
- Fixed routing model identifier `'anthropic/claude-haiku-4-5-20251001'` (`[job-post-processor.ts:jobPostProcessorAgent]`).
- Prompt-enforced delegation invariant: the agent must always invoke `extract-job-post` (`jobPostExtractorTool`), never extract fields manually, and bias conservatively toward `modelPreference: "accurate"` when uncertain (`[job-post-processor.ts:jobPostProcessorAgent]`).
- `new Memory()` is constructed without a local storage instance and relies on the parent `Mastra` storage backend at runtime (`[job-post-processor.ts:jobPostProcessorAgent]`).

## Side Effects
- Performs outbound Anthropic LLM calls (`anthropic/claude-haiku-4-5-20251001`) via the Mastra `Agent` runtime (`[job-post-processor.ts:jobPostProcessorAgent]`).
- Executes `jobPostExtractorTool`, triggering secondary Anthropic API calls (`[job-post-processor.ts:jobPostProcessorAgent]`).
- Reads and writes conversation memory via `@mastra/memory` (`[job-post-processor.ts:jobPostProcessorAgent]`).

## Verification
- Run: `pnpm lint && pnpm build`
