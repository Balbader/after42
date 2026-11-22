# Auth API Namespace (`auth`)

## Overview
Intermediate API route namespace (`src/app/api/auth`) grouping the Better Auth catch-all endpoint mounted under `/api/auth/*`.

## Subdirectories & Boundaries
- `[...all]`: [`[...all]`](<./[...all]/README.md>) - Catch-all Next.js Route Handler delegating `GET` and `POST` authentication requests to Better Auth via `toNextJsHandler(auth)`.
