## 1. Service — getUserOverallProgress

- [x] 1.1 Em `src/services/trail.service.ts`, adicionar função `getUserOverallProgress(userId: string): Promise<{ completed: number; total: number }>` que:
  - Busca em paralelo: `prisma.userProgress.count({ where: { userId, completedAt: { not: null } } })` e `prisma.content.count({ where: { status: 'PUBLISHED', active: true } })`
  - Retorna `{ completed, total }`

## 2. Service — progresso por trilha

- [x] 2.1 Em `src/services/trail.service.ts`, adicionar função `getTrailCompletionCounts(trails: TrailWithItems[], userId: string): Promise<Record<string, { completed: number; total: number }>>` que:
  - Coleta todos os contentIds de todas as trilhas
  - Faz uma única query `prisma.userProgress.findMany({ where: { userId, contentId: { in: allContentIds }, completedAt: { not: null } }, select: { contentId: true } })`
  - Retorna um mapa `trailId → { completed, total }` calculado a partir dos itens de cada trilha

## 3. Página lobby — buscar progresso

- [x] 3.1 Em `src/app/lobby/page.tsx`, adicionar `getUserOverallProgress(userId)` ao `Promise.all` existente
- [x] 3.2 Após buscar as trilhas, chamar `getTrailCompletionCounts(activeTrails, userId)` para obter o mapa por trilha
- [x] 3.3 Passar `overallProgress` para o hero e `trailCounts` para cada `<TrailRow>`

## 4. Hero — barra de progresso geral

- [x] 4.1 No hero do lobby (`src/app/lobby/page.tsx`), adicionar abaixo do subtítulo um bloco com:
  - Texto `"X de Y concluídos"` em `text-xs text-white/50`
  - `<div className="h-1 bg-white/10 rounded-full mt-1.5 w-40">` com `<div style={{ width: \`${pct}%\` }} className="h-full bg-[#e3001b] rounded-full" />`
- [x] 4.2 Não renderizar o bloco se `total === 0`

## 5. TrailRow — contador por trilha

- [x] 5.1 Em `src/components/platform/TrailRow.tsx`, adicionar prop `completionCount?: { completed: number; total: number }`
- [x] 5.2 Exibir `"X/Y concluídos"` ao lado do título da trilha em `text-xs text-white/40`

## 6. Verificação

- [x] 6.1 Acessar `/lobby` e confirmar que o hero exibe "X de Y concluídos" com barra
- [x] 6.2 Confirmar que cada trilha exibe o contador correto
- [x] 6.3 Marcar um conteúdo como completado e recarregar — confirmar que os números atualizam
