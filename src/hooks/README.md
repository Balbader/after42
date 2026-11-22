# src/hooks

## Overview
Client-side React custom hooks shared by UI components. Currently provides viewport breakpoint detection (`use-mobile.ts`) to determine whether the browser viewport is narrower than the `768px` mobile threshold and reactively update when the viewport crosses that boundary.

## Interface
- `useIsMobile(): boolean` — React hook returning `true` when `window.innerWidth < 768` and `false` otherwise `[use-mobile.ts:useIsMobile]`

## Invariants
- **Fixed mobile breakpoint**: `MOBILE_BREAKPOINT` is hardcoded to `768`; viewport checks evaluate `window.innerWidth < MOBILE_BREAKPOINT` paired with media query `(max-width: 767px)` (`MOBILE_BREAKPOINT - 1`) `[use-mobile.ts:MOBILE_BREAKPOINT]`, `[use-mobile.ts:useIsMobile]`.
- **SSR-safe initial value and boolean coercion**: State initializes as `React.useState<boolean | undefined>(undefined)` and returns `!!isMobile`, guaranteeing a `boolean` (`false` before mount/effect execution) `[use-mobile.ts:useIsMobile]`.
- **Client-only DOM access**: `window.matchMedia` and `window.innerWidth` are accessed exclusively inside `React.useEffect` with an empty dependency array (`[]`) `[use-mobile.ts:useIsMobile]`.

## Side Effects
- **Media query listener subscription and cleanup**: Calls `window.matchMedia('(max-width: 767px)')`, registers a `'change'` listener via `mql.addEventListener('change', onChange)` on mount, and removes it via `mql.removeEventListener('change', onChange)` on unmount `[use-mobile.ts:useIsMobile]`.
- **Viewport reads and state updates**: Reads `window.innerWidth` immediately on mount and on every media query `'change'` event to update React state via `setIsMobile(...)` `[use-mobile.ts:useIsMobile]`.

## Verification
- Run: `pnpm lint && pnpm build`
