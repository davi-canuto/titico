## MODIFIED Requirements

### Requirement: Model Product suporta calSlug para produtos de agendamento
O model `Product` SHALL ter um campo opcional `calSlug String?` para armazenar o slug do event type Cal.com associado. Isso permite que o slug seja gerenciado no banco em vez de hardcoded no código.

#### Scenario: Produto com calSlug configurado
- **WHEN** um `Product` tem `calSlug` preenchido
- **THEN** o `BookingPaymentModal` e a rota de checkout Stripe usam o `calSlug` do produto diretamente, sem fallback para constantes hardcoded no código

#### Scenario: Produto sem calSlug
- **WHEN** um `Product` não tem `calSlug`
- **THEN** o comportamento existente é mantido (sem abertura de Cal.com)
