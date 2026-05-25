## ADDED Requirements

### Requirement: Modal de seleção de método de pagamento para PDF
O componente `PdfPaymentModal` SHALL exibir um modal com dois botões — "Cartão de Crédito" e "PIX" — quando acionado pelo card PDF em `ProductsCTA`.

#### Scenario: Modal abre ao clicar em "Comprar"
- **WHEN** o visitante clica no botão "Comprar" do card PDF Guia Shaco AD
- **THEN** um modal overlay abre sobre a landing page com título "Como você quer pagar?", botão "Cartão de Crédito" e botão "PIX", e botão de fechar (X)

#### Scenario: Modal fecha ao clicar fora ou no X
- **WHEN** o visitante clica fora do modal ou no botão X
- **THEN** o modal fecha sem iniciar nenhum checkout

### Requirement: Checkout para usuário autenticado
Ao selecionar um método de pagamento, se o usuário tiver sessão ativa, o modal SHALL iniciar o checkout imediatamente.

#### Scenario: Usuário logado escolhe Cartão de Crédito
- **WHEN** um usuário com sessão ativa clica em "Cartão de Crédito" no modal
- **THEN** o modal exibe estado de loading, `POST /api/checkout/session` é chamado com `{ productId, paymentMethod: 'card' }`, e o browser redireciona para `checkoutUrl` retornado pelo Stripe

#### Scenario: Usuário logado escolhe PIX
- **WHEN** um usuário com sessão ativa clica em "PIX" no modal
- **THEN** o modal exibe estado de loading, `POST /api/checkout/session` é chamado com `{ productId, paymentMethod: 'pix' }`, e o browser redireciona para `checkoutUrl`

#### Scenario: Erro no checkout
- **WHEN** a criação da sessão Stripe falha (produto não encontrado, PIX indisponível, etc.)
- **THEN** o modal exibe mensagem de erro inline e os botões voltam ao estado normal (sem fechar o modal)

### Requirement: Redirecionamento para login se não autenticado
Se o usuário não tiver sessão ativa ao clicar em qualquer método de pagamento, SHALL ser redirecionado para login antes do checkout.

#### Scenario: Visitante não logado clica em qualquer método
- **WHEN** um visitante sem sessão clica em "Cartão de Crédito" ou "PIX"
- **THEN** o browser navega para `/login?callbackUrl=/` e o modal fecha

### Requirement: Produto PDF identificado via env var
O `productId` usado no checkout SHALL ser lido de `NEXT_PUBLIC_PDF_PRODUCT_ID`. Se não configurado, o botão "Comprar" é desabilitado.

#### Scenario: Env var não configurada
- **WHEN** `NEXT_PUBLIC_PDF_PRODUCT_ID` está ausente ou vazio
- **THEN** o botão "Comprar" do card PDF está desabilitado e nenhum modal é aberto
