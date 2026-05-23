## Why

A navbar já tem um placeholder "Buscar..." mas não há rota, página ou lógica de busca. Usuários com acesso a muitos matchups, builds e vídeos não têm como encontrar conteúdo específico sem navegar por trilhas manualmente. A busca é o caminho mais rápido para conteúdo de alta intenção (ex: "Zed matchup", "build AD").

## What Changes

- Página `/dashboard/buscar` com input focado e resultados em tempo real
- A navbar "Buscar..." passa a ser um botão que navega para `/dashboard/buscar` (ou abre modal em desktop)
- Busca full-text no banco via Prisma (`contains`, case-insensitive) em `title`, `champion` (matchup/build) e `type`
- Filtros na página: tipo de conteúdo (Vídeo, Matchup, Build, Artigo), dificuldade (para matchups)
- Resultados exibidos como cards com ContentCard existente
- `GET /api/search?q=...&type=...&difficulty=...` — rota de API para busca server-side com debounce no cliente

## Capabilities

### New Capabilities

- `search`: Define o contrato de busca de conteúdo — campos pesquisáveis, filtros disponíveis, formato de resposta da API, e comportamento da UI (debounce, estado vazio, estado sem resultados).

### Modified Capabilities

- `dashboard`: O componente Navbar passa a ter o placeholder como link/botão ativo para `/dashboard/buscar` em vez de elemento decorativo.

## Impact

- `src/app/dashboard/buscar/page.tsx` (novo): página de busca com input e resultados
- `src/app/api/search/route.ts` (novo): `GET` handler com query params
- `src/components/platform/Navbar.tsx`: placeholder passa a ser link/botão
- Nenhuma mudança de schema Prisma — busca usa campos existentes (`title`, `champion`, `type`, `status`, `active`)
