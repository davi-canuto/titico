## ADDED Requirements

### Requirement: Product slug field
The `Product` model SHALL have a `slug` field that is a unique, non-empty string in kebab-case format.

#### Scenario: Slug is unique across products
- **WHEN** two products are created with the same slug
- **THEN** the second creation fails with a unique constraint violation

#### Scenario: Existing products receive backfill slug
- **WHEN** the migration runs on a database with existing products
- **THEN** each existing product receives its `id` as its temporary slug (ensuring uniqueness)

### Requirement: Admin product form slug field
The create and edit product forms in the admin SHALL include a `slug` input field that is pre-populated from the product name using kebab-case conversion, and is editable by the admin.

#### Scenario: Slug auto-generated from name
- **WHEN** the admin types in the product name field
- **THEN** the slug field is automatically populated with a kebab-case version of the name (lowercase, spaces and special chars replaced with hyphens)

#### Scenario: Slug manually overridden
- **WHEN** the admin edits the slug field directly
- **THEN** the auto-generation stops and the manually entered value is used

#### Scenario: Duplicate slug on create
- **WHEN** the admin submits a create form with a slug that already exists
- **THEN** the user is redirected back with `?error=slug`

#### Scenario: Duplicate slug on edit
- **WHEN** the admin submits an edit form with a slug already used by another product
- **THEN** the user is redirected back with `?error=slug`

### Requirement: Landing page product lookup by slug
The landing page SHALL look up the PDF product by its slug server-side and pass the resolved `id` to `ProductsCTA`.

#### Scenario: Product found by slug
- **WHEN** an active product with the configured slug exists
- **THEN** `ProductsCTA` receives the product `id` as `pdfProductId` and the buy button is enabled

#### Scenario: Product not found by slug
- **WHEN** no active product matches the configured slug
- **THEN** `ProductsCTA` receives `pdfProductId: null` and the buy button is disabled
