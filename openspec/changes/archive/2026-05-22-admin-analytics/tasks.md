## 1. Queries de métricas

- [x] 1.1 Adicionar branch `activeTab === 'analytics'` na `AdminPage` para executar queries só quando necessário
- [x] 1.2 Implementar `Promise.all` com as queries paralelas:
  - Receita total: `prisma.purchase.findMany({ where: { status: COMPLETED }, include: { product: true } })` → somar `product.price`
  - Receita último mês: mesma query com `createdAt: { gte: 30DaysAgo }`
  - Contagem por status: `prisma.purchase.groupBy({ by: ['status'], _count: true })`
  - Total de usuários: `prisma.user.count()`
  - Novos usuários (30d): `prisma.user.count({ where: { createdAt: { gte: 30DaysAgo } } })`
  - Usuários com acesso: `prisma.purchase.count({ where: { status: COMPLETED } })`
  - Top conteúdos: `prisma.userProgress.groupBy({ by: ['contentId'], _count: { userId: true }, orderBy: ..., take: 10 })` + buscar títulos dos conteúdos

## 2. Aba Analytics no admin

- [x] 2.1 Adicionar "Analytics" nas tabs da `AdminPage` (junto com "Conteúdos" e "Trilhas")
- [x] 2.2 Renderizar a seção de analytics quando `activeTab === 'analytics'`

## 3. Cards de receita

- [x] 3.1 Card "Receita Total" — valor formatado em BRL
- [x] 3.2 Card "Último Mês" — valor formatado em BRL
- [x] 3.3 Card "Compras" — breakdown por status: X completadas, Y pendentes, Z reembolsadas
- [x] 3.4 Card "Taxa de Conversão" — percentual com 1 casa decimal

## 4. Cards de usuários

- [x] 4.1 Card "Total de Usuários" com contagem e variação (novos nos últimos 30d)
- [x] 4.2 Card "Novos (30d)" com contagem

## 5. Ranking de conteúdos

- [x] 5.1 Tabela/lista top 10 com rank, título, tipo e número de viewers únicos
- [x] 5.2 Barra de progresso CSS relativa ao #1 (`width: (count / maxCount * 100)%`)
- [x] 5.3 Badge de tipo (Vídeo, Matchup, etc.) em cada linha

## 6. Validação

- [x] 6.1 Verificar que a aba "Analytics" aparece no admin e carrega sem erros
- [x] 6.2 Verificar que métricas refletem os dados do banco (conferir com seed)
- [x] 6.3 Verificar que abas "Conteúdos" e "Trilhas" continuam funcionando normalmente
