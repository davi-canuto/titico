## MODIFIED Requirements

### Requirement: Explorar page lists all published content
The page at `/dashboard/explorar` SHALL display all `Content` records with `status: PUBLISHED` and `active: true`, ordered by `publishedAt desc`. An optional query param `?creator=<slug>` filters content by creator. Without it, content from all creators is shown.

#### Scenario: User visits Explorar with no filter
- **WHEN** an authenticated user visits `/dashboard/explorar`
- **THEN** all published active content from all creators is shown in a responsive grid

#### Scenario: User filters by creator
- **WHEN** a user selects a creator filter (e.g., `?creator=titiltei`)
- **THEN** only content belonging to that creator is shown

#### Scenario: User filters by content type
- **WHEN** a user selects a type filter (e.g., VIDEO)
- **THEN** only content with that `ContentType` is shown and the URL updates to `?tipo=VIDEO`

#### Scenario: Filters can be combined
- **WHEN** a user applies both `?creator=titiltei` and `?tipo=VIDEO`
- **THEN** only VIDEO content from Titiltei is shown

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
- **THEN** the page navigates to `?tipo=<TYPE>` (preserving any `?creator` param) and the grid re-renders server-side

### Requirement: Explorar grid links to player
Each content card in the Explorar grid SHALL be a link to `/dashboard/conteudo/[slug]`.

#### Scenario: Card click navigates to player
- **WHEN** a user clicks a ContentCard on the Explorar page
- **THEN** the browser navigates to `/dashboard/conteudo/[content.slug]`
