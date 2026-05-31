## Why

O painel de analytics do admin exibe receita total e do último mês como números estáticos — não há visibilidade sobre tendência, sazonalidade ou queda. Um gráfico de barras simples por semana/mês torna imediatamente visível se as vendas estão subindo ou caindo.

## What Changes

- Aba "Analytics" do admin ganha um gráfico de barras de receita por semana (últimas 8 semanas) ou por mês (últimos 6 meses), com toggle entre as duas visões
- Os dados vêm das `Purchase` com `status: COMPLETED` já buscadas na página — sem nova query de API
- Implementação com SVG inline (sem biblioteca de charts) — simples, leve, sem dependência

## Capabilities

### New Capabilities

- `admin-revenue-chart`: Gráfico de receita temporal na aba Analytics do admin

### Modified Capabilities

(nenhuma)

## Impact

- **Novo:** `src/components/admin/RevenueChart.tsx` — Client Component com gráfico SVG de barras
- **Modificado:** `src/app/admin/page.tsx` — passa `completedPurchases` (já buscado) para `RevenueChart`; adiciona campo `createdAt` e `price` no retorno
