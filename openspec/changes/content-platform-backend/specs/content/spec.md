## ADDED Requirements

### Requirement: Content platform schema
All models, enums, and relations defined in `openspec/specs/content/spec.md` SHALL be added to `prisma/schema.prisma` in this change.

#### Scenario: Schema migration succeeds
- **WHEN** `prisma migrate dev` is run after the schema changes
- **THEN** all new tables are created with correct constraints and no existing data is affected
