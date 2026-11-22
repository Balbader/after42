# Sidebar Components (`src/components/sidebar`)

## Overview
Implements the authenticated application's inset navigation sidebar built on `@/components/ui/sidebar` primitives, `@/i18n/navigation` links, and `next-intl` translations. `AppSidebar` is the root container accepting a serialized `SidebarUser | null` prop and composing `NavMain` (collapsible role-specific primary links), `NavSecondary` (footer-aligned utility links), footer `<LanguageSwitcher />` and `<SidebarModeToggle />` controls, and `NavUser` (profile dropdown and sign-out action). `NavProjects` is an unused shadcn/ui boilerplate component marked `// TODO: Remove this component if not needed` and is not imported by `AppSidebar`.

## Interface
- `SidebarUser` (`export type SidebarUser = { id: string; name: string; email: string; role: string; avatar?: string }`) and `AppSidebar({ user, ...props }: { user: SidebarUser | null } & React.ComponentProps<typeof Sidebar>)` (`'use client'`, named exports): Renders the `variant='inset'` sidebar with `/dashboard` brand link, role-filtered `NavMain` (candidate routes: `/dashboard`, `/profile`, `/candidate/challenges`, `#`; recruiter routes: `/dashboard`, `/profile`, `/dashboard?tab=pipeline|challenges|review`), `NavSecondary` (`#` support/feedback links), `<LanguageSwitcher />`, `<SidebarModeToggle />`, and `<NavUser />` `[app-sidebar.tsx:SidebarUser]`, `[app-sidebar.tsx:AppSidebar]`.
- `NavMain({ items })` (`'use client'`, named export): Renders collapsible `<SidebarGroup>` (`t('platform')`) menu items with localized `<Link>` targets and optional `<SidebarMenuSub>` children `[nav-main.tsx:NavMain]`.
- `NavSecondary({ items, ...props })` (named export, no `'use client'`): Renders compact `size="sm"` `<SidebarMenuButton>` links wrapped in localized `<Link>` inside `<SidebarGroup {...props}>` `[nav-secondary.tsx:NavSecondary]`.
- `NavUser({ user }: { user: { name: string; email: string; avatar: string } })` (`'use client'`, named export): Renders the user avatar/identity dropdown trigger and sign-out `<DropdownMenuItem>` `[nav-user.tsx:NavUser]`.
- `NavProjects({ projects })` (`'use client'`, named export): Unreferenced boilerplate group rendering native `<a href={item.url}>` links and unwired `"View Project"` / `"Share Project"` / `"Delete Project"` / `"More"` actions `[nav-projects.tsx:NavProjects]`.

## Invariants
- **Role-based navigation gating**: `AppSidebar` passes `candidateData.navMain` only when `user?.role === 'candidate'`, `recruiterData.navMain` only when `user?.role === 'recruiter'`, and `[]` for any other role or `null` user. `NavSecondary` selects `candidateData.navSecondary` for `'candidate'` and falls back to `recruiterData.navSecondary` otherwise `[app-sidebar.tsx:AppSidebar]`.
- **Static collapsible defaults (no pathname matching)**: Neither `AppSidebar` nor `NavMain` reads the active pathname; all top-level groups hardcode `isActive: true`, which `NavMain` forwards only as `<Collapsible defaultOpen={item.isActive}>` `[app-sidebar.tsx:AppSidebar]`, `[nav-main.tsx:NavMain]`.
- **Submenu & icon guards**: `NavMain` renders `<CollapsibleTrigger>` and `<SidebarMenuSub>` only when `item.items?.length` is truthy, and renders sub-item icons only when `subItem.icon` is truthy `[nav-main.tsx:NavMain]`.
- **Provider/context dependencies**: `NavUser` and `NavProjects` call `useSidebar()` (requiring `SidebarProvider`); `AppSidebar`, `NavMain`, and `NavUser` call `useTranslations(...)` (requiring `NextIntlClientProvider` with `'sidebar'`, `'navigation'`, and `'authSignOut'` namespaces) `[app-sidebar.tsx:AppSidebar]`, `[nav-main.tsx:NavMain]`, `[nav-user.tsx:NavUser]`, `[nav-projects.tsx:NavProjects]`.
- **Responsive & collapsible positioning**: `NavUser` positions its dropdown with `side={isMobile ? 'bottom' : 'right'}` (`align='end'`, `sideOffset={4}`); `NavProjects` hides in icon-collapsed mode (`group-data-[collapsible=icon]:hidden`) and adapts dropdown `side`/`align` to `isMobile` `[nav-user.tsx:NavUser]`, `[nav-projects.tsx:NavProjects]`.
- **Identity & avatar fallbacks**: `AppSidebar` defaults missing `user?.avatar` to `'/binary-code.png'` and missing `name`/`email` to `''`; `NavUser` computes `<AvatarFallback>` via `getInitials(user.name || '?')` (up to 2 uppercase space-delimited initials, `'?'` when blank) `[app-sidebar.tsx:AppSidebar]`, `[nav-user.tsx:NavUser]`, `[nav-user.tsx:getInitials]`.
- **Sign-out result guard**: `handleSignOut` throws `new Error(tAuth('toastError'))` when `!result.success` so `router.push('/')` and `router.refresh()` do not run on failure `[nav-user.tsx:handleSignOut]`.
- **Unique list key requirements**: `NavMain` keys by `item.title`/`subItem.title`, `NavSecondary` keys by `item.title`, and `NavProjects` keys by `item.name` `[nav-main.tsx:NavMain]`, `[nav-secondary.tsx:NavSecondary]`, `[nav-projects.tsx:NavProjects]`.

## Side Effects
- **Sign-out server action, toasts, and navigation**: Clicking sign-out in `NavUser` calls `signOutAction()` (`@/app/actions/auth`) inside `sonner` `toast.promise(...).unwrap()` (swallowing rejected errors after toast display), then executes i18n `router.push('/')` and `router.refresh()` on success `[nav-user.tsx:handleSignOut]`.
- **Declarative navigation**: Renders locale-aware `@/i18n/navigation` `<Link>` elements in `AppSidebar`, `NavMain`, and `NavSecondary`, and native `<a href>` elements in `NavProjects` `[app-sidebar.tsx:AppSidebar]`, `[nav-main.tsx:NavMain]`, `[nav-secondary.tsx:NavSecondary]`, `[nav-projects.tsx:NavProjects]`.
- **Delegated footer controls**: Mounts `<LanguageSwitcher />` and `<SidebarModeToggle />` in `<SidebarFooter>`, delegating locale and theme mutations to those components `[app-sidebar.tsx:AppSidebar]`.

## Verification
- Run: `pnpm lint && pnpm build`
