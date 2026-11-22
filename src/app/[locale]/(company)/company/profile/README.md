# Company Profile Route (`profile`)

## Overview
Recruiter Server Component placeholder page (`src/app/[locale]/(company)/company/profile`) for company profile management, presenting read-only company name and description fields with a disabled save button.

## Interface
- `metadata`: `Metadata` — Static page metadata (`title: 'Company Profile — after42'`, `description: 'View and manage your company profile.'`) `[page.tsx:metadata]`
- `default export CompanyProfilePage({ params }: { params: Promise<{ locale: string }> }): Promise<JSX.Element>` — Server Component rendering the read-only company profile UI `[page.tsx:CompanyProfilePage]`

## Invariants
- Awaits `params` (`Promise<{ locale: string }>`) and invokes `setRequestLocale(locale)` before loading `'company'` translations `[page.tsx:CompanyProfilePage]`
- Enforces recruiter role authorization via `await requireRole('recruiter')` `[page.tsx:CompanyProfilePage]`
- All form controls are strictly read-only/disabled (`<input readOnly>`, `<textarea readOnly rows={4}>`, `<button type="button" disabled>`) with no submission handler or server action `[page.tsx:CompanyProfilePage]`

## Side Effects
- Configures `next-intl` request locale via `setRequestLocale(locale)` and loads `'company'` translations via `getTranslations('company')` `[page.tsx:CompanyProfilePage]`
- Verifies recruiter auth session and role via `requireRole('recruiter')` `[page.tsx:CompanyProfilePage]`

## Verification
- Run: `pnpm lint && pnpm build`
