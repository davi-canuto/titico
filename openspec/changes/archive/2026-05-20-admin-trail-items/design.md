## Context

`TrailItem` has `@@unique([trailId, order])` — no two items in the same trail can share an order value. Reordering must swap orders atomically or use a temporary value to avoid constraint violations. The schema also has `@@unique([trailId, contentId])`, so the same content cannot be added twice.

Current trail list in `/dashboard/admin` has title, slug, status, item count, and delete/toggle actions. It needs a "Gerenciar itens" link per row.

## Goals / Non-Goals

**Goals:**
- List trail items in order with title, type badge, and position number
- Add content: dropdown of all PUBLISHED content not already in the trail
- Remove item: delete TrailItem, then repack remaining orders (1, 2, 3…)
- Reorder: up/down buttons swap adjacent items' orders

**Non-Goals:**
- Drag-and-drop reorder (up/down buttons are sufficient for MVP)
- Adding DRAFT content to a trail
- Bulk reorder

## Decisions

### 1. Order repack on remove
When a TrailItem is removed, repack all remaining items' orders to be contiguous (1, 2, 3…) using a Prisma transaction. This prevents gaps that would complicate the up/down logic.

### 2. Swap orders atomically for reorder
To move item at position N up (to N-1): swap orders with the item at N-1. Use a Prisma `$transaction` with a temporary order value (e.g., 9999) to avoid the unique constraint:
1. Set item A order → 9999 (temp)
2. Set item B order → A's old order
3. Set item A order → B's old order

### 3. Add content — select element, not search
A `<select>` of all published content not yet in the trail is sufficient for MVP. Each option shows `[TYPE] Title`. Submitted as a Server Action with the trailId and selected contentId; order = current max order + 1.

### 4. All mutations via Server Actions + revalidatePath
Same pattern as admin-panel. No client state needed — every action reloads the page with fresh data.

## Risks / Trade-offs

- **[Select grows large with many contents]** → Acceptable at current catalog size. A search/autocomplete can replace it later.
- **[No optimistic UI]** → Full page reload on every action. Acceptable for admin use.
