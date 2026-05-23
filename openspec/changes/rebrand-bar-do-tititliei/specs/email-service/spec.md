## MODIFIED Requirements

### Requirement: Welcome email template
The `welcomeEmail(name: string)` function SHALL return `{ subject, html }` for a welcome message sent after first login. The subject and body SHALL use the platform name "Bar do Tititliei".

#### Scenario: Template output
- **WHEN** `welcomeEmail("Davi")` is called
- **THEN** the returned `subject` reads "Bem-vindo ao Bar do Tititliei — sua jornada começa agora"
- **THEN** the `html` greets the user by name and references "Bar do Tititliei" as the platform name
- **THEN** the email header banner displays "BAR DO TITITLIEI"
