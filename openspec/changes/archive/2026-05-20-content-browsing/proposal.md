## Why

The platform backend is live with content, trails, and user progress, but members have no way to browse or watch content — the dashboard home only shows trail rows, and clicking a card goes nowhere. This change delivers the two missing views that make the platform usable: a browse page and a content player.

## What Changes

- **New page `/dashboard/explorar`**: grid of all published content, filterable by type (VIDEO, MATCHUP, BUILD, ARTICLE, PDF), using the existing `Content` + `Trail` data via Prisma directly.
- **New page `/dashboard/conteudo/[slug]`**: content detail/player page — YouTube embed for VIDEO, structured display for MATCHUP/BUILD/ARTICLE/PDF, with progress tracking via `UserProgress`.
- **Progress save**: player page calls `POST /api/contents/[slug]/progress` when a video is played (client-side, via `'use client'` component wrapping the iframe).
- **ContentCard links**: each card in `TrailRow` and the Explorar grid becomes a `<Link>` pointing to `/dashboard/conteudo/[slug]`.

## Capabilities

### New Capabilities

- `explorar`: Browse page listing all published content with type filters and a responsive card grid.
- `content-player`: Content detail page rendering the appropriate view per `ContentType` and recording watch progress.

### Modified Capabilities

- `content`: `ContentCard` gains a wrapping `<Link href="/dashboard/conteudo/[slug]">` — no spec-level requirement change, implementation detail only.

## Impact

- **New files**: `src/app/dashboard/explorar/page.tsx`, `src/app/dashboard/conteudo/[slug]/page.tsx`, `src/components/platform/VideoPlayer.tsx` (`'use client'`)
- **Modified**: `src/components/platform/ContentCard.tsx` — wrap card in `<Link>`
- **APIs used**: existing `POST /api/contents/[slug]/progress` for progress upsert
- **No new dependencies** — YouTube embed via `<iframe>`, no third-party player library
