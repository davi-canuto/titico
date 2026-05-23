## MODIFIED Requirements

### Requirement: Explorar page lists all published content
The page at `/dashboard/explorar` SHALL display all `Content` records with `status: PUBLISHED` and `active: true`, ordered by `publishedAt desc`. The locked state of each content card SHALL be derived by checking whether the user has a `Purchase` `COMPLETED` for any product associated with that content — not by comparing `AccessLevel` fields. Content with no associated products is never locked.

#### Scenario: User visits Explorar with no filter
- **WHEN** an authenticated user visits `/dashboard/explorar`
- **THEN** all published active content is shown in a responsive grid, with locked/unlocked state based on product ownership

#### Scenario: User filters by content type
- **WHEN** a user selects a type filter (e.g., VIDEO)
- **THEN** only content with that `ContentType` is shown and the URL updates to `?tipo=VIDEO`

#### Scenario: No content matches filter
- **WHEN** a filter is applied and no content matches
- **THEN** an empty state message "Nenhum conteúdo encontrado" is displayed

### Requirement: Type filter chips
The Explorar page SHALL render filter chips for each `ContentType` plus an "Todos" option. The active filter is visually highlighted.

#### Scenario: All filter selected by default
- **WHEN** the user visits `/dashboard/explorar` without a `?tipo` param
- **THEN** the "Todos" chip is highlighted and all content is shown

#### Scenario: Type chip click updates URL
- **WHEN** the user clicks a type chip
- **THEN** the page navigates to `?tipo=<TYPE>` and the grid re-renders server-side

### Requirement: Explorar grid links to player
Each content card in the Explorar grid SHALL be a link to `/dashboard/conteudo/[slug]`.

#### Scenario: Card click navigates to player
- **WHEN** a user clicks a ContentCard on the Explorar page
- **THEN** the browser navigates to `/dashboard/conteudo/[content.slug]`
