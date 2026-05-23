# admin-content-management Specification

## Purpose
TBD - created by archiving change admin-panel. Update Purpose after archive.
## Requirements
### Requirement: Admin content list
The page at `/dashboard/admin` SHALL display all Content records (any status) in a table with columns: title, type, status badge, publishedAt, and row actions. Only users with `role: ADMIN` SHALL access this page.

#### Scenario: Non-admin redirected
- **WHEN** a user with `role: MEMBER` visits `/dashboard/admin`
- **THEN** they are redirected to `/dashboard`

#### Scenario: Admin sees all content
- **WHEN** an ADMIN visits `/dashboard/admin`
- **THEN** all Content records are listed regardless of status, ordered by `createdAt desc`

#### Scenario: Status badge reflects current state
- **WHEN** a content row is rendered
- **THEN** PUBLISHED content shows a green "PUBLICADO" badge and DRAFT shows a grey "RASCUNHO" badge

### Requirement: Publish and unpublish content
An ADMIN SHALL be able to toggle a content item between DRAFT and PUBLISHED via inline row actions.

#### Scenario: Publish a draft
- **WHEN** an ADMIN clicks "Publicar" on a DRAFT content item
- **THEN** the item's status becomes PUBLISHED, `publishedAt` is set to now, and the list refreshes

#### Scenario: Unpublish a published item
- **WHEN** an ADMIN clicks "Despublicar" on a PUBLISHED content item
- **THEN** the item's status becomes DRAFT and the list refreshes

### Requirement: Delete content
An ADMIN SHALL be able to delete a content item via a row action with confirmation.

#### Scenario: Delete with confirmation
- **WHEN** an ADMIN clicks "Deletar" and confirms the browser confirm dialog
- **THEN** the content item and all associated meta records are deleted and the list refreshes

### Requirement: Create content — type picker
The page at `/dashboard/admin/conteudos/novo` SHALL first show a type selection screen if no `?tipo` query param is present.

#### Scenario: Type picker shown without query param
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/novo` with no `?tipo` param
- **THEN** five type cards are shown (VIDEO, MATCHUP, BUILD, ARTICLE, PDF) each linking to `?tipo=<TYPE>`

### Requirement: Create content — type-specific form
Once a type is selected via `?tipo=<TYPE>`, the form SHALL render fields specific to that content type. Common fields (title, slug, thumbnail, accessLevel) are always shown.

#### Scenario: VIDEO form fields
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/novo?tipo=VIDEO`
- **THEN** fields shown are: title, slug (auto-generated), thumbnail URL, accessLevel, youtubeId, duration

#### Scenario: MATCHUP form fields
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/novo?tipo=MATCHUP`
- **THEN** fields shown are: title, slug, thumbnail, accessLevel, champion, difficulty (select), tips (textarea, one per line), strategy (textarea), itemSuggestion

#### Scenario: BUILD form fields
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/novo?tipo=BUILD`
- **THEN** fields shown are: title, slug, thumbnail, accessLevel, champion, items (textarea, one per line), runes (textarea, one per line), notes

#### Scenario: ARTICLE form fields
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/novo?tipo=ARTICLE`
- **THEN** fields shown are: title, slug, thumbnail, accessLevel, body (large textarea)

#### Scenario: PDF form fields
- **WHEN** an ADMIN visits `/dashboard/admin/conteudos/novo?tipo=PDF`
- **THEN** fields shown are: title, slug, thumbnail, accessLevel, url (file URL), sizeBytes (optional number)

#### Scenario: Successful creation redirects to list
- **WHEN** an ADMIN submits a valid creation form
- **THEN** the content is created as DRAFT and the user is redirected to `/dashboard/admin`

#### Scenario: Slug collision shows error
- **WHEN** an ADMIN submits a form with a slug already in use
- **THEN** an inline error "Slug já em uso" is shown and the form is not cleared

