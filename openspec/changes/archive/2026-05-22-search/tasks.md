## 1. API de busca

- [x] 1.1 Criar `src/app/api/search/route.ts` com handler `GET`
- [x] 1.2 Ler query params: `q` (string), `type` (ContentType opcional), `difficulty` (Difficulty opcional)
- [x] 1.3 Construir query Prisma com `OR` em `title`, `matchup.champion`, `build.champion` usando `contains` + `mode: 'insensitive'`
- [x] 1.4 Aplicar filtro de `type` quando presente; aplicar filtro de `difficulty` em `matchup` quando presente
- [x] 1.5 Filtrar sempre por `status: PUBLISHED, active: true`; limitar a `take: 50`
- [x] 1.6 Incluir `video: true, matchup: true` no resultado para o ContentCard renderizar corretamente
- [x] 1.7 Retornar array de conteúdos — sem autenticação necessária

## 2. Página de busca

- [x] 2.1 Criar `src/app/dashboard/buscar/page.tsx` como Client Component (`'use client'`)
- [x] 2.2 Input de texto com `autoFocus` e estado controlado
- [x] 2.3 Implementar debounce de 300ms com `useEffect` + `setTimeout` e cleanup
- [x] 2.4 Fazer `fetch('/api/search?q=...')` com `AbortController` para cancelar requests anteriores
- [x] 2.5 Renderizar resultados como grid de `ContentCard` (reutilizar componente existente)
- [x] 2.6 Exibir contagem de resultados ("X resultados para 'query'")
- [x] 2.7 Estado vazio: mensagem "Nenhum resultado para '...'" com sugestão
- [x] 2.8 Estado de loading: spinner ou shimmer enquanto fetch está em andamento
- [x] 2.9 Filter chips para `type` (Vídeo, Matchup, Build, Artigo) e `difficulty` (Fácil, Médio, Difícil)

## 3. Navbar

- [x] 3.1 Trocar o `<div>` decorativo "Buscar..." na `Navbar` por um `<Link href="/dashboard/buscar">`
- [x] 3.2 Manter o mesmo estilo visual (borda, ícone de lupa, texto muted)

## 4. Validação

- [x] 4.1 Testar busca por título de conteúdo existente — resultado aparece
- [x] 4.2 Testar busca por nome de campeão (ex: "Zed") — matchup aparece
- [x] 4.3 Testar filtro por tipo — só o tipo selecionado aparece
- [x] 4.4 Testar busca sem resultado — empty state correto
- [x] 4.5 Testar clique em "Buscar..." na navbar → navega para `/dashboard/buscar` com input focado
