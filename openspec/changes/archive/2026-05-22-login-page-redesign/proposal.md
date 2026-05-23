## Why

The current login page is a bare skeleton with no visual design — it fails to represent the brand or create confidence in first-time visitors. Since `/login` is the entry point for all users, it needs to match the Shaco/titiltei aesthetic before any marketing or user acquisition begins.

## What Changes

- Replace the skeleton `src/app/(auth)/login/page.tsx` with a fully designed page
- Split layout (desktop): left panel with Shaco splash art + gradient overlay + tagline; right panel with login card
- Mobile: single-column, splash replaced by text header
- Google sign-in button with inline SVG icon, `outline` style (border-white/25)
- Red `#e3001b` accent on brand label and benefit bullet points
- Remains a Server Component with Server Action — no `'use client'`

## Capabilities

### New Capabilities

*(none)*

### Modified Capabilities

- `login-page`: the **Branding** requirement gains visual specifics — split layout, Shaco splash art from ddragon CDN, Shaco Theme design tokens, benefit bullet list

## Impact

- **Modified file**: `src/app/(auth)/login/page.tsx` — full rewrite of JSX, no logic changes
- **No new dependencies** — Tailwind, inline SVGs, ddragon CDN (already used by the app)
- **No API or auth changes** — `signIn("google")` and session redirect logic unchanged
