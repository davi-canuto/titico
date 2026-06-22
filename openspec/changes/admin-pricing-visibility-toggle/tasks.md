## 1. Banco de dados

- [x] 1.1 Adicionar campo `showOnPricing Boolean @default(true)` ao modelo `Product` em `prisma/schema.prisma`
- [x] 1.2 Gerar e executar a migração Prisma (`prisma migrate dev --name add-show-on-pricing`)

## 2. Server Action

- [x] 2.1 Adicionar função `toggleProductOnPricing(productId: string)` em `src/lib/admin-actions.ts` que inverte `showOnPricing` e chama `revalidatePath("/")`

## 3. Landing Page

- [x] 3.1 Atualizar a query em `src/components/landing/PricingSection.tsx` para filtrar por `active: true, showOnPricing: true`

## 4. Admin UI

- [x] 4.1 Adicionar coluna/toggle "Pricing" na lista de produtos em `src/app/admin/produtos/` (ou path equivalente) que chama `toggleProductOnPricing` via form action
- [x] 4.2 Garantir feedback visual no toggle (estado otimista ou revalidação imediata) e exibir aviso inline se `active: false` mas `showOnPricing: true`
