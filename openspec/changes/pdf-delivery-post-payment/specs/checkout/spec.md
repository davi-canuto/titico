## MODIFIED Requirements

### Requirement: PIX status retorna dados de entrega ao confirmar pagamento
`GET /api/checkout/pix/status?correlationID=<id>` SHALL retornar `downloadUrl` e `downloadPassword` junto ao status `COMPLETED`, quando o produto associado à compra possuir esses campos preenchidos.

#### Scenario: Status COMPLETED com produto PDF
- **WHEN** a compra identificada pelo `correlationID` tem `status: COMPLETED` e o `Product` associado tem `downloadUrl` e `downloadPassword` não nulos
- **THEN** a resposta é `{ status: "COMPLETED", downloadUrl: "<url>", downloadPassword: "<senha>" }`

#### Scenario: Status COMPLETED sem dados de entrega
- **WHEN** a compra tem `status: COMPLETED` e o `Product` não tem `downloadUrl` ou `downloadPassword`
- **THEN** a resposta é `{ status: "COMPLETED", downloadUrl: null, downloadPassword: null }`

#### Scenario: Status ACTIVE (aguardando pagamento)
- **WHEN** a compra ainda não foi paga
- **THEN** a resposta é `{ status: "ACTIVE" }` (sem campos de entrega)

#### Scenario: correlationID não encontrado
- **WHEN** nenhuma cobrança com o `correlationID` informado existe na Woovi
- **THEN** a resposta é `404 NOT_FOUND`
