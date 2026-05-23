## 1. Página de pagamentos admin

- [x] 1.1 Criar `src/app/dashboard/admin/pagamentos/page.tsx` como Server Component com guard `requireAdmin()`
- [x] 1.2 Implementar query Prisma com `findMany` em `Purchase` (join `user` e `product`), ordenado por `createdAt desc`, limitado a 20 registros, com suporte a cursor de paginação
- [x] 1.3 Implementar filtros via search params: `email` (contains, case-insensitive) e `productId` (exact match)
- [x] 1.4 Renderizar tabela com colunas: email do usuário, nome do produto, status (badge colorido), data formatada, link Stripe

## 2. Componente de badge de status

- [x] 2.1 Criar componente `PurchaseStatusBadge` (inline na página ou em `src/components/admin/`) com cores: COMPLETED → verde, PENDING → âmbar, REFUNDED → vermelho

## 3. Link ao painel Stripe

- [x] 3.1 Implementar lógica de URL Stripe: se `stripePaymentId` → `/payments/{id}`, senão → `/checkout/sessions/{stripeSessionId}`
- [x] 3.2 Renderizar link externo com `target="_blank" rel="noopener noreferrer"` e ícone SVG inline de link externo

## 4. Formulário de filtros

- [x] 4.1 Criar formulário de filtros (Client Component) com campos de texto para email e select de produto, submetendo via GET (atualiza search params)
- [x] 4.2 Buscar lista de produtos disponíveis para popular o select de filtro

## 5. Paginação

- [x] 5.1 Implementar navegação de página: botão "Próxima" passa cursor (`lastId` + `lastCreatedAt`) como search param
- [x] 5.2 Exibir ou ocultar botão "Próxima" conforme há mais registros (buscar `take: 21`, renderizar 20, verificar se há 21º)
