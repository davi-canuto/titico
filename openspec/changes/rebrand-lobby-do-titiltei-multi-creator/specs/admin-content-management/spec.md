## MODIFIED Requirements

### Requirement: Create content — type-specific form
Once a type is selected via `?tipo=<TYPE>`, the form SHALL render fields specific to that content type. Common fields (title, slug, thumbnail) are always shown. The form SHALL include a **creator selector** (`<select name="creatorId">`) listing all active creators — this field is required.

#### Scenario: VIDEO form fields
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/novo?tipo=VIDEO`
- **THEN** fields shown are: creator selector, title, slug (auto-generated), thumbnail URL, youtubeId, duration

#### Scenario: MATCHUP form fields
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/novo?tipo=MATCHUP`
- **THEN** fields shown are: creator selector, title, slug, thumbnail, champion, difficulty (select), tips (textarea, one per line), strategy (textarea), itemSuggestion

#### Scenario: BUILD form fields
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/novo?tipo=BUILD`
- **THEN** fields shown are: creator selector, title, slug, thumbnail, champion, items (textarea, one per line), runes (textarea, one per line), notes

#### Scenario: ARTICLE form fields
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/novo?tipo=ARTICLE`
- **THEN** fields shown are: creator selector, title, slug, thumbnail, body (large textarea)

#### Scenario: PDF form fields
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/novo?tipo=PDF`
- **THEN** fields shown are: creator selector, title, slug, thumbnail, url (file URL), sizeBytes (optional number)

#### Scenario: Submission without creator selected fails
- **WHEN** an ADMIN submits a creation form without selecting a creator
- **THEN** the form is rejected with validation error "Criador é obrigatório"

#### Scenario: Successful creation redirects to list
- **WHEN** an ADMIN submits a valid creation form
- **THEN** the content is created as DRAFT (with the selected `creatorId`) and the user is redirected to `/dashboard/admin`

#### Scenario: Slug collision shows error
- **WHEN** an ADMIN submits a form with a slug already in use
- **THEN** an inline error "Slug já em uso" is shown and the form is not cleared

### Requirement: Edit content — creator association
The edit form at `/dashboard/admin/conteudos/[id]/editar` SHALL display and allow changing the creator association.

#### Scenario: Edit form shows current creator
- **WHEN** an ADMIN visits the edit page for a content item
- **THEN** the creator selector pre-selects the content's current `creatorId`

### Requirement: Admin product management
An ADMIN SHALL be able to create and manage products for each creator. The product creation form SHALL include a **creator selector** (`<select name="creatorId">`) — required.

#### Scenario: Admin creates a product for a specific creator
- **WHEN** an ADMIN submits the product form with a valid `creatorId`
- **THEN** the product is created and associated with that creator
