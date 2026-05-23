## Context

Admin API endpoints are fully implemented under `/api/admin/*` with `requireAdmin()` guard. The `auth.ts` JWT callback now persists `role` in the session. The dashboard layout already wraps all `/dashboard/*` routes. No UI exists for admin operations — content must be created via raw HTTP calls.

## Goals / Non-Goals

**Goals:**
- `/dashboard/admin` overview with counts and tab navigation
- Content list with status badges and inline publish/unpublish/delete actions
- Type-aware content creation form (`/dashboard/admin/conteudos/novo?tipo=VIDEO`)
- Trail list with toggle active and delete
- Trail creation form (`/dashboard/admin/trilhas/novo`)
- All mutations via Server Actions (no client fetch) — `revalidatePath` refreshes list after mutation

**Non-Goals:**
- Content edit form (only create + delete for now; edit is a separate change)
- Trail item management UI (add/remove/reorder content in a trail)
- Image/file upload (thumbnail and file URL are plain text inputs pointing to external URLs)
- Rich text editor for ARTICLE body (plain `<textarea>` for now)
- Bulk operations

## Decisions

### 1. Admin guard in page, not middleware
Each admin page calls `auth()` and checks `session.user.role === ADMIN`, redirecting non-admins to `/dashboard`. This is consistent with the existing layout pattern and avoids needing a separate middleware layer for now.

### 2. Server Actions in `src/lib/admin-actions.ts`
All mutations (publish, unpublish, delete) are Server Actions co-located in one file and imported by the page components. This keeps the page files focused on rendering and the action logic testable in isolation.

### 3. Type-specific form via `?tipo=` query param
Rather than one giant form with all fields, the new-content page reads `searchParams.tipo`. If no type is selected, it shows a type picker. Once selected, only the fields relevant to that type are rendered. The `tipo` is passed as a hidden input so the Server Action receives it.

### 4. Form submission via native `<form action={serverAction}>`
No `'use client'` on the forms — Server Actions handle validation and Prisma writes directly. On success, `redirect()` back to the list. On error, the action returns an error string and the page re-renders with an inline error message.

### 5. Slug auto-generation client-side
The slug field auto-populates from the title using a small `'use client'` input component (`SlugInput`) that slugifies on title `onChange`. The user can override it. Keeps the form mostly server-rendered while handling one interactive field.

## Risks / Trade-offs

- **[No optimistic UI]** → After publish/delete the page does a full server round-trip via `revalidatePath`. Acceptable at low content volume.
- **[No edit form]** → Content must be deleted and recreated to fix mistakes. Acceptable for MVP; edit is a known next step.
- **[Plain textarea for ARTICLE body]** → No markdown preview. Acceptable until a rich editor is specified.
- **[Slug collision not surfaced gracefully]** → The API returns 409 on duplicate slug. The Server Action should catch this and return a user-facing error message.
