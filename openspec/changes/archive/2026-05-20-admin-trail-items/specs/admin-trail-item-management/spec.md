## ADDED Requirements

### Requirement: Trail item list page
The page at `/dashboard/admin/trilhas/[id]/itens` SHALL display all TrailItems for the given trail in ascending order, showing position number, content title, and content type.

#### Scenario: Items listed in order
- **WHEN** an ADMIN visits `/dashboard/admin/trilhas/[id]/itens`
- **THEN** all TrailItems are shown numbered 1, 2, 3… with title and type badge

#### Scenario: Trail not found
- **WHEN** the trail ID does not exist
- **THEN** Next.js `notFound()` is called

#### Scenario: Empty trail
- **WHEN** the trail has no items
- **THEN** an empty state "Nenhum conteúdo nesta trilha ainda" is shown alongside the add form

### Requirement: Add content to trail
The page SHALL include a form to add a published content item to the end of the trail.

#### Scenario: Content added successfully
- **WHEN** an ADMIN selects a content from the dropdown and submits
- **THEN** the content is appended as the last item and the list refreshes

#### Scenario: Dropdown excludes already-added content
- **WHEN** the add form renders
- **THEN** only PUBLISHED content not already in the trail appears in the select

#### Scenario: No available content
- **WHEN** all published content is already in the trail
- **THEN** the add form shows "Todos os conteúdos já foram adicionados" and no select is rendered

### Requirement: Remove item from trail
Each item row SHALL have a remove action that deletes the TrailItem and repacks remaining orders.

#### Scenario: Item removed and orders repacked
- **WHEN** an ADMIN clicks "Remover" on a TrailItem
- **THEN** the item is deleted and remaining items are renumbered contiguously from 1

### Requirement: Reorder trail items
Each item row SHALL have up and down arrow buttons to shift its position within the trail.

#### Scenario: Move item up
- **WHEN** an ADMIN clicks the up arrow on an item at position N > 1
- **THEN** the item moves to position N-1 and the previous item at N-1 moves to N

#### Scenario: First item has no up arrow
- **WHEN** an item is at position 1
- **THEN** the up arrow button is disabled or hidden

#### Scenario: Last item has no down arrow
- **WHEN** an item is at the last position
- **THEN** the down arrow button is disabled or hidden

### Requirement: Trail list links to item management
Each trail row in `/dashboard/admin?tab=trilhas` SHALL include a "Gerenciar itens" link.

#### Scenario: Link navigates to item page
- **WHEN** an ADMIN clicks "Gerenciar itens" on a trail row
- **THEN** the browser navigates to `/dashboard/admin/trilhas/[id]/itens`
