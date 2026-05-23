## Why

The admin can create trails and content, but there is no UI to associate them — adding content to a trail requires raw Prisma seeds. This change adds a dedicated management page so the titiltei can build and curate trail playlists entirely from the browser.

## What Changes

- **New page `/dashboard/admin/trilhas/[id]/itens`**: shows the trail's current items as an ordered list, with controls to remove each item and reorder via up/down buttons
- **Add content to trail**: search/select from all published content not yet in the trail and add it to the end
- **Reorder items**: up/down arrow buttons shift an item's `order` by swapping it with its neighbour
- **Remove item**: delete a TrailItem row; remaining orders are compacted
- **Link from trail list**: each trail row in the admin panel gains a "Gerenciar itens" link

## Capabilities

### New Capabilities

- `admin-trail-item-management`: UI to add, reorder, and remove content items within a trail

### Modified Capabilities

*(none — trail list gains a link, implementation detail only)*

## Impact

- **New files**: `src/app/dashboard/admin/trilhas/[id]/itens/page.tsx`, trail item Server Actions added to `src/lib/admin-actions.ts`
- **Modified**: `src/app/dashboard/admin/page.tsx` — add "Gerenciar itens" link per trail row
- **APIs / Prisma**: uses `prisma.trailItem` directly (create, delete, update order); existing `POST /api/admin/trails/[id]/items` exists but Server Actions call Prisma directly for simplicity
- **No new dependencies**
