## ADDED Requirements

### Requirement: Creator data model
The system SHALL have a `Creator` model representing each mono-champ content creator on the platform.

```
model Creator {
  id          String    @id @default(cuid())
  slug        String    @unique  // ex: "titiltei", "malandrao" — imutável após criação
  name        String             // ex: "Titiltei"
  champion    String             // ex: "Shaco"
  description String?
  avatarUrl   String?
  bannerUrl   String?
  active      Boolean   @default(true)
  createdAt   DateTime  @default(now())

  products    Product[]
  contents    Content[]
}
```

The seed SHALL create the first Creator: `{ slug: "titiltei", name: "Titiltei", champion: "Shaco" }` and associate all existing `Product` and `Content` records to it.

#### Scenario: Slug uniqueness
- **WHEN** an admin attempts to create a `Creator` with a slug already in use
- **THEN** the operation fails and an error "Slug já em uso" is returned

#### Scenario: Seed creates Titiltei on fresh database
- **WHEN** the Prisma seed runs on an empty database
- **THEN** a Creator with `slug: "titiltei"` and `champion: "Shaco"` exists and all seeded products are associated to it

### Requirement: Creator admin CRUD
An ADMIN SHALL be able to create and list Creators via the admin panel. Editing and deactivating are also supported.

#### Scenario: Admin creates a new creator
- **WHEN** an ADMIN submits a valid creator form with `slug`, `name`, `champion`
- **THEN** a new `Creator` record is created with `active: true`

#### Scenario: Admin lists all creators
- **WHEN** an ADMIN visits the creators section of the admin panel
- **THEN** all `Creator` records are listed with `name`, `slug`, `champion`, `active` status, and product/content counts

#### Scenario: Admin deactivates a creator
- **WHEN** an ADMIN deactivates a creator
- **THEN** the creator's `active` field is set to `false` and their products no longer appear in `GET /api/products`

### Requirement: Public creator listing
`GET /api/creators` returns all active creators. No authentication required.

#### Scenario: Active creators returned
- **WHEN** any client calls `GET /api/creators`
- **THEN** the response is an array of creators where `active: true`, each containing `id`, `slug`, `name`, `champion`, `description`, `avatarUrl`, `bannerUrl`
