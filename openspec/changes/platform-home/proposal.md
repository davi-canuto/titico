## Why

After login, the user lands on a skeleton dashboard with only their avatar and a logout button. There is no platform shell, no navigation, and no content. This change builds the first real member-facing experience: a persistent navbar and a Netflix-style home page that surfaces trails and content from the backend built in `content-platform-backend`.

## What Changes

- **Platform shell**: new layout file `src/app/dashboard/layout.tsx` with top navbar (logo, nav links, search placeholder, user avatar + ADMIN badge). Applied to all `/dashboard/*` routes.
- **Home page rewrite**: `src/app/dashboard/page.tsx` becomes the platform home — hero banner (Shaco Pandemônio de Prestígio splash), "Continue assistindo" horizontal scroll section (contents with UserProgress), trail sections (one horizontal scroll row per active trail).
- **Content card component**: reusable `ContentCard` for thumbnail, title, type badge, FREE/PAID indicator, progress ring.
- **Trail row component**: `TrailRow` with section header + horizontal scroll + arrow nav.

## Capabilities

### New Capabilities

*(none — UI layer on top of existing backend)*

### Modified Capabilities

- `dashboard`: home now renders trail sections and continue-watching instead of just the session skeleton

## Impact

- **New files**: `src/app/dashboard/layout.tsx`, `src/components/platform/Navbar.tsx`, `src/components/platform/ContentCard.tsx`, `src/components/platform/TrailRow.tsx`
- **Modified**: `src/app/dashboard/page.tsx` — full rewrite
- **Data**: `GET /api/trails`, `GET /api/user/me` called server-side via `fetch` with session cookie forwarding
- **No new dependencies** — Tailwind, Next.js Image, ddragon CDN already in use
