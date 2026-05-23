## MODIFIED Requirements

### Requirement: Create content — type-specific form
Once a type is selected via `?tipo=<TYPE>`, the form SHALL render fields specific to that content type. Common fields (title, slug, thumbnail) are always shown. The `accessLevel` field SHALL be replaced by a multi-select list of active products — the admin associates zero or more products to the content. Content with no products selected is free.

#### Scenario: VIDEO form fields
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/novo?tipo=VIDEO`
- **THEN** fields shown are: title, slug (auto-generated), thumbnail URL, product selector (checkboxes for active products), youtubeId, duration

#### Scenario: MATCHUP form fields
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/novo?tipo=MATCHUP`
- **THEN** fields shown are: title, slug, thumbnail, product selector, champion, difficulty (select), tips (textarea, one per line), strategy (textarea), itemSuggestion

#### Scenario: BUILD form fields
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/novo?tipo=BUILD`
- **THEN** fields shown are: title, slug, thumbnail, product selector, champion, items (textarea, one per line), runes (textarea, one per line), notes

#### Scenario: ARTICLE form fields
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/novo?tipo=ARTICLE`
- **THEN** fields shown are: title, slug, thumbnail, product selector, body (large textarea)

#### Scenario: PDF form fields
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/novo?tipo=PDF`
- **THEN** fields shown are: title, slug, thumbnail, product selector, url (file URL), sizeBytes (optional number)

#### Scenario: Successful creation with products
- **WHEN** an ADMIN submits a valid creation form with one or more products selected
- **THEN** the content is created as DRAFT and `ContentProduct` records are created for each selected product

#### Scenario: Successful creation without products (free)
- **WHEN** an ADMIN submits a valid creation form with no products selected
- **THEN** the content is created as DRAFT with no `ContentProduct` entries (accessible to all)

#### Scenario: Slug collision shows error
- **WHEN** an ADMIN submits a form with a slug already in use
- **THEN** an inline error "Slug já em uso" is shown and the form is not cleared

### Requirement: Edit content — product association
The edit form at `/dashboard/admin/conteudos/[id]/editar` SHALL display the current product associations and allow the admin to add or remove them.

#### Scenario: Edit form shows current products
- **WHEN** an ADMIN visits the edit page for a content item
- **THEN** the product checkboxes reflect the content's current `ContentProduct` associations

#### Scenario: Admin updates product associations
- **WHEN** an ADMIN changes the product checkboxes and submits the form
- **THEN** the `ContentProduct` entries are replaced with the new selection (delete-then-insert)
