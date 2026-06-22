## MODIFIED Requirements

### Requirement: Checkout initiation for authenticated users
O sistema SHALL permitir que usuários autenticados iniciem uma Stripe Checkout Session pela página `/planos` ou pelo modal de pagamento `PdfPaymentModal`. Quando o usuário já possui o produto, o sistema exibe um estado informativo com opção de recompra — não um estado de erro.

#### Scenario: Authenticated user clicks "Comprar"
- **WHEN** um usuário com sessão ativa clica "Comprar" em um card de produto
- **THEN** o botão entra em estado de carregamento (desabilitado, spinner visível)
- **THEN** o cliente chama `POST /api/checkout/session` com o `productId`
- **THEN** em sucesso (`{ checkoutUrl }`), o browser é redirecionado para `checkoutUrl`

#### Scenario: API retorna erro durante checkout
- **WHEN** `POST /api/checkout/session` retorna resposta não-2xx (exceto 409)
- **THEN** o botão volta ao estado padrão
- **THEN** uma mensagem de erro inline é exibida: "Erro ao iniciar o pagamento. Tente novamente."

#### Scenario: User already has active access — estado informativo
- **WHEN** `POST /api/checkout/session` retorna `409 ALREADY_PURCHASED`
- **THEN** o modal/card exibe uma mensagem informativa (não de erro): "Você já possui este produto."
- **THEN** um botão "Comprar mesmo assim" é exibido abaixo da mensagem
- **WHEN** o usuário clica "Comprar mesmo assim"
- **THEN** o cliente chama `POST /api/checkout/session` novamente com `force: true`
- **THEN** em sucesso, o browser é redirecionado para `checkoutUrl`

## ADDED Requirements

### Requirement: Botão Pix condicional por SiteConfig em todos os modais de pagamento
O `PdfPaymentModal`, o `BookingPaymentModal` e qualquer outra surface de checkout da landing page SHALL ocultar o botão/opção de Pix quando `SiteConfig.pixEnabled = false`. A prop `pixEnabled: boolean` é passada pelo Server Component pai para cada modal.

#### Scenario: Pix habilitado — botão visível no PdfPaymentModal
- **WHEN** `SiteConfig.pixEnabled = true` e o `PdfPaymentModal` é aberto
- **THEN** o botão "PIX" é exibido normalmente

#### Scenario: Pix desabilitado — botão oculto no PdfPaymentModal
- **WHEN** `SiteConfig.pixEnabled = false` e o `PdfPaymentModal` é aberto
- **THEN** o botão "PIX" não é renderizado; apenas o botão de cartão de crédito aparece

#### Scenario: Pix habilitado — botão visível no BookingPaymentModal
- **WHEN** `SiteConfig.pixEnabled = true` e o `BookingPaymentModal` é aberto
- **THEN** o botão "PIX" é exibido normalmente

#### Scenario: Pix desabilitado — botão oculto no BookingPaymentModal
- **WHEN** `SiteConfig.pixEnabled = false` e o `BookingPaymentModal` é aberto
- **THEN** o botão "PIX" não é renderizado; apenas o botão de cartão de crédito aparece

#### Scenario: Pix desabilitado — landing page sem menções
- **WHEN** `SiteConfig.pixEnabled = false` e a landing page é renderizada
- **THEN** badges, ícones ou textos referenciando "Pix" na `PricingSection` não são exibidos
