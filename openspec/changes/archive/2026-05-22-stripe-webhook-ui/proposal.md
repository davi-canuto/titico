## Why

Hoje não há visibilidade sobre o histórico de pagamentos e o estado das `Purchase`s — admins precisam acessar diretamente o painel do Stripe para investigar problemas. Uma página admin dedicada reduz esse atrito e centraliza o diagnóstico.

## What Changes

- Nova rota `/dashboard/admin/pagamentos` com tabela de `Purchase`s e seus status (`PENDING`, `COMPLETED`, `REFUNDED`)
- Filtros por usuário (email) e por produto
- Link direto para o painel Stripe de cada sessão/pagamento
- Proteção por role admin (apenas usuários `isAdmin: true` acessam)

## Capabilities

### New Capabilities
- `admin-payments`: Página admin para visualizar e filtrar o histórico de Purchases com links ao painel Stripe

### Modified Capabilities
- `stripe-webhook`: Nenhuma mudança de requisito — a tabela de Purchases já é populada pelo webhook existente

## Impact

- Nova página Server Component em `src/app/dashboard/admin/pagamentos/`
- Lê da tabela `Purchase` (Prisma) com joins em `User` e `Product`
- Depende de `isAdmin` no model `User` (já presente em `src/lib/admin.ts`)
- Sem novas dependências externas
