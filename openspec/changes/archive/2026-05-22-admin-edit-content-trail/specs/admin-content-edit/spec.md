## ADDED Requirements

### Requirement: Edit content page
The page at `/dashboard/admin/conteudos/[id]/editar` SHALL display a pre-filled form with the content's current values and allow an ADMIN to update them.

#### Scenario: Page loads pre-filled
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/[id]/editar`
- **THEN** all form fields are pre-filled with the content's current values

#### Scenario: Content not found
- **WHEN** the content ID does not exist
- **THEN** Next.js `notFound()` is called

#### Scenario: Non-admin is redirected
- **WHEN** a non-ADMIN user visits the edit page
- **THEN** they are redirected to `/dashboard`

### Requirement: Update content action
The `updateContent(id, formData)` Server Action SHALL update the content's common fields and the type-specific meta fields.

#### Scenario: Successful update
- **WHEN** an ADMIN submits the edit form with valid data
- **THEN** the content record and its meta record are updated and the admin is redirected to `/dashboard/admin`

#### Scenario: Slug conflict on update
- **WHEN** an ADMIN submits a slug that is already in use by a different content
- **THEN** the user is redirected back to the edit page with `?error=slug`

#### Scenario: Own slug is preserved
- **WHEN** an ADMIN submits the same slug the content already has
- **THEN** the update succeeds (no conflict with itself)

### Requirement: Edit link in content table
Each content row in `/dashboard/admin` SHALL include an "Editar" link.

#### Scenario: Link navigates to edit page
- **WHEN** an ADMIN clicks "Editar" on a content row
- **THEN** the browser navigates to `/dashboard/admin/conteudos/[id]/editar`
