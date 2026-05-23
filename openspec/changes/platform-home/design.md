## Context

The backend (`/api/trails`, `/api/user/me`, `/api/contents/[slug]`) is live. The design reference is Reservatório de Dopamina (screenshots saved in `./rd-pictures/`): dark background, horizontal scroll rows per category, large hero banner, card-based content grid. Design tokens from Shaco Theme (`AGENTS.md`): `#0d0d0d` bg, `#161616` cards, `#e3001b` accent, white typography.

Current state: `src/app/dashboard/page.tsx` is a skeleton, no layout wrapper exists for the dashboard group.

## Goals / Non-Goals

**Goals:**
- Persistent navbar across all `/dashboard/*` pages via `layout.tsx`
- Home page with hero, "Continue assistindo", and one row per active trail
- Fully server-rendered — zero `'use client'` except the search input if interactive
- Shaco Theme design system throughout

**Non-Goals:**
- Explorar page (`/dashboard/explorar`) — separate change
- Comunidade page — separate change
- Real search functionality — search bar renders as UI only (no logic)
- Mobile nav drawer — desktop-first for now, responsive later

## Decisions

### 1. Dashboard layout group with `layout.tsx`
`src/app/dashboard/layout.tsx` wraps all dashboard routes with the navbar. It calls `auth()` server-side to get the user (name, image, role) for the avatar and ADMIN badge. No prop drilling needed — layout reads session directly.

### 2. Data fetching in page — direct Prisma, not fetch
Since the page is a Server Component running in the same process, calling `prisma` directly is simpler and faster than `fetch("/api/trails")` (which would require forwarding cookies and the full HTTP round-trip). The API routes exist for client-side consumption; server pages use Prisma directly.

### 3. Component structure
```
src/
  app/dashboard/
    layout.tsx          ← navbar shell
    page.tsx            ← home page (server)
  components/platform/
    Navbar.tsx          ← 'use client' for mobile menu state (future)
    ContentCard.tsx     ← pure display, no state
    TrailRow.tsx        ← 'use client' for scroll arrows
```

`ContentCard` and `TrailRow` are shared — reused by Explorar and trail detail pages later.

### 4. Hero banner — static, not a CMS banner
For phase 1, the hero is hardcoded with the Shaco Pandemônio de Prestígio splash art and a fixed CTA ("Ver todos os conteúdos"). A dynamic banner system is out of scope.

### 5. "Continue assistindo" — UserProgress join in Prisma
Query `UserProgress` for the logged-in user, join `Content`, filter `PUBLISHED + active`, order by `updatedAt desc`, limit 10. Only shown if user has at least 1 progress record.

### 6. Trail rows — one per active trail, ordered by `createdAt`
Fetch all active trails with their first 12 PUBLISHED+active items ordered by `TrailItem.order`. Render one `TrailRow` per trail. Empty trails are hidden.

### 7. Horizontal scroll — CSS overflow-x, JS arrows optional
`TrailRow` uses `overflow-x-auto` with `scroll-smooth` and `scrollbar-hide` (Tailwind plugin or manual). Left/right arrow buttons shift scroll by a fixed pixel amount via `scrollLeft`. Requires `'use client'` only for the arrow click handler.

### 8. FREE/PAID badge on ContentCard
Cards show a small pill badge: `GRÁTIS` in green (`#4ade80`) for FREE content, lock icon for PAID (no text — cleaner). The card itself is always visible in listings; the lock indicates access requirement.

## Risks / Trade-offs

- **[Prisma in layout]** → Layout calls `auth()` but NOT Prisma — only page calls Prisma. Layout only needs session data (name, image, role) which comes from the JWT. No DB call in layout.
- **[No loading states]** → Server Components stream automatically. For large trail lists, Next.js Suspense boundaries can be added later.
- **[Trail row scroll on mobile]** → Touch scroll works natively with `overflow-x-auto`. Arrow buttons hidden on mobile via `hidden md:flex`.
