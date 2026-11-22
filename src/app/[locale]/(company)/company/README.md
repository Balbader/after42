# Company Route Namespace (`company`)

## Overview
Intermediate route namespace (`src/app/[locale]/(company)/company`) grouping recruiter-facing company management, challenge administration, and blind candidate review pages under `/company/*`.

## Subdirectories & Boundaries
- `candidates`: [`candidates`](./candidates/README.md) - Standalone recruiter candidate-submission review route wrapping `RecruiterCandidatesReview` and `UnifiedDashboardBanner`.
- `challenges`: [`challenges`](./challenges/README.md) - Recruiter challenge catalog, challenge detail view (`[id]`), ranked submissions list (`[id]/submissions`), and individual submission review workspace (`[id]/submissions/[submissionId]`).
- `profile`: [`profile`](./profile/README.md) - Read-only company profile management placeholder route restricted to recruiters.
