## ADDED Requirements

### Requirement: Criação de cobrança PIX via Woovi
`POST /api/checkout/pix` SHALL criar uma cobrança na API Woovi e retornar os dados necessários para exibição do QR code.

#### Scenario: Usuário autenticado sem acesso ativo inicia pagamento PIX
- **WHEN** um usuário autenticado sem `Purchase COMPLETED` envia `POST /api/checkout/pix` com `productId` válido
- **THEN** uma cobrança é criada na Woovi com `value` = preço do produto em centavos e `correlationID` único
- **THEN** a resposta é `201 { correlationID, qrCodeImage, brCode }`

#### Scenario: Produto não encontrado
- **WHEN** o `productId` não corresponde a um `Product` ativo
- **THEN** a resposta é `400 { error: "PRODUCT_NOT_FOUND" }`

#### Scenario: Usuário já possui acesso
- **WHEN** o usuário já tem `Purchase` com `status: COMPLETED` para o produto
- **THEN** a resposta é `409 { error: "ALREADY_PURCHASED" }`

#### Scenario: Request sem autenticação
- **WHEN** o request não possui sessão válida
- **THEN** a resposta é `401 { error: "UNAUTHORIZED" }`

### Requirement: Polling de status da cobrança PIX
`GET /api/checkout/pix/status` SHALL retornar o status atual de uma cobrança Woovi.

#### Scenario: Cobrança aguardando pagamento
- **WHEN** `GET /api/checkout/pix/status?correlationID=xxx` é chamado e a cobrança está `ACTIVE`
- **THEN** a resposta é `200 { status: "ACTIVE" }`

#### Scenario: Pagamento confirmado
- **WHEN** a cobrança está `COMPLETED` na Woovi
- **THEN** a resposta é `200 { status: "COMPLETED" }`

#### Scenario: Cobrança expirada
- **WHEN** a cobrança está `EXPIRED`
- **THEN** a resposta é `200 { status: "EXPIRED" }`

#### Scenario: correlationID ausente
- **WHEN** o parâmetro `correlationID` não é fornecido
- **THEN** a resposta é `400 { error: "MISSING_CORRELATION_ID" }`

### Requirement: Webhook de confirmação Woovi
`POST /api/woovi/webhook` SHALL receber notificações da Woovi, verificar a assinatura e criar o `Purchase` no banco.

#### Scenario: Webhook de pagamento confirmado com assinatura válida
- **WHEN** Woovi envia `POST /api/woovi/webhook` com `X-Woovi-Signature` válido e evento de charge `COMPLETED`
- **THEN** o handler extrai `userId` e `productId` do `correlationID`, faz upsert do `Purchase` com `status: COMPLETED` e retorna `200`

#### Scenario: Webhook com assinatura inválida
- **WHEN** o header `X-Woovi-Signature` não corresponde ao HMAC-SHA256 esperado
- **THEN** a resposta é `401` e nenhuma alteração é feita no banco

#### Scenario: Webhook de evento não relevante
- **WHEN** o payload não corresponde a um charge `COMPLETED`
- **THEN** a resposta é `200` sem nenhuma ação (ignore gracioso)

### Requirement: Exibição de QR code PIX no modal
O modal de pagamento SHALL exibir o QR code e o código copia-e-cola quando PIX é selecionado, com feedback de status em tempo real via polling.

#### Scenario: Usuário seleciona PIX
- **WHEN** o usuário clica no botão PIX no modal
- **THEN** o modal exibe um spinner enquanto a cobrança é criada
- **THEN** ao receber resposta `201`, exibe a imagem do QR code e o botão "Copiar código PIX"

#### Scenario: Usuário copia o código PIX
- **WHEN** o usuário clica em "Copiar código PIX"
- **THEN** o `brCode` é copiado para a área de transferência e o botão exibe confirmação visual por 2 segundos

#### Scenario: Pagamento confirmado durante polling
- **WHEN** o polling detecta `status: "COMPLETED"`
- **THEN** o modal exibe mensagem de sucesso e redireciona para `/checkout/sucesso`

#### Scenario: Cobrança expirada durante polling
- **WHEN** o polling detecta `status: "EXPIRED"`
- **THEN** o modal exibe mensagem de erro com botão para gerar nova cobrança

#### Scenario: Erro ao criar cobrança
- **WHEN** `POST /api/checkout/pix` retorna erro
- **THEN** o modal exibe mensagem de erro inline e permite nova tentativa
