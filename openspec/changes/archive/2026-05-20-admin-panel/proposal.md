## Why

The content platform backend is live with admin API endpoints, but the titiltei has no UI to create or manage content — every piece of content requires raw API calls. This change delivers a web-based admin panel so content can be created and published directly from the browser.

## What Changes

- **New section `/dashboard/admin`**: admin-only area with tabs for Conteúdos and Trilhas; redirects non-ADMIN users to `/dashboard`
- **Content list**: table of all content (any status) with title, type, status badge, publishedAt, and row actions (publish/unpublish, delete)
- **Content creation form**: multi-step form — first select type, then fill type-specific fields. Calls `POST /api/admin/contents`. Supports VIDEO, MATCHUP, BUILD, ARTICLE, PDF.
- **Trail list**: table of active/inactive trails with title, slug, item count, and row actions (toggle active, delete)
- **Trail creation form**: simple form for title, slug, description. Calls `POST /api/admin/trails`.
- **Publish/unpublish action**: calls `PATCH /api/admin/contents/[id]` with `{ status: "PUBLISHED" | "DRAFT" }` and `{ publishedAt }` via Server Action
- **Delete action**: calls `DELETE /api/admin/contents/[id]` or `DELETE /api/admin/trails/[id]` via Server Action with confirmation

## Capabilities

### New Capabilities

- `admin-content-management`: CRUD UI for Content records — list, create (per type), publish/unpublish, delete
- `admin-trail-management`: CRUD UI for Trail records — list, create, toggle active, delete

### Modified Capabilities

*(none)*

## Impact

- **New files**: `src/app/dashboard/admin/page.tsx`, `src/app/dashboard/admin/conteudos/novo/page.tsx`, `src/app/dashboard/admin/trilhas/novo/page.tsx`, `src/lib/admin-actions.ts` (Server Actions)
- **APIs used**: existing `/api/admin/contents`, `/api/admin/contents/[id]`, `/api/admin/trails`, `/api/admin/trails/[id]`
- **No new dependencies** — native HTML forms, Server Actions, `revalidatePath`
