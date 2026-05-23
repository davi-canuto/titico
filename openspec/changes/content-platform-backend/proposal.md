## Why

The platform currently has no content model — matchups and videos are hardcoded as static data and the dashboard is a skeleton. This change builds the entire backend foundation for the content platform: Prisma schema, API routes, and admin endpoints so the creator can manage content independently without deployments.

## What Changes

- **Prisma schema**: Add `Content`, `VideoMeta`, `MatchupMeta`, `BuildMeta`, `ArticleMeta`, `FileMeta`, `Trail`, `TrailItem`, `UserProgress` models; add `role UserRole` to `User`; add `FREE` to `AccessLevel` enum; add new enums `ContentType`, `ContentStatus`, `Difficulty`, `UserRole`
- **API routes** (member-facing):
  - `GET /api/contents/[slug]` — content detail with meta, access-gated
  - `GET /api/trails` — list active trails
  - `GET /api/trails/[slug]` — trail detail with ordered items + caller's progress
  - `POST /api/contents/[slug]/progress` — upsert user progress
- **API routes** (admin-only, role: ADMIN):
  - `POST|PATCH|DELETE /api/admin/contents`
  - `POST|PATCH|DELETE /api/admin/trails`
  - `POST /api/admin/trails/[id]/items`
- **BREAKING**: `AccessLevel` enum gains `FREE` value — existing `Purchase` records unaffected (they use `FULL`/`BASIC`)

## Capabilities

### New Capabilities

- `content`: unified content model, trail organization, user progress tracking, access control, admin CRUD

### Modified Capabilities

- `user-profile`: `GET /api/user/me` needs to include `role` field in response so frontend can show/hide admin nav
- `dashboard`: dashboard home now has content to display — requirement for "user with purchase sees navigation to matchups/videos" becomes navigation to the content platform

## Impact

- **New files**: `src/app/api/contents/[slug]/route.ts`, `src/app/api/contents/[slug]/progress/route.ts`, `src/app/api/trails/route.ts`, `src/app/api/trails/[slug]/route.ts`, `src/app/api/admin/contents/route.ts`, `src/app/api/admin/contents/[id]/route.ts`, `src/app/api/admin/trails/route.ts`, `src/app/api/admin/trails/[id]/route.ts`, `src/app/api/admin/trails/[id]/items/route.ts`
- **Modified**: `prisma/schema.prisma` — large additive migration, no destructive changes
- **New dependency**: none — Prisma, Zod, Auth.js already in place
- **Migration**: `prisma migrate dev` required after schema changes
