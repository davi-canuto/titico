## Why

O dashboard não mostra ao usuário quanto já avançou — não há nenhum número de conteúdos completados, nenhum percentual por trilha. O aluno não sabe se está no início, meio ou fim do material, o que reduz engajamento e sensação de progresso.

## What Changes

- A seção hero do lobby exibe um contador simples: "X de Y conteúdos concluídos" com barra de progresso geral
- Cada trilha no dashboard exibe o percentual de conclusão (ex: "4/12 concluídos") ao lado do título
- "Concluído" = `UserProgress.completedAt IS NOT NULL` para aquele conteúdo
- Sem gamificação, badges ou streaks — só os números

## Capabilities

### New Capabilities

- `progress-overview`: Exibição de progresso geral e por trilha no dashboard do usuário

### Modified Capabilities

(nenhuma)

## Impact

- **Modificado:** `src/services/trail.service.ts` — `getActiveTrails` passa a incluir `completedAt` no progress, e nova função `getUserOverallProgress(userId)` retorna total completado e total disponível
- **Modificado:** `src/app/lobby/page.tsx` — busca progresso geral e passa para componentes
- **Modificado:** `src/components/platform/TrailRow.tsx` — exibe "X/Y concluídos" por trilha
- **Modificado:** hero do lobby — exibe contador e barra de progresso geral
