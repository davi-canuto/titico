## ADDED Requirements

### Requirement: Video library access requires purchase
`GET /api/videos` is only available to users with `Purchase.status: COMPLETED`.

#### Scenario: User with active purchase lists videos
- **WHEN** `GET /api/videos` is called by a user with `hasAccess: true`
- **THEN** all videos are returned with `id`, `title`, `youtubeId`, `thumbnailUrl` (derived from `youtubeId`), `category`, optional `champion`, optional `duration`, `publishedAt`

#### Scenario: User without purchase tries to access videos
- **WHEN** `GET /api/videos` is called by a user without `Purchase`
- **THEN** the response is `403 FORBIDDEN`

#### Scenario: Filtering by category
- **WHEN** `GET /api/videos?category=matchup` is called
- **THEN** only videos of that category are returned

#### Scenario: Filtering by champion
- **WHEN** `GET /api/videos?champion=Viego` is called
- **THEN** only videos related to Viego are returned

### Requirement: Video data model
Videos are stored as static data (JSON or in-code). `thumbnailUrl` is always derived from `youtubeId` as `https://img.youtube.com/vi/{youtubeId}/maxresdefault.jpg`.
