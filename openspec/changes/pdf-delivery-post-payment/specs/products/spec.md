## MODIFIED Requirements

### Requirement: Produto suporta campos de entrega digital
O modelo `Product` SHALL aceitar os campos opcionais `downloadUrl` e `downloadPassword` para produtos do tipo PDF ou digital.

#### Scenario: Produto PDF com entrega configurada
- **WHEN** um `Product` tem `downloadUrl` e `downloadPassword` preenchidos
- **THEN** esses campos são retornados pela rota de status PIX ao confirmar o pagamento

#### Scenario: Produto de plataforma sem entrega digital
- **WHEN** um `Product` não tem `downloadUrl` nem `downloadPassword` (valores nulos)
- **THEN** o comportamento de checkout existente não é afetado
