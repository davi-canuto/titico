## MODIFIED Requirements

### Requirement: Content data model
The system SHALL store all platform content in a unified `Content` model. The `Content` model SHALL include a `creatorId String` field (FK to `Creator`, non-nullable) indicating which creator this content belongs to. Without this field, content cannot be created.

The migration strategy for adding `creatorId` to existing rows:
1. Add column as nullable.
2. Backfill all existing rows with Titiltei's `id`.
3. Make column `NOT NULL`.

#### Scenario: Content with mismatched meta type
- **WHEN** a `Content` of type `VIDEO` has no `VideoMeta` record
- **THEN** the API MUST return a `500` internal error and log the inconsistency

#### Scenario: Slug uniqueness
- **WHEN** an admin attempts to create a `Content` with a slug already in use
- **THEN** the API returns `409 CONFLICT`

#### Scenario: Content always has a creator
- **WHEN** any `Content` record is created via the admin
- **THEN** a valid `creatorId` SHALL be required — creation without a creator SHALL fail
