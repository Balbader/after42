# Commits API Namespace (`commits`)

## Overview
Intermediate API route namespace (`src/app/api/commits`) grouping the dynamic GitHub fork commit-count endpoint under `/api/commits/[forkName]`.

## Subdirectories & Boundaries
- `[forkName]`: [`[forkName]`](<./[forkName]/README.md>) - Candidate-authenticated `GET` route returning non-baseline GitHub commit counts for an owned submission fork.
