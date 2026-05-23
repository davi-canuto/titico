## ADDED Requirements

### Requirement: Analytics tab accessible only to ADMIN
The admin panel SHALL expose an "Analytics" tab at `?tab=analytics`. Access MUST be restricted to users with `role: ADMIN`. Non-admin users attempting to access this tab SHALL be redirected.

#### Scenario: Admin accesses analytics tab
- **WHEN** a user with `role: ADMIN` navigates to `/dashboard/admin?tab=analytics`
- **THEN** the analytics dashboard renders with all metric cards

#### Scenario: Non-admin access attempt
- **WHEN** a user without `role: ADMIN` accesses `/dashboard/admin`
- **THEN** they are redirected (existing admin protection applies)

### Requirement: Revenue metrics
The analytics dashboard SHALL display:
- Total accumulated revenue from `Purchase` records with `status: COMPLETED` (sum of `product.price`)
- Revenue in the last 30 days (same calculation, filtered by `createdAt >= 30 days ago`)
- Count of purchases by status: COMPLETED, PENDING, REFUNDED

All monetary values SHALL be formatted in BRL (R$ X.XXX,XX).

#### Scenario: Revenue cards render
- **WHEN** the analytics tab loads
- **THEN** three cards are shown: "Receita Total", "Último Mês", and "Por Status"
- **AND** each displays the correct aggregated value from the database

### Requirement: User metrics
The analytics dashboard SHALL display:
- Total registered users (`User` count)
- New users in the last 30 days
- Conversion rate: `(users with COMPLETED Purchase / total users) × 100`, displayed as a percentage

#### Scenario: Conversion rate calculation
- **WHEN** there are 100 users and 12 have a COMPLETED purchase
- **THEN** the conversion rate displays as "12%"

### Requirement: Top 10 most watched content
The analytics dashboard SHALL display a ranked list of the 10 content items with the most unique users who have a `UserProgress` record. Each row shows: rank, content title, type, and unique viewer count, with a relative bar showing proportion to the #1 item.

#### Scenario: Content ranking
- **WHEN** content A has 50 unique viewers and content B has 30
- **THEN** content A appears first with a full-width bar and content B's bar is at 60% width

### Requirement: All metrics load in a single page render
All analytics queries SHALL execute in parallel (`Promise.all`) on the server before the page renders. There SHALL be no client-side data fetching for the analytics tab.

#### Scenario: Page load performance
- **WHEN** the analytics tab renders
- **THEN** all metric values are present in the initial HTML (no loading spinners for individual cards)
