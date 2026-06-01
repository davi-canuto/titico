## 1. Componente RevenueChart

- [x] 1.1 Criar `src/components/admin/RevenueChart.tsx` como Client Component (`'use client'`)
- [x] 1.2 Props: `purchases: { createdAt: Date; price: number }[]`
- [x] 1.3 Estado interno: `const [view, setView] = useState<'week' | 'month'>('week')`
- [x] 1.4 Implementar função `groupByWeek(purchases)` que retorna array de `{ label: string; total: number }` para as últimas 8 semanas (semana começa na segunda)
- [x] 1.5 Implementar função `groupByMonth(purchases)` que retorna array de `{ label: string; total: number }` para os últimos 6 meses
- [x] 1.6 Renderizar SVG de barras:
  - Container `<svg width="100%" height="200">` com `viewBox="0 0 ${W} 200"` onde W = nBars × (barWidth + gap)
  - Calcular `maxValue = Math.max(...bars.map(b => b.total), 1)` (mínimo 1 para evitar divisão por zero)
  - Cada barra: `<rect x={...} y={200 - height} width={barWidth} height={height} fill="#e3001b" rx="3" />`
  - Label embaixo: `<text>` com o label da semana/mês
  - `<title>R$ {formatBRL(bar.total)}</title>` dentro de cada `<rect>` para tooltip nativo
- [x] 1.7 Toggle: dois botões "Semanas" / "Meses" acima do gráfico

## 2. Integração na página admin

- [x] 2.1 Em `src/app/admin/page.tsx`, garantir que `completedPurchases` inclui `{ createdAt: true }` no select (já existe — verificar)
- [x] 2.2 Importar `RevenueChart` e inserir logo abaixo dos cards de totais na aba analytics
- [x] 2.3 Passar `purchases={completedPurchases.map(p => ({ createdAt: p.createdAt, price: p.product.price }))}` como prop

## 3. Verificação

- [x] 3.1 Acessar aba Analytics e confirmar que o gráfico aparece com barras
- [x] 3.2 Clicar em "Meses" e confirmar que o gráfico muda para visão mensal
- [x] 3.3 Hover em uma barra e confirmar tooltip com valor em R$
