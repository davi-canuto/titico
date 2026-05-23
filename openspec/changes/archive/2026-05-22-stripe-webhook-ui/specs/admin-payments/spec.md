## ADDED Requirements

### Requirement: Admin payments page
A rota `/dashboard/admin/pagamentos` SHALL exibir a lista paginada de `Purchase`s com seus status, usuário, produto e links ao painel Stripe. Acesso restrito a usuários com role `ADMIN`.

#### Scenario: Admin acessa a página sem filtros
- **WHEN** um usuário `ADMIN` navega para `/dashboard/admin/pagamentos`
- **THEN** a página exibe todas as `Purchase`s em ordem decrescente de `createdAt`, com colunas: email do usuário, nome do produto, status, data, link Stripe

#### Scenario: Filtro por email
- **WHEN** o admin preenche o campo de email e submete
- **THEN** apenas `Purchase`s cujo `user.email` contenha o valor informado são exibidas

#### Scenario: Filtro por produto
- **WHEN** o admin seleciona um produto no filtro
- **THEN** apenas `Purchase`s com o `productId` correspondente são exibidas

#### Scenario: Paginação
- **WHEN** há mais de 20 registros
- **THEN** a página exibe os 20 mais recentes e oferece navegação para a próxima página via cursor

#### Scenario: Não-admin tenta acessar
- **WHEN** um usuário sem role `ADMIN` navega para `/dashboard/admin/pagamentos`
- **THEN** é redirecionado para `/dashboard`

### Requirement: Link ao painel Stripe
Cada linha de `Purchase` SHALL incluir um link externo ao painel Stripe correspondente.

#### Scenario: Purchase com stripePaymentId preenchido
- **WHEN** a `Purchase` tem `stripePaymentId` definido
- **THEN** o link aponta para `https://dashboard.stripe.com/payments/{stripePaymentId}`

#### Scenario: Purchase sem stripePaymentId
- **WHEN** a `Purchase` não tem `stripePaymentId` (status PENDING)
- **THEN** o link aponta para `https://dashboard.stripe.com/checkout/sessions/{stripeSessionId}`

### Requirement: Indicação visual de status
Cada status de `Purchase` SHALL ter uma cor de badge diferenciada.

#### Scenario: Status COMPLETED
- **WHEN** `status === "COMPLETED"`
- **THEN** o badge é exibido em verde

#### Scenario: Status PENDING
- **WHEN** `status === "PENDING"`
- **THEN** o badge é exibido em amarelo/âmbar

#### Scenario: Status REFUNDED
- **WHEN** `status === "REFUNDED"`
- **THEN** o badge é exibido em vermelho
