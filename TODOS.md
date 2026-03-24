# TODOS

Deferred work captured during engineering review. Each item has context so it can be picked up cold.

---

## TODO-1: Identity Scrubber — Strip PII from Candidate Code Submissions

**What:** Before storing or displaying candidate code submissions to companies, run a scrubbing pass that removes or redacts personally identifiable information embedded in source code (comments, variable names, email addresses, GitHub usernames, license headers, etc.).

**Why:** The blind review model is the core trust mechanism of after42. Companies see "Candidate #1 (91/100)" — never a name or identity. But a candidate might write `// Written by john.doe@gmail.com` or push code that imports their personal GitHub package. A scrubber that catches common PII patterns closes this loophole before it undermines the whole model.

**Pros:**
- Closes the most likely accidental de-anonymization vectors
- Protects both parties: candidates who might unknowingly reveal identity, companies who committed to blind review
- Relatively simple LLM pass: prompt with the code + "redact any identifying information"

**Cons:**
- LLM scrubbers are probabilistic — a determined candidate can always obscure identity in ways that survive a scrub (algorithm-shaped code, distinct style)
- Adds latency to the scoring pipeline
- May over-redact (remove legitimate comments)

**Context:** Decided during /plan-eng-review (2026-03-24, branch: gstack). The blind review model is central to the after42 value proposition — companies evaluate code quality alone, identity revealed only at first live interview. The scrubber is a best-effort guard against accidental disclosure, not a cryptographic guarantee. Implement as a Mastra tool in the scoring pipeline: code goes in → scrubbed code goes out → scrubbed code stored and shown.

**Depends on / blocked by:** `candidate_submission` table + scoring Mastra workflow (Phase 2-3 of build order). Scrubber should be added as a step between submission and scoring.

**Where to start:** `src/mastra/tools/` — new file `identity-scrubber-tool.ts`. Called from the submission scoring Mastra workflow before `submission-scorer-tool`.

---

---

## TODO-2: Sidebar Role Mismatch — 'programmer' → 'candidate'

**What:** `src/components/sidebar/app-sidebar.tsx` checks `user.role === 'programmer'` to show candidate nav. When the auth.ts fix changes the role default to `'candidate'`, all existing candidate users will get empty sidebar navigation — the condition will never match.

**Why:** Silent breakage. The sidebar won't throw, it'll just show nothing. This is easy to miss because no test covers it and ESLint won't catch it.

**Pros:** One-line fix: change `'programmer'` to `'candidate'` in `app-sidebar.tsx`.

**Cons:** None — but it must ship in the same commit as the auth.ts role fix to avoid a broken intermediate state.

**Context:** Discovered during /plan-design-review (2026-03-24, branch: gstack). The role 'programmer' appears to be a legacy naming from an earlier product concept (the same refactor that left 'patient' in auth.ts). Fix both in the same Phase 1 commit.

**Depends on / blocked by:** Auth.ts role fix (Phase 1, Fix 1). Must ship together.

**Where to start:** `src/components/sidebar/app-sidebar.tsx` — search for `'programmer'` (2 occurrences in the role conditions).

---

*This file is consumed by /plan-eng-review, /qa, and /ship to surface deferred work.*
