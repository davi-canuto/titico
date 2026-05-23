## ADDED Requirements

### Requirement: Bookmark creation and removal
The system SHALL allow authenticated users to bookmark and un-bookmark individual content items. Adding a bookmark that already exists MUST be idempotent (no duplicate records). Removing a bookmark that does not exist SHALL return `200`.

#### Scenario: User bookmarks a content
- **WHEN** an authenticated user sends `POST /api/bookmarks` with `{ contentId }`
- **THEN** a `Bookmark` record is created with `userId` and `contentId`
- **THEN** the response is `200` with the created bookmark

#### Scenario: User bookmarks the same content twice
- **WHEN** an authenticated user sends `POST /api/bookmarks` with a `contentId` they already bookmarked
- **THEN** no duplicate record is created
- **THEN** the response is `200`

#### Scenario: User removes a bookmark
- **WHEN** an authenticated user sends `DELETE /api/bookmarks/[contentId]`
- **THEN** the `Bookmark` record is deleted
- **THEN** the response is `200`

#### Scenario: User removes a non-existent bookmark
- **WHEN** an authenticated user sends `DELETE /api/bookmarks/[contentId]` for a content they haven't bookmarked
- **THEN** the response is `200` (idempotent)

#### Scenario: Unauthenticated request
- **WHEN** an unauthenticated request hits any bookmark endpoint
- **THEN** the response is `401`

### Requirement: Bookmark listing
`GET /api/bookmarks` SHALL return the authenticated user's bookmarked content items in reverse chronological order (most recently bookmarked first), including content and video metadata.

#### Scenario: User has bookmarks
- **WHEN** an authenticated user calls `GET /api/bookmarks`
- **THEN** the response is an array of `{ id, contentId, content: { ...ContentWithVideo } }` ordered by `createdAt desc`

#### Scenario: User has no bookmarks
- **WHEN** an authenticated user calls `GET /api/bookmarks` with no bookmarks
- **THEN** the response is an empty array `[]`

### Requirement: BookmarkButton with optimistic state
The `BookmarkButton` client component SHALL toggle the bookmark state optimistically on click, syncing with the server in the background. On server failure, it SHALL revert to the previous state.

#### Scenario: User clicks bookmark icon on unbookmarked content
- **WHEN** the user clicks the bookmark icon on a content card or content page
- **THEN** the icon immediately switches to the "bookmarked" filled state
- **THEN** a `POST /api/bookmarks` request is made in the background

#### Scenario: User clicks bookmark icon on bookmarked content
- **WHEN** the user clicks the bookmark icon on a bookmarked content
- **THEN** the icon immediately switches to the "unbookmarked" outline state
- **THEN** a `DELETE /api/bookmarks/[contentId]` request is made in the background

#### Scenario: Server request fails
- **WHEN** the background request fails
- **THEN** the icon reverts to its previous state

### Requirement: Saved content section on profile page
The `/dashboard/perfil` page SHALL display a "Salvos" section listing the user's bookmarked content using `ContentCard` components.

#### Scenario: User has bookmarks
- **WHEN** an authenticated user with bookmarks visits `/dashboard/perfil`
- **THEN** a "Salvos" section is shown with a `ContentCard` grid of bookmarked items

#### Scenario: User has no bookmarks
- **WHEN** an authenticated user with no bookmarks visits `/dashboard/perfil`
- **THEN** the "Salvos" section shows an empty state message
