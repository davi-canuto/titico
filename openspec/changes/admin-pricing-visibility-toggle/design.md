## Context

A landing page em `#pricing` usa `PricingSection.tsx` para buscar produtos com `active: true` via `prisma.product.findMany`. Não existe distinção entre "produto ativo" e "produto visível no pricing". O admin já pode ativar/desativar produtos globalmente em `/admin/produtos`, mas isso remove o produto de todas as superfícies — inclusive de links diretos e do checkout. O objetivo é granularidade: aparecer ou não no grid da landing page, sem impactar o produto em si.

## Goals / Non-Goals

**Goals:**
- Campo `showOnPricing` no modelo `Product` controlado pelo admin via toggle
- `PricingSection.tsx` aplica `showOnPricing: true` no filtro da query
- Server action dedicada para alternar o campo
- Toggle visível na lista e/ou página de edição de produtos no admin

**Non-Goals:**
- Não altera o endpoint `/api/products` (continua filtrando só por `active`)
- Não afeta `/planos` (página dedicada de planos continua exibindo todos os produtos ativos)
- Não introduz ordenação ou agrupamento de produtos no pricing
- Não adiciona autenticação extra — usa o guard de admin já existente

## Decisions

**Campo no banco vs. configuração de ambiente**
Opção escolhida: campo `showOnPricing Boolean @default(true)` na tabela `Product`.
Alternativa descartada: variável de ambiente com lista de slugs — não editável pelo admin sem redeploy, e quebraria o princípio de configuração via UI.

**Server action separada vs. reusar `toggleProduct`**
Opção escolhida: nova action `toggleProductOnPricing(productId: string)`.
Alternativa descartada: estender `toggleProduct` com um segundo parâmetro — acoplamento indesejado; a action existente lida com `active`, não com visibilidade de surface.

**UI: toggle na lista vs. página de edição**
Opção escolhida: toggle inline na lista de produtos (`/admin/produtos`) com `revalidatePath` imediato. Pode-se adicionar também na página de edição na mesma tarefa se trivial, mas a lista é o ponto principal.

## Risks / Trade-offs

- **Migração com dados existentes**: `@default(true)` garante que todos os produtos atuais apareçam no pricing após a migração — comportamento idêntico ao atual. Risco: zero.
- **Cache stale**: `PricingSection` é um Server Component; `revalidatePath("/")` na action invalida o cache da landing. Incluir `revalidatePath("/")` na nova action.
- **Inconsistência visual**: admin desativa um produto (`active: false`) mas `showOnPricing` continua `true` — não causa problema pois o filtro aplica `AND`. Documentar no UI que `showOnPricing` só tem efeito se `active: true`.

## Migration Plan

1. Criar migração Prisma: `ALTER TABLE "Product" ADD COLUMN "showOnPricing" BOOLEAN NOT NULL DEFAULT true`
2. Deploy sem alteração de comportamento (default `true`)
3. Admin ajusta os toggles via UI
4. Rollback: reverter migração remove a coluna; `PricingSection` volta a filtrar só por `active`
