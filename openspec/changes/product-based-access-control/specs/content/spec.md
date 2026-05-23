## MODIFIED Requirements

### Requirement: Content data model
The system SHALL store all platform content (videos, matchups, builds, articles, PDFs) in a unified `Content` model with type-specific meta models.

The `Content` model SHALL NOT have an `accessLevel` field. Access control is determined exclusively by the `ContentProduct` relation. A `Content` with no associated products is considered free and accessible to any authenticated user.

A new join model `ContentProduct` SHALL exist:

```
model ContentProduct {
  contentId String
  productId String

  content Content @relation(fields: [contentId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@id([contentId, productId])
}
```

The `Content` model SHALL include a `products ContentProduct[]` relation.
The `Product` model SHALL include a `contents ContentProduct[]` relation and SHALL NOT have an `accessLevel` field.
The `User` model SHALL NOT have an `accessLevel` field.
The `AccessLevel` enum SHALL be removed from the schema entirely.

#### Scenario: Content with mismatched meta type
- **WHEN** a `Content` of type `VIDEO` has no `VideoMeta` record
- **THEN** the API MUST return a `500` internal error and log the inconsistency

#### Scenario: Slug uniqueness
- **WHEN** an admin attempts to create a `Content` with a slug already in use
- **THEN** the API returns `409 CONFLICT`

---

### Requirement: Content access control
A user MAY access a content item if: (a) the content has no associated products (free), or (b) the user has at least one `Purchase` with `status: COMPLETED` whose `productId` matches any of the content's associated products. Admins (`role: ADMIN`) bypass all access checks.

The function `userCanAccessContent(userId: string, contentId: string): Promise<boolean>` in `src/lib/access.ts` SHALL implement this logic via a Prisma query. The old `canAccess()` and `LEVEL_ORDER` SHALL be removed.

#### Scenario: Free content — any authenticated user
- **WHEN** an authenticated user requests a `Content` with no associated products
- **THEN** the full content and meta are returned regardless of purchase status

#### Scenario: Product-gated content — user without matching purchase
- **WHEN** an authenticated user has no `Purchase` with `status: COMPLETED` for any product associated with the content
- **THEN** the response is `403 FORBIDDEN` with `{ code: "ACCESS_DENIED" }`

#### Scenario: Product-gated content — user with matching purchase
- **WHEN** an authenticated user has a `Purchase` with `status: COMPLETED` for at least one product associated with the content
- **THEN** the full content and meta are returned

#### Scenario: Content associated with multiple products
- **WHEN** a content item is associated with two products (A and B) and the user has only purchased product A
- **THEN** the user SHALL have full access to that content

#### Scenario: Admin bypasses access check
- **WHEN** a user with `role: ADMIN` requests any content
- **THEN** the full content and meta are returned regardless of purchase status

#### Scenario: DRAFT content hidden from members
- **WHEN** a member requests a `Content` with `status: DRAFT`
- **THEN** the response is `404 NOT_FOUND`

---

### Requirement: Content detail endpoint
`GET /api/contents/[slug]` returns a single content item with its type-specific meta.

#### Scenario: Valid slug, member has access
- **WHEN** an authenticated member calls `GET /api/contents/shaco-vs-viego` and has access
- **THEN** the response includes the `Content` fields plus the relevant meta object (e.g., `matchup: { champion, difficulty, tips, strategy }`)

#### Scenario: Unknown slug
- **WHEN** `GET /api/contents/unknown-slug` is called
- **THEN** the response is `404 NOT_FOUND`

---

### Requirement: Trails listing endpoint
`GET /api/trails` returns all active trails. Authentication required.

#### Scenario: Member lists trails
- **WHEN** an authenticated member calls `GET /api/trails`
- **THEN** all trails where `active: true` are returned, each with `id`, `title`, `slug`, `description`, `thumbnail`, and `itemCount`

---

### Requirement: Trail detail endpoint
`GET /api/trails/[slug]` returns a trail with its ordered content list and the caller's progress.

#### Scenario: Member views a trail
- **WHEN** an authenticated member calls `GET /api/trails/guia-shaco`
- **THEN** the response includes trail metadata and `items[]` sorted by `TrailItem.order`, each item including `Content` summary fields, a `locked` boolean derived from `userCanAccessContent`, and `userProgress` for the caller

#### Scenario: Unknown trail slug
- **WHEN** `GET /api/trails/unknown` is called
- **THEN** the response is `404 NOT_FOUND`

---

### Requirement: Progress tracking endpoint
`POST /api/contents/[slug]/progress` upserts the caller's progress on a content item.

#### Scenario: Member marks content as completed
- **WHEN** a member sends `POST /api/contents/shaco-vs-viego/progress` with `{ completedAt: <ISO date> }`
- **THEN** a `UserProgress` record is upserted with `completedAt` set

#### Scenario: Member updates watch time
- **WHEN** a member sends `POST /api/contents/[slug]/progress` with `{ watchedSeconds: 142 }`
- **THEN** the `UserProgress.watchedSeconds` is updated

---

### Requirement: Admin content CRUD
`/api/admin/contents` and `/api/admin/trails` are only accessible to users with `role: ADMIN`.

#### Scenario: Non-admin hits admin endpoint
- **WHEN** a member with `role: MEMBER` calls any `/api/admin/*` endpoint
- **THEN** the response is `403 FORBIDDEN`

#### Scenario: Admin creates content
- **WHEN** an admin sends `POST /api/admin/contents` with valid body `{ type, title, slug, productIds?: string[], ...meta }`
- **THEN** the `Content` and corresponding meta record are created as DRAFT, and `ContentProduct` entries are created for each `productId` provided

#### Scenario: Admin creates free content
- **WHEN** an admin sends `POST /api/admin/contents` with no `productIds` (or empty array)
- **THEN** the content is created with no `ContentProduct` entries and is accessible to all authenticated users

#### Scenario: Admin publishes content
- **WHEN** an admin sends `PATCH /api/admin/contents/[id]` with `{ status: "PUBLISHED", publishedAt: <now> }`
- **THEN** the content becomes visible to members

#### Scenario: Admin deletes content
- **WHEN** an admin sends `DELETE /api/admin/contents/[id]`
- **THEN** the content and all its meta records are deleted (cascade), including `ContentProduct` entries

#### Scenario: Admin creates trail
- **WHEN** an admin sends `POST /api/admin/trails` with `{ title, slug, description?, thumbnail? }`
- **THEN** a new `Trail` is created with `active: false` and empty `items[]`

#### Scenario: Admin adds content to trail
- **WHEN** an admin sends `POST /api/admin/trails/[id]/items` with `{ contentId, order }`
- **THEN** a `TrailItem` is created linking the content to the trail at the given position
