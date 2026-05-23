## MODIFIED Requirements

### Requirement: Welcome email template
The `welcomeEmail(name: string)` function SHALL return `{ subject, html }` for a welcome message sent after first login. The subject and body SHALL use the platform name "Lobby do Titiltei".

#### Scenario: Template output
- **WHEN** `welcomeEmail("Davi")` is called
- **THEN** the returned `subject` reads "Bem-vindo ao Lobby do Titiltei — sua jornada começa agora"
- **THEN** the `html` greets the user by name and references "Lobby do Titiltei" as the platform name
- **THEN** the email header banner displays "LOBBY DO TITILTEI"
