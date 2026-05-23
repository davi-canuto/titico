## Context

O webhook Stripe já processa eventos e persiste `Purchase`s na tabela do banco. O painel admin existente (`/dashboard/admin`) tem páginas de conteúdo e trilhas, mas nenhuma visibilidade sobre pagamentos. Admins precisam ir ao painel Stripe diretamente para investigar compras, reembolsos ou registros faltantes.

## Goals / Non-Goals

**Goals:**
- Página admin `/dashboard/admin/pagamentos` com listagem paginada de `Purchase`s
- Filtros por email do usuário e por produto
- Exibir status (`PENDING`, `COMPLETED`, `REFUNDED`), data, usuário e produto para cada registro
- Link direto para a sessão ou pagamento no painel Stripe
- Protegida por `requireAdmin()` (role `ADMIN`)

**Non-Goals:**
- Reembolsar ou cancelar pagamentos via UI (apenas leitura)
- Webhooks em tempo real / live feed
- Exportação CSV

## Decisions

### Server Component + Server Action para filtros
Filtros (email, produto) são passados como search params na URL. A página é um Server Component que lê os params e faz a query no Prisma diretamente — sem API route separada. Isso mantém consistência com o padrão das outras páginas admin do projeto.

**Alternativa descartada:** Route handler `GET /api/admin/purchases` — adiciona uma camada sem benefício, dado que a página é server-only.

### Paginação via cursor (keyset)
A tabela `Purchase` pode crescer; paginação por offset degrada em tabelas grandes. Usar cursor baseado em `createdAt` + `id` é mais eficiente.

**Alternativa descartada:** `skip`/`take` com offset — OK para volumes atuais, mas paginação por cursor é a escolha defensiva.

### Link Stripe
- Se `stripePaymentId` estiver preenchido: link para `https://dashboard.stripe.com/payments/{stripePaymentId}`
- Caso contrário: link para `https://dashboard.stripe.com/checkout/sessions/{stripeSessionId}`

## Risks / Trade-offs

- [Dados sensíveis] A página exibe emails de usuários e IDs de pagamento — acesso restrito a `ADMIN` mitiga isso. O guard `requireAdmin()` deve ser chamado antes de qualquer render de dado.
- [Schema `userId @unique`] A constraint única em `userId` na tabela `Purchase` significa que cada usuário tem no máximo uma Purchase — a listagem reflete isso (sem duplicatas por usuário).
