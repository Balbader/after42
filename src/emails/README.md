# src/emails

## Overview
Transactional React Email (`@react-email/components`) template components styled with `@react-email/components` `Tailwind`, paired with a URL locale-detection helper for Better Auth callbacks. Templates cover `after42` email verification (`en`/`fr`), `after42` password reset (`en`/`fr`), organization invitations (English-only with placeholder company footer), and a minimal `"Oto"`-branded welcome/verification template. Email transport, HTML serialization, and subject-line assembly live outside this package (in `src/lib/auth.ts` and `src/app/api/emails/route.ts`).

## Interface
- `default Email(props: { url: string })` — minimal `"Oto"` verification email component `[email.tsx:Email]`
- `localeFromAuthUrl(url: string): 'en' | 'fr'` — infers email copy locale from a Better Auth URL and its redirect query parameters `[locale-from-auth-url.ts:localeFromAuthUrl]`
- `default OrganizationInvitationEmail(props: OrganizationInvitationEmailProps)` — team invitation email component accepting `{ email, invitedByUsername, invitedByEmail, teamName, inviteLink }` `[organization-invitation.tsx:OrganizationInvitationEmail]`
- `default ResetPasswordEmail(props: ResetPasswordEmailProps)` — localized password reset email component accepting `{ username, resetUrl, userEmail, locale?: 'en' | 'fr' }` `[reset-password.tsx:ResetPasswordEmail]`
- `default VerifyEmail(props: VerifyEmailProps)` — localized email verification component accepting `{ username, verifyUrl, locale?: 'en' | 'fr' }` `[verify-email.tsx:VerifyEmail]`

## Invariants
- **Strict `'en' | 'fr'` locale resolution and fallback**: `localeFromAuthUrl` always returns `'en' | 'fr'`, falling back to `'en'` when no French segment matches or `new URL(url)` throws `[locale-from-auth-url.ts:localeFromAuthUrl]`.
- **Auth URL inspection rules**: `localeFromAuthUrl` inspects `u.pathname + u.search`, `u.href`, and decoded (falling back to raw on decode error) `'callbackURL'`, `'redirect'`, and `'redirectTo'` query parameters; returns `'fr'` strictly when any chunk contains `'/fr/'` or `'/fr?'` (case-sensitive) `[locale-from-auth-url.ts:localeFromAuthUrl]`.
- **Template locale defaults and HTML attributes**: `ResetPasswordEmail` and `VerifyEmail` default `locale` to `'en'`, index `copy[locale]`, and set `<Html dir='ltr' lang={locale === 'fr' ? 'fr' : 'en'}>` `[reset-password.tsx:ResetPasswordEmail]`, `[verify-email.tsx:VerifyEmail]`. `OrganizationInvitationEmail` hardcodes `<Html dir='ltr' lang='en'>` `[organization-invitation.tsx:OrganizationInvitationEmail]`; `Email` omits `lang`/`dir` `[email.tsx:Email]`.
- **Hardcoded copy and styling constraints**: `Email` uses `pixelBasedPreset` with `brand: '#007291'` `[email.tsx:Email]`; `ResetPasswordEmail` hardcodes 24-hour expiry copy and `mailto:basil@after42.ai` `[reset-password.tsx:copy]`, `[reset-password.tsx:ResetPasswordEmail]`; `VerifyEmail` hardcodes 24-hour expiry copy and an untranslated English `Unsubscribe` `<Link href='/'>` `[verify-email.tsx:copy]`, `[verify-email.tsx:VerifyEmail]`; `OrganizationInvitationEmail` contains placeholder company footer text (`Your Company Name`, `123 Business Street, Suite 100, City, State 12345`) `[organization-invitation.tsx:OrganizationInvitationEmail]`.

## Side Effects
- **System clock reads during render**: Calls `new Date().getFullYear()` to render the copyright footer year `[organization-invitation.tsx:OrganizationInvitationEmail]`, `[reset-password.tsx:ResetPasswordEmail]`, `[verify-email.tsx:VerifyEmail]`. (No network/SMTP/Resend calls, environment reads, logging, or file/DB I/O occur in this directory.)

## Verification
- Run: `pnpm lint && pnpm build`
