## Context

O lobby já busca `continueWatching` (UserProgress com watchedSeconds) e `trails` com itens. O que falta é: (1) contar `completedAt IS NOT NULL` por trilha e no total, e (2) exibir esses números na UI. Nenhuma mudança de schema — `completedAt` já existe em `UserProgress`.

## Goals / Non-Goals

**Goals:**
- Progresso total: "X de Y concluídos" + barra percentual no hero
- Progresso por trilha: "X/Y" ao lado do título de cada trilha

**Non-Goals:**
- Badges, conquistas, streaks
- Progresso por vídeo (watchedSeconds como %) — só completedAt conta
- Histórico ou timeline de progresso

## Decisions

### D1: Nova função `getUserOverallProgress` no trail service

Faz duas queries em paralelo: `prisma.userProgress.count({ where: { userId, completedAt: { not: null } } })` para completados, e conta total de conteúdos PUBLISHED acessíveis ao usuário. Retorna `{ completed: number, total: number }`.

### D2: Progresso por trilha via include no `getActiveTrails`

Adicionar um parâmetro opcional `userId` em `getActiveTrails`. Se fornecido, faz um segundo `findMany` de `UserProgress` para os contentIds das trilhas e retorna `completedCount` junto com cada trilha. Sem N+1 — uma única query de progress para todos os contentIds.

### D3: Barra de progresso sem biblioteca

Uma `<div>` com largura dinâmica via `style={{ width: \`${pct}%\` }}` e `bg-[#e3001b]`. Sem biblioteca de charts ou animação.

## Risks / Trade-offs

- **[Trade-off] Total inclui conteúdos que o usuário pode não ter acesso** → Para MVP, contar todos os PUBLISHED. É simples e honesto — o usuário vê o universo total, não só o que comprou.
- **[Risco] Query lenta se muitos conteúdos** → Mitigação: ambas as queries usam índices existentes (userId + completedAt).
