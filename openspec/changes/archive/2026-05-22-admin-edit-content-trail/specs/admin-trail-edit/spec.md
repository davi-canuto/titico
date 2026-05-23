## ADDED Requirements

### Requirement: Edit trail page
The page at `/dashboard/admin/trilhas/[id]/editar` SHALL display a pre-filled form with the trail's current values and allow an ADMIN to update them.

#### Scenario: Page loads pre-filled
- **WHEN** an ADMIN visits `/dashboard/admin/trilhas/[id]/editar`
- **THEN** all form fields (title, slug, description, thumbnail) are pre-filled with the trail's current values

#### Scenario: Trail not found
- **WHEN** the trail ID does not exist
- **THEN** Next.js `notFound()` is called

#### Scenario: Non-admin is redirected
- **WHEN** a non-ADMIN user visits the edit page
- **THEN** they are redirected to `/dashboard`

### Requirement: Update trail action
The `updateTrail(id, formData)` Server Action SHALL update the trail's title, slug, description, and thumbnail.

#### Scenario: Successful update
- **WHEN** an ADMIN submits the edit form with valid data
- **THEN** the trail record is updated and the admin is redirected to `/dashboard/admin?tab=trilhas`

#### Scenario: Slug conflict on update
- **WHEN** an ADMIN submits a slug already used by a different trail
- **THEN** the user is redirected back to the edit page with `?error=slug`

#### Scenario: Own slug is preserved
- **WHEN** an ADMIN submits the same slug the trail already has
- **THEN** the update succeeds (no conflict with itself)

### Requirement: Edit link in trail table
Each trail row in `/dashboard/admin` SHALL include an "Editar" link.

#### Scenario: Link navigates to edit page
- **WHEN** an ADMIN clicks "Editar" on a trail row
- **THEN** the browser navigates to `/dashboard/admin/trilhas/[id]/editar`
