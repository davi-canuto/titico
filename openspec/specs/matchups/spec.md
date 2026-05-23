## ADDED Requirements

### Requirement: Free sample matchups
5 matchups are available to all authenticated users without a purchase: Viego, Diana, Jarvan IV, Kayn, Lee Sin. These have `isFree: true`.

#### Scenario: Authenticated user without purchase lists matchups
- **WHEN** `GET /api/matchups` is called by a user with no active `Purchase`
- **THEN** only the 5 free matchups are returned and `hasFullAccess: false`

#### Scenario: Authenticated user without purchase requests a free matchup
- **WHEN** `GET /api/matchups/{champion}` is called for one of the 5 free champions
- **THEN** the full matchup detail is returned

#### Scenario: Authenticated user without purchase requests a paid matchup
- **WHEN** `GET /api/matchups/{champion}` is called for a non-free champion
- **THEN** the response is `403 FORBIDDEN`

### Requirement: Full access matchups
Users with `Purchase.status: COMPLETED` see all matchups.

#### Scenario: User with active purchase lists matchups
- **WHEN** `GET /api/matchups` is called by a user with `hasAccess: true`
- **THEN** all available matchups are returned and `hasFullAccess: true`

#### Scenario: Filtering by difficulty
- **WHEN** `GET /api/matchups?difficulty=Difícil` is called
- **THEN** only matchups matching that difficulty are returned

### Requirement: Matchup data model
Matchups are stored as static data (JSON or in-code), not in the Prisma database. Each matchup includes: `champion`, `displayName`, `difficulty`, `iconUrl` (from Data Dragon CDN `https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/{champion}.png`), `estrategia[]`, `dicas[]`, optional `detalhes[]`, optional `itemSugestao`.

#### Scenario: Champion not found
- **WHEN** `GET /api/matchups/UnknownChampion` is called
- **THEN** the response is `404 NOT_FOUND`
