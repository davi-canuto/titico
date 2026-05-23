## Context

Today the codebase has no content model — matchups and videos are static in-code data, the dashboard is a skeleton, and there is no admin surface. This change introduces the full Prisma schema for the content platform and all backend API routes, establishing the data layer that every future frontend change will depend on.

Existing infrastructure in place: PostgreSQL via Prisma, Auth.js v5 (JWT strategy), Zod for validation, Next.js App Router with Server Actions.

## Goals / Non-Goals

**Goals:**
- Complete `prisma/schema.prisma` with all new models in one migration
- Implement all member-facing and admin-facing API routes per `openspec/specs/content/spec.md`
- Enforce access control (FREE/PAID) and role-based admin guard at the handler level
- Zero destructive changes to existing `User`, `Purchase`, `Product` models

**Non-Goals:**
- Frontend/UI — covered in a future `platform-dashboard` change
- File upload for PDFs — `FileMeta.url` is a plain string (externally hosted URL); upload infra is out of scope
- Search/full-text — `GET /api/contents` list endpoint is out of scope for this change
- Multi-tenancy (`creatorId`) — intentionally deferred

## Decisions

### 1. Single `Content` table with nullable 1:1 meta relations
One `Content` row per item. Each type has a dedicated meta model (`VideoMeta`, `MatchupMeta`, etc.) linked by `contentId @unique`. Only the meta matching the `Content.type` is populated; others are `null`.

*Alternative*: Single JSON `meta` column — rejected because it loses type safety and makes Prisma queries awkward.

### 2. Admin guard as a shared helper, not middleware
A `requireAdmin(request)` helper reads `auth()` and checks `session.user.role === "ADMIN"`. Each admin route calls it at the top and returns 403 if it fails. Avoids coupling admin protection to the global middleware which already handles general auth.

*Alternative*: Middleware matcher for `/api/admin/*` — rejected because it can't read the JWT role without custom logic, and the existing middleware only checks for session presence.

### 3. Access control helper `canAccessContent(user, content)`
A pure function that takes the user's purchase status and the content's `accessLevel`, returns boolean. Used by both the member content endpoint and trail detail endpoint. Keeps the logic in one place.

### 4. `UserProgress` upsert on `@@unique([userId, contentId])`
`prisma.userProgress.upsert` with `where: { userId_contentId }`. Idempotent — calling progress multiple times is safe. `watchedSeconds` is always overwritten with the latest value (not accumulated).

### 5. Trail items ordered by explicit `order Int` field
`TrailItem` has `@@unique([trailId, order])`. Admin sets order explicitly. No auto-increment for order — admin can reorder by updating the field. Prevents gaps and conflicts at the DB level.

### 6. `slug` generation
Slugs are provided by the admin in the request body (not auto-generated from the title). This gives the creator control over URLs. The API validates uniqueness and returns `409` on conflict.

## Risks / Trade-offs

- **[Schema migration size]** → Large additive migration. Mitigation: all new tables, no column drops — safe to run against production without data loss. Rollback = drop new tables.
- **[role field on User]** → Adding `role UserRole @default(MEMBER)` to `User`. Existing users get `MEMBER` automatically. Admin must be set manually in DB (`UPDATE "User" SET role = 'ADMIN' WHERE email = '...'`) until an admin UI exists.
- **[AccessLevel FREE addition]** → Existing enum in PostgreSQL must be altered with `ALTER TYPE`. Prisma `migrate dev` handles this, but requires a non-concurrent migration step.
- **[N+1 on trail detail]** → Trail detail fetches trail + items + content + meta for each item. Mitigation: use Prisma `include` with nested relations in a single query — no N+1.

## Migration Plan

1. Run `npx prisma migrate dev --name content-platform` after schema changes
2. Manually set admin role: `UPDATE "User" SET role = 'ADMIN' WHERE email = 'titiltei@...'`
3. Seed initial content via admin API or directly via Prisma Studio
4. Deploy — no existing data affected
