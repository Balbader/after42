# Design System — after42

## Product Context
- **What this is:** Blind technical hiring platform — recruiter creates challenge from job post, candidate submits code, recruiter receives AI-scored results with interview guide. Identity is never shown to the company; candidates are "Candidate #1 (91/100)" until the live interview.
- **Who it's for:** Two personas. Company side: non-technical HR recruiter who needs to conduct a credible technical screen without engineering help. Candidate side: developer (initially 42 school students) completing a coding challenge to pre-validate before applying.
- **Space/industry:** Technical hiring / developer assessment. Peers: HackerRank, Codility, Ashby. Structural differentiator: blind review + AI interview guide with expected answers.
- **Project type:** APP UI — two distinct workspaces. No marketing shell; the product IS the tool.

## Aesthetic Direction
- **Direction:** Editorial/Utilitarian
- **Decoration level:** Minimal — typography and hierarchy do all the work
- **Mood:** Warm, precise, human. This platform makes fair hiring feel achievable. The warmth signals that identity matters (even when anonymised); the precision signals that the scores are trustworthy. Not cold enterprise blue, not startup purple — something that feels like a trusted editorial publication applied to a workspace tool.
- **EUREKA:** Every hiring platform uses cold blues or enterprise greys because they're signalling professionalism-as-distance. after42's value IS human fairness — warm stone neutrals and orange accent embody that idea better than any competitor's palette, and create an immediately recognisable visual identity.

## Typography

- **Display/Hero:** `Fraunces` (variable optical-size serif, weights 300–600) — used for H1s, candidate IDs ("Candidate #3"), score headlines, recommendation headers. Italic variant for subheads and pull-quotes. Fraunces is editorial, distinctive, and reads beautifully at both 64px and 22px. Nobody in hiring tech uses it.
  - Loading: `https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&display=swap`
- **Body/UI:** `DM Sans` (variable optical-size, weights 300–600) — all body copy, table rows, labels, form inputs, nav. Readable at 13px in dense data tables; not generic at display sizes.
  - Loading: `https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap`
- **Data/Tables:** `DM Sans` with `font-variant-numeric: tabular-nums` — scores, timestamps, counts. Same face as body to reduce visual noise in data-dense tables.
- **Code:** `JetBrains Mono` (weights 400–500) — challenge spec display (candidate side), code snippets in evidence panel, git refs and repo paths.
  - Loading: `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap`
- **Scale:**

| Role | Size | Weight | Letter-spacing |
|------|------|--------|---------------|
| H1 / Display | 56–64px | 400 | −0.03em |
| H2 / Section title | 28px | 500 | −0.02em |
| H3 / Workspace title | 22px | 500 | −0.02em |
| Body | 16px | 400 | 0 |
| UI / Labels | 13–14px | 400–500 | 0 |
| Small / Meta | 11–12px | 400–500 | 0.01em |
| Eyebrow / Overline | 11px | 600 | 0.06–0.08em (uppercase) |
| Code | 12–13px | 400 | 0 |

## Color

All colors defined as CSS custom properties on `:root` and `[data-theme="dark"]`.

- **Approach:** Restrained — one accent + warm neutrals. Color is rare and meaningful. Score colours are the only semantic palette.

### Light mode

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#FAFAF8` | Page background (warm white, not pure) |
| `--surface` | `#FFFFFF` | Cards, panels, workspace zones |
| `--surface-2` | `#F5F4F1` | Input backgrounds, Q&A items, row hover |
| `--border` | `#E7E5E4` | Default borders and dividers |
| `--border-strong` | `#D6D3D1` | Input borders, active dividers |
| `--text` | `#1C1917` | Primary text (stone-950) |
| `--text-muted` | `#78716C` | Secondary text (stone-500) |
| `--text-faint` | `#A8A29E` | Metadata, labels, empty states (stone-400) |
| `--accent` | `#C2410C` | Brand accent — orange-700 (CTAs, active states, highlights) |
| `--accent-hover` | `#9A3412` | Accent hover — orange-800 |
| `--accent-light` | `#FFF7ED` | Accent tint — for recommendation block backgrounds |

### Score / semantic colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--score-high` | `#16A34A` | Score ≥80, "Recommend" pill, strengths |
| `--score-high-bg` | `#F0FDF4` | Score high backgrounds |
| `--score-mid` | `#D97706` | Score 60–79, "Consider" pill |
| `--score-mid-bg` | `#FFFBEB` | Score mid backgrounds |
| `--score-low` | `#DC2626` | Score <60, "Pass" pill |
| `--score-low-bg` | `#FEF2F2` | Score low backgrounds |

### Dark mode (warm inversion)
Background inverts to `#1C1917` (stone-950); text inverts to `#FAFAF8`. Accent becomes `#EA580C` (orange-600 — slightly lighter for dark surface contrast). Surfaces shift to `#292524` / `#1C1917`. Score colours lighten to `#4ADE80` / `#FCD34D` / `#F87171` for visibility on dark surfaces.

## Spacing
- **Base unit:** 4px
- **Density:** Compact — this is a workspace tool; users spend hours in it
- **Scale:**

