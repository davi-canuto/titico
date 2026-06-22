## MODIFIED Requirements

### Requirement: Stripe Checkout Session creation
`POST /api/checkout/session` cria uma Stripe Checkout Session e retorna a URL de redirect. Aceita o campo opcional `force: boolean` no body para ignorar a verificação de compra existente.

#### Scenario: Authenticated user without existing access initiates checkout
- **WHEN** um usuário com `hasAccess: false` envia `POST /api/checkout/session` com `productId` válido
- **THEN** uma Stripe Checkout Session é criada com `mode: payment`, `success_url`, `cancel_url` e `metadata.userId` + `metadata.productId`
- **THEN** a resposta é `{ checkoutUrl, sessionId }`

#### Scenario: User already has active access — sem force
- **WHEN** um usuário com uma `Purchase` de `status: COMPLETED` tenta checkout sem `force: true`
- **THEN** a resposta é `409 ALREADY_PURCHASED`

#### Scenario: User already has active access — com force
- **WHEN** um usuário com uma `Purchase` de `status: COMPLETED` envia `force: true`
- **THEN** a verificação de compra existente é ignorada, uma nova Stripe Checkout Session é criada normalmente e a resposta é `{ checkoutUrl, sessionId }`

#### Scenario: Invalid productId
- **WHEN** o `productId` no body não corresponde a nenhum `Product` ativo
- **THEN** a resposta é `400 VALIDATION_ERROR` com o array `issues` relevante

#### Scenario: Unauthenticated request
- **WHEN** uma requisição sem sessão válida chega em `POST /api/checkout/session`
- **THEN** o middleware retorna `401 UNAUTHORIZED`

## ADDED Requirements

### Requirement: Pix desabilitável via SiteConfig
`POST /api/checkout/pix` SHALL verificar `SiteConfig.pixEnabled` antes de processar. Quando `pixEnabled: false`, a rota rejeita a requisição.

#### Scenario: Pix desabilitado — requisição rejeitada
- **WHEN** `POST /api/checkout/pix` é chamado e `SiteConfig.pixEnabled = false`
- **THEN** a resposta é `503 { error: "PIX_DISABLED" }`

#### Scenario: Pix habilitado — fluxo normal
- **WHEN** `POST /api/checkout/pix` é chamado e `SiteConfig.pixEnabled = true`
- **THEN** o fluxo de cobrança Woovi segue normalmente
