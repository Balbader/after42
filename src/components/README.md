# Components (`src/components`)

## Overview
UI component layer for `after42`, combining top-level theme and locale provider/switcher controls with nine domain and library child packages covering shadcn/ui primitives, AI conversation elements, authentication, candidate and recruiter workspaces, job-post management, public marketing sections, layout chrome, and sidebar navigation.

## Interface
- `ModeToggle()` (`'use client'`) — Icon `Button` dropdown switching theme between `'light'`, `'dark'`, and `'system'` `[dark-mode-toggle.tsx:ModeToggle]`.
- `SidebarModeToggle()` (`'use client'`) — `SidebarMenuButton` dropdown (`align='start'`, `side='right'`, `sideOffset={8}`) switching theme between `'light'`, `'dark'`, and `'system'` `[dark-mode-toggle.tsx:SidebarModeToggle]`.
- `LanguageSwitcher()` (`'use client'`) — Icon `Button` dropdown listing `routing.locales` to switch the active locale via `router.replace` `[language-switcher.tsx:LanguageSwitcher]`.
- `ThemeProvider({ children, ...props })` (`'use client'`) — Wrapper forwarding `React.ComponentProps<typeof NextThemesProvider>` to `next-themes` `[theme-provider.tsx:ThemeProvider]`.
- Subdirectories:
  - [`./ai-elements/README.md`](./ai-elements/README.md) — 48 AI-domain compound component modules for chat conversations, prompt input, tool/approval rendering, reasoning traces, previews, audio/speech/voice controls, personas, and workflow graphs.
  - [`./auth/README.md`](./auth/README.md) — Client authentication forms, field primitives, and onboarding flows (`SignInForm`, `SignUpFlow`, `SignUpForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `SignOutButton`, `AuthPanel`, `AuthBrandAside`).
  - [`./candidate/README.md`](./candidate/README.md) — Candidate challenge workflow components (`ForkChallengeBtn`, `SubmitWorkspace`, `TerminalState`).
  - [`./company/README.md`](./company/README.md) — Recruiter workspace shell, tabs, unified dashboard, challenge generation button, candidate/submission review lists, and three-pane `ReviewWorkspace`.
  - [`./home/README.md`](./home/README.md) — Public marketing landing page (`HomePage`) and five GSAP-animated localized sections.
  - [`./job-post/README.md`](./job-post/README.md) — Recruiter job-post uploader, list, confirmation-gated delete button, and static placeholder.
  - [`./layout/README.md`](./layout/README.md) — Client pathname breadcrumbs (`DynamicBreadcrumb`) and child `./navigation` global `Header`/`Footer` chrome.
  - [`./sidebar/README.md`](./sidebar/README.md) — Authenticated inset sidebar (`AppSidebar`) with role-filtered `NavMain`, `NavSecondary`, `NavUser`, and `NavProjects`.
  - [`./ui/README.md`](./ui/README.md) — 56 standalone shadcn/ui primitive modules wrapping Radix UI, `@base-ui/react`, Recharts, Embla Carousel, React Day Picker, cmdk, Vaul, and native controls.

## Invariants
- `ModeToggle` and `SidebarModeToggle` require client `next-themes` (`useTheme`) and `next-intl` (`useTranslations('theme')`) providers, expose only literal theme values `'light' | 'dark' | 'system'`, and `SidebarModeToggle` additionally requires `SidebarProvider` via `SidebarMenuButton` `[dark-mode-toggle.tsx:ModeToggle]` `[dark-mode-toggle.tsx:SidebarModeToggle]`.
- `LanguageSwitcher` requires client `next-intl` (`useLocale`, `useTranslations('language')`) and `@/i18n/navigation` (`usePathname`, `useRouter`) contexts, derives options strictly from `routing.locales`, no-ops when `next === locale`, disables the active locale item, and disables the trigger while `useTransition` is pending `[language-switcher.tsx:LanguageSwitcher]` `[language-switcher.tsx:switchLocale]`.
- `ThemeProvider` is a client-only transparent wrapper forwarding all props directly to `NextThemesProvider` `[theme-provider.tsx:ThemeProvider]`.
- Child component packages enforce provider-scoped context hooks (`useSidebar`, `useCarousel`, `useChart`, `useFormField`, `useRecruiterTab`, and 17 `ai-elements` hooks across 14 modules throw outside their providers), `next-intl` namespaces, and server-action error guards before client navigation.

## Side Effects
- `ModeToggle` and `SidebarModeToggle` mutate global theme state via `next-themes` `setTheme('light' | 'dark' | 'system')` `[dark-mode-toggle.tsx:ModeToggle]` `[dark-mode-toggle.tsx:SidebarModeToggle]`.
- `LanguageSwitcher` triggers client-side route replacement via `router.replace(pathname, { locale: next })` inside `startTransition` `[language-switcher.tsx:switchLocale]`.
- `ThemeProvider` delegates DOM/storage theme management to `NextThemesProvider` `[theme-provider.tsx:ThemeProvider]`.
- Child packages trigger server actions (`auth`, `challenge`, `job-post`, `fork-challenge`, `submit-challenge`), Better Auth client calls, polling intervals (`/api/commits/[forkName]`, `router.refresh()`), clipboard writes, cookies (`sidebar_state`), GSAP ScrollTrigger listeners, browser audio/speech/media APIs, and external fetches (`models.dev` logos, Vercel Blob `.riv` personas).

## Verification
- Run: `pnpm lint && pnpm build`