| Token | Value | Use |
|-------|-------|-----|
| `2xs` | 2px | Micro gaps (dot spacing, inline icons) |
| `xs` | 4px | Tight intra-component spacing |
| `sm` | 8px | Component internal padding, gaps between related items |
| `md` | 12–16px | Standard padding in panels, table rows |
| `lg` | 24px | Between sections within a zone |
| `xl` | 32px | Between major sections |
| `2xl` | 48px | Page-level vertical rhythm |
| `3xl` | 64px | Hero / page top padding |

## Layout

- **Approach:** Grid-disciplined — consistent column structure in the app workspaces
- **Recruiter review workspace:** Three-zone layout — `280px | 1fr | 240px`. Left rail: submissions sorted score DESC. Center: interview guide (primary canvas). Right: score/recommendation/evidence.
- **Candidate submit workspace:** Two-zone layout — `1fr | 320px`. Left: challenge description + code spec. Right: fork URL + commit log + submit CTA.
- **Max content width:** `1200px` with `24px` page padding
- **Border radius:**

| Token | Value | Use |
|-------|-------|-----|
| `sm` | 4px | Small chips, status dots |
| `md` | 6px | Input fields, buttons, cards |
| `lg` | 8px | Workspace panels, modals |
| `full` | 9999px | Pills, score badges, avatar bubbles |

## Motion

- **Approach:** Minimal-functional — only transitions that aid comprehension of state change
- **Easing:** Enter: `ease-out` / Exit: `ease-in` / Move: `ease-in-out`
- **Duration:**

| Name | Duration | Use |
|------|----------|-----|
| `micro` | 50–100ms | Hover states, focus rings |
| `short` | 150ms | Button hover, border transitions (standard) |
| `medium` | 250ms | Panel open/close, dropdown |
| `long` | 400ms | Score skeleton → content reveal, scoring state transition |

- **Scoring async state:** Skeleton shimmer → score reveal uses 400ms ease-out fade. Score number counts up from 0 using `counter()` animation (50ms per unit, max 500ms). This makes the 91 feel earned, not arbitrary.
- **Push detection:** Status banner transition — 150ms ease-out slide-down when first commit detected.
- **Never:** parallax scroll, entrance animations on workspace content, loading spinners that block interaction

## Key Component Specs

### Score badge
```
font-family: Fraunces
font-size: 15px / font-weight: 500 / letter-spacing: −0.02em
padding: 2px 10px / border-radius: full
Colors: score-high / score-mid / score-low backgrounds
```

### Recommendation pill
```
font-size: 12px / font-weight: 500
padding: 4px 12px / border-radius: full
Border: 1px solid matching score color
3 states: recommend (green) / consider (amber) / pass (red)
```

### Candidate row (left rail)
```
padding: 12px 16px
active state: border-left: 2px solid --accent + accent-light background
hover: surface-2 background / 100ms transition
```

### Q&A accordion
```
Background: surface-2 / Border: border / border-radius: md
Question: DM Sans 13px / font-weight 500
Answer: DM Sans 12px / color: text-muted
Focus area chip: JetBrains Mono 10px / surface bg
```

### Submit CTA (candidate side)
```
Disabled until first commit detected via push polling
When enabled: btn-primary full-width
Below: 11px / text-faint warning about archive + lock
```

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-24 | Aesthetic: Editorial/Utilitarian | Warm editorial signals human fairness better than cold enterprise blues; utilitarian because it's a workspace tool, not a marketing site |
| 2026-03-24 | Display font: Fraunces | Variable serif, editorial, distinctive — nobody in hiring tech uses it; optical-size axis means it works at both 64px hero and 22px panel title |
| 2026-03-24 | Body font: DM Sans | Readable at 13px in dense data tables; not generic like Inter/Roboto; geometric-humanist hybrid |
| 2026-03-24 | Code font: JetBrains Mono | Developer default of choice; ligatures off for challenge spec display |
| 2026-03-24 | Accent: #C2410C orange | Every hiring competitor uses blue or grey; orange-700 is warm, confident, differentiating; evokes editorial red without the aggression |
| 2026-03-24 | Background: #FAFAF8 warm white | Off-white with warm undertone; pure white reads clinical; warm stone reinforces the brand direction |
| 2026-03-24 | Score font: Fraunces | Score numbers are the most important data in the app; serif makes "91" feel substantial, not just a number |
| 2026-03-24 | Three-zone recruiter workspace | Established by /plan-design-review: left submissions list, center interview guide (primary), right evidence. Rejected stacked cards. |
| 2026-03-24 | Status-first candidate workspace | Push detection via polling; submit CTA disabled until first commit; status banner updates in real-time |
| 2026-03-24 | Scoring async state: skeleton + polling | Score display shows skeleton while status = submitted; polls until status = scored; score number counts up on reveal |
| 2026-03-24 | Q+A guide: accordions with hidden answers | HR sees question, opens to reveal expected answer; prevents anchoring during interview while keeping guide accessible |
| 2026-03-24 | Risk accepted: Fraunces serif | Unusual for hiring tech; adds editorial character; coherent with warm stone palette |
| 2026-03-24 | Risk accepted: orange accent | No competitor uses warm orange; immediate visual differentiation |
| 2026-03-24 | Risk accepted: warm stone neutrals | vs cold zinc/slate common in SaaS; reinforces the human fairness brand idea |

---

*Generated by `/design-consultation` on 2026-03-24. Update this file via `/design-consultation` (to revise the system) or add decisions to the log manually.*
