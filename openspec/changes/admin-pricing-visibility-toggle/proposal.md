## Why

A seção `#pricing` da landing page exibe todos os produtos ativos, mas o admin precisa controlar quais aparecem ali sem desativar o produto globalmente — produtos fora do pricing ainda precisam ser acessíveis via link direto. Hoje não existe esse controle granular.

## What Changes

- Novo campo booleano `showOnPricing` no modelo `Product` (padrão `true` para retrocompatibilidade)
- A `PricingSection` da landing page filtra produtos por `showOnPricing: true` além de `active: true`
- O painel admin de produtos exibe um toggle "Exibir no Pricing" por produto
- Nova server action `toggleProductOnPricing(productId)` para persistir a mudança
- Ao desativar o toggle de um produto, ele desaparece do grid `#pricing` sem afetar o acesso via link direto ou o checkout

## Capabilities

### New Capabilities
- `admin-pricing-visibility`: Toggle por produto que controla se ele aparece na seção `#pricing` da landing page, independente do campo `active`

### Modified Capabilities
- `products`: O requisito de listagem pública passa a filtrar também por `showOnPricing: true` na landing page (o endpoint `/api/products` permanece inalterado — filtra só por `active`)

## Impact

- **Banco de dados**: migração Prisma para adicionar `showOnPricing Boolean @default(true)` em `Product`
- **`src/components/landing/PricingSection.tsx`**: query adiciona `showOnPricing: true` ao filtro
- **`src/lib/admin-actions.ts`**: nova action `toggleProductOnPricing`
- **`src/app/admin/produtos/`**: UI do toggle nas páginas de edição/lista de produtos
- **`src/app/planos/page.tsx`**: não afetado (página de planos exibe todos os produtos ativos)
