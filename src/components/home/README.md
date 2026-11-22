# Home Landing Components (`src/components/home`)

## Overview
Implements the public marketing landing page through a single `'use client'` orchestrator (`HomePage` in `home-page.tsx`) composing five parameterless presentational sections in top-to-bottom order: `HeroSection`, `HowItWorksSection`, `BothSidesSection`, `VisionSection`, and `CtaSection`. `HomePage` owns the root `<main>` DOM ref and coordinates entrance, continuous floating, and scroll-triggered reveal animations via GSAP and `ScrollTrigger` using CSS class hooks across the child sections. Every section reads localized copy from `next-intl`'s `'home'` namespace and styles itself with After42 CSS custom properties (`--a42-*` and `--font-*`), while `HeroSection` and `CtaSection` link to `/sign-up` and `/sign-in`.

## Interface
- `HomePage()` (default export, `'use client'`, no props): Renders `<main ref={rootRef}>` composing `<HeroSection />`, `<HowItWorksSection />`, `<BothSidesSection />`, `<VisionSection />`, and `<CtaSection />`, and registers/reverts GSAP animations `[home-page.tsx:HomePage]`.
- `HeroSection()` (named export, no props): Renders hero copy, locale-aware CTA links (`'/sign-up'`, `'/sign-in'`), and a decorative blind-review score preview card (`91`) `[hero-section.tsx:HeroSection]`.
- `HowItWorksSection()` (named export, no props): Renders section header and a 3-card step grid (`01`, `02`, `03`) `[how-it-works-section.tsx:HowItWorksSection]`.
- `BothSidesSection()` (named export, no props): Renders section header and two audience `<article>` cards (companies and developers) `[both-sides-section.tsx:BothSidesSection]`.
- `VisionSection()` (named export, no props): Renders the left-bordered vision quote card `[vision-section.tsx:VisionSection]`.
- `CtaSection()` (named export, no props): Renders the closing dark-themed CTA band (`bg-[#1C1917]`) with locale-aware links to `'/sign-up'` and `'/sign-in'` `[cta-section.tsx:CtaSection]`.

## Invariants
- `HomePage`'s `useLayoutEffect` returns early if `!rootRef.current` or if `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is `true`, skipping all GSAP tween and `ScrollTrigger` creation when reduced motion is preferred; all animations run inside `gsap.context(..., el)` and revert on unmount via `ctx.revert()` `[home-page.tsx:HomePage]`.
- CSS selector contract between `HomePage` and child sections (scoped to `rootRef.current`):
  - `.home-hero-anim`, `.home-hero-preview`, and `.home-hero-preview-inner` must remain present on `HeroSection`'s animated elements `[home-page.tsx:HomePage]`, `[hero-section.tsx:HeroSection]`.
  - `.home-reveal-block` must remain on revealed blocks in `HowItWorksSection`, `BothSidesSection`, and `VisionSection` `[home-page.tsx:HomePage]`, `[how-it-works-section.tsx:HowItWorksSection]`, `[both-sides-section.tsx:BothSidesSection]`, `[vision-section.tsx:VisionSection]`.
  - `.home-reveal-stagger` and `.home-reveal-item` must remain on `HowItWorksSection`'s grid and step `<article>` cards `[home-page.tsx:HomePage]`, `[how-it-works-section.tsx:HowItWorksSection]`.
  - `.home-cta-section` (trigger) and `.home-cta-inner` (target) must remain on `CtaSection` `[home-page.tsx:HomePage]`, `[cta-section.tsx:CtaSection]`.
- `HowItWorksSection` indexes `stepIcons`, `stepTitleKeys`, and `stepBodyKeys` via `stepNums.map`, requiring all four 3-element `as const` tuples to remain length-aligned `[how-it-works-section.tsx:HowItWorksSection]`.
- All five sections call `useTranslations('home')` and require an ancestor `next-intl` client provider with the 29 unique referenced `'home'` keys present (31 total `t(...)` references), plus `--a42-*` and `--font-*` CSS custom properties defined in scope `[hero-section.tsx:HeroSection]`, `[how-it-works-section.tsx:HowItWorksSection]`, `[both-sides-section.tsx:BothSidesSection]`, `[vision-section.tsx:VisionSection]`, `[cta-section.tsx:CtaSection]`.
- Every section pairs `aria-labelledby` with a matching heading/text `id` (`hero-heading`, `how-heading`, `both-heading`, `vision-heading`, `cta-heading`), and decorative elements/icons and the hero preview card are marked `aria-hidden` `[hero-section.tsx:HeroSection]`, `[how-it-works-section.tsx:HowItWorksSection]`, `[both-sides-section.tsx:BothSidesSection]`, `[vision-section.tsx:VisionSection]`, `[cta-section.tsx:CtaSection]`.

## Side Effects
- Registers GSAP's `ScrollTrigger` plugin globally at module load time (`gsap.registerPlugin(ScrollTrigger)`) `[home-page.tsx:module]`.
- Reads `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and mutates inline DOM styles/transforms and scroll listeners via GSAP `gsap.from` / `gsap.to` / `ScrollTrigger` inside `useLayoutEffect`, reverted via `ctx.revert()` on unmount `[home-page.tsx:HomePage]`.
- Reads client-side translations via `useTranslations('home')` across all five section components `[hero-section.tsx:HeroSection]`, `[how-it-works-section.tsx:HowItWorksSection]`, `[both-sides-section.tsx:BothSidesSection]`, `[vision-section.tsx:VisionSection]`, `[cta-section.tsx:CtaSection]`.
- Performs declarative client-side route navigation via `@/i18n/navigation` `<Link>` to `'/sign-up'` and `'/sign-in'` `[hero-section.tsx:HeroSection]`, `[cta-section.tsx:CtaSection]`.

## Verification
- Run: `pnpm lint && pnpm build`
