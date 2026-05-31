## Context

A aba analytics já busca `completedPurchases` com `include: { product: true }`. Cada purchase tem `createdAt` e `product.price`. Todos os dados necessários para o gráfico já estão em memória — só falta agrupá-los e renderizá-los.

## Goals / Non-Goals

**Goals:**
- Gráfico de barras de receita por semana (8 semanas) e por mês (6 meses)
- Toggle entre visões
- Sem biblioteca externa

**Non-Goals:**
- Gráfico de linha ou área
- Drill-down por produto
- Export de dados

## Decisions

### D1: SVG inline com barras calculadas em JS

Calcular `maxValue`, normalizar cada barra para altura proporcional dentro de um SVG fixo (ex: 200px de altura, largura fluida). Sem `viewBox` complexo — usar coordenadas simples. Tooltip no hover via `title` HTML nativo.

### D2: Agrupamento client-side

O componente `RevenueChart` recebe `purchases: { createdAt: Date; price: number }[]` como prop e agrupa internamente por semana/mês com `Date` nativo (sem date-fns). Simples porque são no máximo 50 registros.

### D3: Toggle semana/mês via `useState`

Dois botões no topo do card. Sem rota ou searchParam — estado local no Client Component.

## Risks / Trade-offs

- **[Trade-off] SVG manual é mais verboso** → Ganha zero dependências e controle total sobre visual. Para 8-6 barras é totalmente viável.
- **[Risco] Preço em centavos** → Lembrar de dividir por 100 para exibir em R$.
