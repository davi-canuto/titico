## Why

O painel admin atual (`/dashboard/admin`) só lista e gerencia conteúdos e trilhas — o administrador não tem visibilidade sobre o negócio: quanto está sendo gerado em receita, quantos usuários converteram, quais conteúdos estão sendo mais assistidos. Sem essas métricas, decisões de conteúdo e precificação são baseadas em intuição.

## What Changes

- Nova aba "Analytics" no painel admin com métricas agrupadas em cards e gráficos simples
- **Receita**: total acumulado, receita do último mês, número de compras por status (COMPLETED, REFUNDED, PENDING)
- **Usuários**: total, novos nos últimos 30 dias, taxa de conversão (usuários com Purchase COMPLETED / total)
- **Conteúdos mais assistidos**: ranking por `UserProgress` — top 10 conteúdos por número de usuários únicos que os assistiram
- **Funil de conversão**: visitantes → cadastrados → compradores (com os dados disponíveis no banco)
- Sem biblioteca de gráficos externa — números em cards e barras simples com CSS/Tailwind

## Capabilities

### New Capabilities

- `admin-analytics`: Define quais métricas são calculadas, como são agrupadas, frequência de atualização (on-demand, sem cache nesta iteração), e quem pode acessar (role ADMIN only).

### Modified Capabilities

- `admin-panel`: A página admin ganha uma nova aba "Analytics" no sistema de tabs existente (`?tab=analytics`).

## Impact

- `src/app/dashboard/admin/page.tsx`: adiciona query de analytics e aba "Analytics" nas tabs
- `src/lib/admin-actions.ts` ou queries inline: cálculos de métricas via Prisma aggregations (`_count`, `_sum`)
- Nenhuma dependência nova — sem bibliotecas de gráficos externas
- Nenhuma mudança de schema Prisma
