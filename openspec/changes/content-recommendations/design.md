## Context

O banco já tem `TrailItem` (relaciona `Trail` ↔ `Content` com `order`), `UserProgress` (rastreia o que o usuário assistiu) e `Content` (com `type`, `status`, `active`). Não há modelo de "relevância" — as recomendações são determinísticas baseadas em dados relacionais existentes.

## Goals / Non-Goals

**Goals:**
- `GET /api/contents/[slug]/recommendations` retorna até 6 conteúdos recomendados
- Algoritmo: trilha primeiro → tipo depois → popularidade global como fallback
- Excluir conteúdos já assistidos pelo usuário (`UserProgress` existente)
- Excluir o próprio conteúdo sendo visualizado
- Seção "Você pode gostar" na página de conteúdo com o grid de cards
- Autenticação opcional: sem sessão retorna recomendações por popularidade sem personalização

**Non-Goals:**
- Machine learning ou embeddings
- Recomendações baseadas em campeão específico (ex: "outros matchups do Zed")
- Atualização em tempo real / invalidação de cache

## Decisions

### Algoritmo em duas camadas

**Camada 1 — Trilha:**
Buscar trilhas que contêm o conteúdo atual (`TrailItem.contentId = currentId`). Para cada trilha, buscar os `TrailItem` ordenados por `order` onde `contentId` não está nos `UserProgress` do usuário. Tomar os primeiros resultados únicos.

**Camada 2 — Tipo:**
Se a camada 1 retornar menos que 6 resultados, complementar com conteúdos do mesmo `ContentType` que tenham mais registros de `UserProgress` (`_count`) e que o usuário ainda não assistiu.

### Rota de API, não query inline na página

`GET /api/contents/[slug]/recommendations` permite reutilização futura (ex: React Query, sidebar em outras páginas) e mantém a página de conteúdo mais simples. A página busca via Prisma diretamente no servidor (mesma abordagem das outras páginas) para o SSR inicial.

### Sem autenticação obrigatória

Se sem sessão: retorna top 6 conteúdos do mesmo tipo por popularidade (`UserProgress._count`). Se autenticado: exclui os já assistidos.

## Risks / Trade-offs

[Conteúdo sem trilha e sem tipo similar] Retorna array vazio → seção não renderiza (condicional com `recommendations.length > 0`)

[N+1 em TrailItem] Para conteúdos em múltiplas trilhas, múltiplas queries → mitigado com `Promise.all` e `take` early nas queries
