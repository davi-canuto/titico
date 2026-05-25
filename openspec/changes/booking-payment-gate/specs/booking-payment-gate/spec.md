## ADDED Requirements

### Requirement: Modal de pagamento obrigatório antes do agendamento
O componente `BookingPaymentModal` SHALL ser exibido ao clicar em "Agendar" para Coaching 1:1 ou Análise de Partida, oferecendo PIX e cartão como formas de pagamento antes de liberar o agendamento no Cal.com.

#### Scenario: Usuário não autenticado clica em Agendar
- **WHEN** um usuário sem sessão clica em "Agendar"
- **THEN** o modal fecha e redireciona para `/login?callbackUrl=/`

#### Scenario: Usuário autenticado clica em Agendar
- **WHEN** um usuário com sessão clica em "Agendar"
- **THEN** o `BookingPaymentModal` abre exibindo as opções PIX e Cartão de Crédito

### Requirement: Fluxo PIX abre Cal.com após confirmação
Após o pagamento PIX ser confirmado via polling, o modal SHALL abrir o Cal.com inline via `cal('modal', { calLink: slug })` sem redirecionar o usuário para outra página.

#### Scenario: Pagamento PIX confirmado
- **WHEN** o polling da rota `/api/checkout/pix/status` retorna `status: "COMPLETED"`
- **THEN** o modal para o polling e abre o calendário Cal.com do serviço correspondente via `cal('modal')`

#### Scenario: QR Code expirado
- **WHEN** o timeout de 10 minutos é atingido sem confirmação de pagamento
- **THEN** o modal exibe a view de expiração com opção de gerar novo QR code

### Requirement: Fluxo Stripe inclui calSlug na URL de sucesso
Ao criar uma sessão Stripe para produto de agendamento, o `success_url` SHALL incluir o param `calSlug` com o slug do evento Cal.com correspondente ao produto.

#### Scenario: Checkout Stripe para Coaching 1:1
- **WHEN** a sessão Stripe é criada para `prod_coaching_1x1`
- **THEN** o `success_url` contém `calSlug=davi-alessandro-fsfg2x%2Fcoach-1-1`

#### Scenario: Checkout Stripe para Análise de Partida
- **WHEN** a sessão Stripe é criada para `prod_analise_de_partida`
- **THEN** o `success_url` contém o `calSlug` do event type de análise

#### Scenario: Produto sem calSlug mapeado
- **WHEN** a sessão Stripe é criada para um produto sem mapeamento de slug
- **THEN** o `success_url` não inclui o param `calSlug` e o comportamento existente é mantido
