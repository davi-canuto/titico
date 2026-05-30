## Context

A landing já é um Server Component que faz múltiplas queries Prisma em paralelo. O padrão está estabelecido: buscar dados no `RootPage`, passar como props para componentes de apresentação. A seção nova segue exatamente esse padrão — sem nova abstração, sem API route.

## Goals / Non-Goals

**Goals:**
- Exibir até 4 conteúdos publicados na landing com link para `/preview/[contentId]`
- Custo zero de complexidade: uma query extra no `Promise.all` já existente

**Non-Goals:**
- Filtro ou seleção manual de quais conteúdos aparecer (sempre os mais recentes)
- Paginação ou "ver mais"
- Animações ou carrossel

## Decisions

### D1: Query no `RootPage`, não em componente separado

A landing já faz `Promise.all` com 3 queries. Adicionar uma quarta mantém o padrão e evita waterfall. O componente `ContentSamplesSection` recebe os dados como props e não faz fetch.

### D2: Posição da seção — após `PricingSection`

Colocar após pricing reforça a decisão de compra: o visitante vê o preço, hesita, e logo abaixo encontra amostras reais do que vai receber. Funciona como prova social imediata.

### D3: Sem seleção manual de "conteúdo destaque"

MVP usa `orderBy: { publishedAt: 'desc' }, take: 4`. Se o Titiltei quiser curar os cards no futuro, um campo `featured: Boolean` pode ser adicionado — mas não agora.

## Risks / Trade-offs

- **[Trade-off] Conteúdo mais recente nem sempre é o mais representativo** → Aceitável para MVP; curadoria pode vir depois com campo `featured`
- **[Risco] Nenhum conteúdo publicado** → Mitigação: se a query retornar array vazio, o componente não renderiza a seção (retorna `null`)
