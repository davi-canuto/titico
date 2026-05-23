## ADDED Requirements

### Requirement: Content data model
The system SHALL store all platform content (videos, matchups, builds, articles, PDFs) in a unified `Content` model with type-specific meta models.

**Prisma models:**

```
enum ContentType   { VIDEO MATCHUP BUILD ARTICLE PDF }
enum ContentStatus { DRAFT PUBLISHED }
enum Difficulty    { EASY MEDIUM HARD }
enum UserRole      { MEMBER ADMIN }

model Content {
  id          String        @id @default(cuid())
  type        ContentType
  title       String
  slug        String        @unique
  thumbnail   String?
  accessLevel AccessLevel   @default(PAID)
  status      ContentStatus @default(DRAFT)
  publishedAt DateTime?
  active      Boolean       @default(true)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  video    VideoMeta?
  matchup  MatchupMeta?
  build    BuildMeta?
  article  ArticleMeta?
  file     FileMeta?
  trails   TrailItem[]
  progress UserProgress[]
}

model VideoMeta {
  id        String  @id @default(cuid())
  contentId String  @unique
  youtubeId String
  duration  String?
  content   Content @relation(fields: [contentId], references: [id], onDelete: Cascade)
}

model MatchupMeta {
  id             String     @id @default(cuid())
  contentId      String     @unique
  champion       String
  difficulty     Difficulty
  tips           String[]
  strategy       String
  itemSuggestion String?
  content        Content    @relation(fields: [contentId], references: [id], onDelete: Cascade)
}

model BuildMeta {
  id        String   @id @default(cuid())
  contentId String   @unique
  champion  String
  items     String[]
  runes     String[]
  notes     String?
  content   Content  @relation(fields: [contentId], references: [id], onDelete: Cascade)
}

model ArticleMeta {
  id        String  @id @default(cuid())
  contentId String  @unique
  body      String
  content   Content @relation(fields: [contentId], references: [id], onDelete: Cascade)
}

model FileMeta {
  id        String  @id @default(cuid())
  contentId String  @unique
  url       String
  sizeBytes Int?
  content   Content @relation(fields: [contentId], references: [id], onDelete: Cascade)
}

model Trail {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique
  description String?
  thumbnail   String?
  active      Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  items       TrailItem[]
}

model TrailItem {
  id        String  @id @default(cuid())
  trailId   String
  contentId String
  order     Int
  trail     Trail   @relation(fields: [trailId], references: [id], onDelete: Cascade)
  content   Content @relation(fields: [contentId], references: [id], onDelete: Cascade)

  @@unique([trailId, contentId])
  @@unique([trailId, order])
}

model UserProgress {
  id             String    @id @default(cuid())
  userId         String
  contentId      String
  watchedSeconds Int?
  completedAt    DateTime?
  updatedAt      DateTime  @updatedAt

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  content Content @relation(fields: [contentId], references: [id], onDelete: Cascade)

  @@unique([userId, contentId])
}
```

`User` SHALL receive a `role UserRole @default(MEMBER)` field and a `progress UserProgress[]` relation.
`AccessLevel` enum SHALL gain a `FREE` value alongside existing `FULL` and `BASIC`.

#### Scenario: Content with mismatched meta type
- **WHEN** a `Content` of type `VIDEO` has no `VideoMeta` record
- **THEN** the API MUST return a `500` internal error and log the inconsistency

#### Scenario: Slug uniqueness
- **WHEN** an admin attempts to create a `Content` with a slug already in use
- **THEN** the API returns `409 CONFLICT`

---

### Requirement: Content access control
Members MAY access content based on their `accessLevel`. Admin bypasses all access checks.

#### Scenario: FREE content — any authenticated member
- **WHEN** an authenticated user requests a `Content` with `accessLevel: FREE`
- **THEN** the full content and meta are returned regardless of purchase status

#### Scenario: PAID content — member without active purchase
- **WHEN** an authenticated user without a `Purchase` of `status: COMPLETED` requests a `Content` with `accessLevel: PAID`
- **THEN** the response is `403 FORBIDDEN` with `{ code: "ACCESS_DENIED" }`

#### Scenario: PAID content — member with active purchase
- **WHEN** an authenticated user with `Purchase.status: COMPLETED` requests any `Content`
- **THEN** the full content and meta are returned

#### Scenario: DRAFT content hidden from members
- **WHEN** a member requests a `Content` with `status: DRAFT`
- **THEN** the response is `404 NOT_FOUND`

---

### Requirement: Content detail endpoint
`GET /api/contents/[slug]` returns a single content item with its type-specific meta.

#### Scenario: Valid slug, member has access
- **WHEN** an authenticated member calls `GET /api/contents/shaco-vs-viego`
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
- **THEN** the response includes trail metadata and `items[]` sorted by `TrailItem.order`, each item including `Content` summary fields and `userProgress` (completedAt, watchedSeconds) for the caller

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
- **WHEN** an admin sends `POST /api/admin/contents` with valid body `{ type, title, slug, accessLevel, ...meta }`
- **THEN** the `Content` and corresponding meta record are created, status defaults to `DRAFT`

#### Scenario: Admin publishes content
- **WHEN** an admin sends `PATCH /api/admin/contents/[id]` with `{ status: "PUBLISHED", publishedAt: <now> }`
- **THEN** the content becomes visible to members

#### Scenario: Admin deletes content
- **WHEN** an admin sends `DELETE /api/admin/contents/[id]`
- **THEN** the content and all its meta records are deleted (cascade)

#### Scenario: Admin creates trail
- **WHEN** an admin sends `POST /api/admin/trails` with `{ title, slug, description?, thumbnail? }`
- **THEN** a new `Trail` is created with `active: false` and empty `items[]`

#### Scenario: Admin adds content to trail
- **WHEN** an admin sends `POST /api/admin/trails/[id]/items` with `{ contentId, order }`
- **THEN** a `TrailItem` is created linking the content to the trail at the given position
