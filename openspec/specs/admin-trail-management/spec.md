# admin-trail-management Specification

## Purpose
TBD - created by archiving change admin-panel. Update Purpose after archive.
## Requirements
### Requirement: Admin trail list
The `/dashboard/admin` page SHALL include a Trilhas tab showing all Trail records with columns: title, slug, active status, item count, and row actions.

#### Scenario: Trail list shown
- **WHEN** an ADMIN clicks the "Trilhas" tab
- **THEN** all trails are listed with title, slug, active badge, and item count

#### Scenario: Toggle trail active state
- **WHEN** an ADMIN clicks "Ativar" or "Desativar" on a trail row
- **THEN** the trail's `active` field is toggled and the list refreshes

#### Scenario: Delete trail
- **WHEN** an ADMIN clicks "Deletar" on a trail row and confirms
- **THEN** the trail and all its TrailItems are deleted and the list refreshes

### Requirement: Create trail
The page at `/dashboard/admin/trilhas/novo` SHALL render a form to create a new Trail.

#### Scenario: Trail creation form fields
- **WHEN** an ADMIN visits `/dashboard/admin/trilhas/novo`
- **THEN** fields shown are: title, slug (auto-generated), description (optional textarea), thumbnail URL (optional)

#### Scenario: Successful trail creation redirects to admin
- **WHEN** an ADMIN submits a valid trail creation form
- **THEN** the trail is created with `active: false` and the user is redirected to `/dashboard/admin?tab=trilhas`

#### Scenario: Duplicate trail slug shows error
- **WHEN** an ADMIN submits a trail form with a slug already in use
- **THEN** an inline error "Slug já em uso" is shown

