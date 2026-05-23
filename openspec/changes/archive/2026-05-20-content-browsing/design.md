## Context

Backend is complete: `Content`, `Trail`, `UserProgress`, and all API routes exist. The `ContentCard` component exists but is not clickable. The dashboard home renders trail rows but cards go nowhere. `POST /api/contents/[slug]/progress` is live for upsert.

## Goals / Non-Goals

**Goals:**
- Explorar page: filterable grid of all PUBLISHED+active content, server-rendered
- Content player page: per-type rendering (video embed, matchup stats, build table, article body, PDF link)
- Progress recording for video content (client-side, fires after user starts playing)
- ContentCard becomes a link to the player

**Non-Goals:**
- Comments, ratings, or social features
- Real-time progress sync (no WebSocket — fire-and-forget POST on play)
- Paid-gate enforcement on the player UI (the API already returns 403; UI shows a locked state)
- Search functionality on Explorar (filter by type only, no text search)
- Autoplay / playlist navigation between trail items

## Decisions

### 1. Explorar — Server Component with URL search param for type filter
Filter state lives in the URL (`?tipo=VIDEO`). The page reads `searchParams.tipo`, queries Prisma with `where: { type }` if set, and renders the filtered grid. No client state, no fetch round-trip, bookmarkable URLs.

Considered: client-side filter with `useState` — rejected because it requires `'use client'` on the whole page and loses URL sharing.

### 2. Content player — Server Component shell + `'use client'` VideoPlayer
`/dashboard/conteudo/[slug]/page.tsx` is a Server Component that fetches content from Prisma. For VIDEO type, it renders a `<VideoPlayer youtubeId={...} slug={...} />` client component that owns the iframe and fires progress POSTs. All other types render entirely server-side.

### 3. Progress reporting — fire on iframe `onPlay` via `postMessage`
YouTube iframes don't expose direct events without the IFrame API. `VideoPlayer` embeds `?enablejsapi=1` and listens to `window.message` events from YouTube. On first play event, it POSTs `{ watchedSeconds: 0 }` to mark the content as started. On unmount or `beforeunload`, it POSTs with the elapsed seconds.

Considered: Polling every N seconds — more accurate but burns requests. Fire-and-forget on play/unload is sufficient for the "Continue assistindo" feature.

### 4. Access gate on player — show locked state, don't 404
If `locked === true` (user has no purchase and content is PAID), the player page renders a locked overlay with a "Comprar acesso" CTA instead of the content. The content metadata (title, thumbnail, type) is still shown so the user knows what they'd get.

### 5. ContentCard as Link
Wrap the entire card `<div>` in `<Link href="/dashboard/conteudo/[slug]">`. Since `ContentCard` is a Server Component, `<Link>` from `next/link` works natively.

## Risks / Trade-offs

- **[YouTube IFrame API reliability]** → Some ad blockers or browser settings block `postMessage`. Progress simply won't save — acceptable, the user can still watch.
- **[No skeleton/loading state on player]** → Next.js App Router streams the Server Component. For slow DB, the page will delay. Add `loading.tsx` later if needed.
- **[Explorar grid ordering]** → Ordered by `publishedAt desc`. With no content yet this is invisible, but could surface unexpected order once catalog grows.
