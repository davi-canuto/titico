## MODIFIED Requirements

### Requirement: Welcome email template
The `welcomeEmail(name: string)` function SHALL return `{ subject, html }` for a welcome message sent after first login. The subject and body SHALL use the platform name "Sindicato do Titiltei" and describe the full product catalog (módulos, análises, coaching).

#### Scenario: Template output
- **WHEN** `welcomeEmail("Davi")` is called
- **THEN** the returned `subject` reads "Bem-vindo ao Sindicato do Titiltei — sua jornada começa agora"
- **THEN** the `html` greets the user by name and mentions modules, análises and coaching as the platform offering
- **THEN** the email header displays "SINDICATO DO TITILTEI" in the red banner
