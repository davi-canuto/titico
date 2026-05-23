## Context

`src/app/(auth)/login/page.tsx` is currently ~25 lines with no visual design. The auth logic (session check → redirect, `signIn("google")` server action) is correct and must not change. This change is purely JSX/Tailwind — no new dependencies, no API changes.

Design reference: [titiltei.com](https://www.titiltei.com/) — dark gaming aesthetic, champion splash art, bold typography.
Design system: Shaco Theme tokens defined in `AGENTS.md` and `src/app/globals.css`.

## Goals / Non-Goals

**Goals:**
- Full visual redesign matching the Shaco Theme design system
- Split layout (desktop) with Shaco splash art on the left, login card on the right
- Responsive: single-column stack on mobile
- Remain a pure Server Component (no `'use client'`)

**Non-Goals:**
- Any auth logic changes
- Animations or transitions beyond Tailwind `transition-colors`
- Dark/light mode toggle
- Additional sign-in providers

## Decisions

### 1. Split layout — image left, card right
The left panel uses `position: relative` with an `<img>` as `absolute inset-0 object-cover` and two gradient overlays (right-fade + bottom-fade) to blend the splash into the dark background. The right panel is a flex column centered vertically.

*Alternative considered*: full-bleed background image behind a centered card — rejected because it obscures too much of the splash art on wide screens.

### 2. Server Component — Server Action for sign-in
The `googleSignIn` function keeps `"use server"` inline. No state needed for a single-button form. Adding `'use client'` would be unnecessary complexity.

### 3. Google icon — inline SVG, no library
AGENTS.md explicitly forbids icon libraries. The official Google "G" logo SVG (4 paths, standard colors) is inlined directly in the button.

### 4. Benefit list — hardcoded strings, no data file
Three bullet points describing guide benefits. Small, static, and specific to this page — not worth abstracting into a config file.

### 5. Shaco splash from ddragon CDN
URL: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_0.jpg`
Already referenced in AGENTS.md as the canonical source. No self-hosting needed.

## Risks / Trade-offs

- **[CDN availability]** → ddragon is Riot's CDN — if it's down, the left panel shows a broken image (dark background fallback is acceptable; login still works)
- **[Splash art on slow connections]** → large JPEG (~300 KB) may flash in. Mitigation: `loading="eager"` is fine since this is a critical page; could add a `bg-[#111]` fallback on the img container
