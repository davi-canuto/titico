## ADDED Requirements

### Requirement: Exibição inline do PDF após pagamento PIX confirmado
Quando o polling do `PdfPaymentModal` detecta `status: COMPLETED`, o modal SHALL exibir uma view `success` com o link de download e a senha do PDF, sem redirecionar o usuário para outra página.

#### Scenario: Pagamento detectado como COMPLETED
- **WHEN** a rota `GET /api/checkout/pix/status` retorna `{ status: "COMPLETED", downloadUrl, downloadPassword }`
- **THEN** o modal para o polling, troca para a view `success` e exibe o `downloadUrl` como link clicável e o `downloadPassword` como texto copiável

#### Scenario: Produto PDF sem dados de entrega configurados
- **WHEN** `downloadUrl` ou `downloadPassword` são nulos na resposta
- **THEN** o modal exibe mensagem de erro indicando que o produto não está disponível para download e orienta o usuário a entrar em contato

### Requirement: Botão de cópia da senha do PDF
O modal SHALL oferecer um botão para copiar a `downloadPassword` para a área de transferência.

#### Scenario: Usuário clica em copiar senha
- **WHEN** o usuário clica no botão "Copiar senha"
- **THEN** a senha é copiada para o clipboard e o botão exibe feedback visual de confirmação por 2 segundos
