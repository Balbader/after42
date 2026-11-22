# Public Home Route (`home`)

## Overview
Public landing page route (`src/app/[locale]/(pages)/home`) exporting static page metadata and delegating UI rendering to `HomePage` (`@/components/home/home-page`). Also imported directly by the `[locale]` index page.

## Interface
- `metadata`: `Metadata` — Static page metadata (`title: 'after42 — AI-Powered Technical Hiring'`, `description: 'Upload a job post, generate a coding challenge, and evaluate candidates with blind AI-scored reviews.'`) `[page.tsx:metadata]`
- `default export Home(): JSX.Element` — Renders `<HomePage />` `[page.tsx:Home]`

## Invariants
- None

## Side Effects
- None

## Verification
- Run: `pnpm lint && pnpm build`
