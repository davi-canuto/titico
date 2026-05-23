## Context

O painel admin já usa Server Component com `auth()` + verificação de role ADMIN. As tabs são controladas via `?tab=` query param. O schema tem `Purchase` (com `status`, `createdAt`, `productId`), `User` (com `createdAt`), `UserProgress` (com `watchedSeconds`, `completedAt`, `updatedAt`), e `Product` (com `price`). Todas as métricas podem ser calculadas com Prisma aggregations sem queries customizadas em SQL.

## Goals / Non-Goals

**Goals:**
- Aba "Analytics" acessível via `?tab=analytics` na página admin existente
- Cards de métricas: receita total, receita último mês, conversão, novos usuários
- Tabela top 10 conteúdos por usuários únicos que assistiram
- Barras de progresso CSS puras para visualização relativa (sem biblioteca)
- Todas as queries executadas em paralelo com `Promise.all`

**Non-Goals:**
- Gráficos de série temporal (linhas/barras por data) — requer agregação por dia, complexidade maior
- Cache ou revalidação ISR — métricas on-demand são suficientes para uso admin esporádico
- Exportação CSV — fora de escopo
- Métricas por produto específico (qual plano vende mais) — pode ser adicionado depois

## Decisions

### Prisma aggregations puras — sem SQL raw

Todas as métricas usam `prisma.model.aggregate`, `prisma.model.count`, `prisma.model.groupBy` ou `prisma.model.findMany` com `_count`. Evita SQL raw para manter type-safety e portabilidade.

```ts
// Receita total
const { _sum } = await prisma.purchase.aggregate({
  where: { status: 'COMPLETED' },
  _sum: { product: { price: true } } // via join — ou buscar purchases com product include
})

// Usuários novos nos últimos 30 dias
const newUsers = await prisma.user.count({
  where: { createdAt: { gte: thirtyDaysAgo } }
})

// Top conteúdos
const topContent = await prisma.userProgress.groupBy({
  by: ['contentId'],
  _count: { userId: true },
  orderBy: { _count: { userId: 'desc' } },
  take: 10,
})
```

### Receita calculada no banco, não via Stripe

`Purchase.product.price` (em centavos, local) é a fonte de verdade para receita. Não chamamos a Stripe API — os dados de pagamento que importam para métricas já estão no banco.

### Sem biblioteca de gráficos

Barras horizontais simples com `div` + `width: X%` + Tailwind. Evita bundle extra para uma feature admin de uso interno. Legível e consistente com o design system.

### Inline nas queries da página, não em arquivo separado

As queries de analytics são adicionadas diretamente na `AdminPage` sob o branch `activeTab === 'analytics'`. Usa short-circuit: se a aba não for analytics, nenhuma query extra é executada.

## Risks / Trade-offs

[Queries lentas com muitos UserProgress] `groupBy` em tabela grande pode ser lento → aceitável em uso admin esporádico; índice em `userProgress.contentId` já existe por constraint

[Receita pode divergir do Stripe] Se um Purchase foi criado manualmente no banco sem pagamento real → aceitável; é dado interno, não relatório financeiro oficial

[Sem intervalo de datas personalizável] Métricas são "total" ou "últimos 30 dias" fixo → suficiente para MVP; seletor de período pode ser adicionado depois
