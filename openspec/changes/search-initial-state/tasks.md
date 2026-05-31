## 1. API — parâmetro limit

- [x] 1.1 Em `src/app/api/search/route.ts`, ler `searchParams.get("limit")` e parsear para `number` (default `50`, máximo `50`)
- [x] 1.2 Passar `take: limit` para o `prisma.content.findMany`

## 2. Página buscar — estado inicial

- [x] 2.1 Em `src/app/lobby/buscar/page.tsx`, adicionar estado `const [recent, setRecent] = useState<SearchResult[]>([])`
- [x] 2.2 Adicionar `useEffect(() => { fetch('/api/search?q=&limit=8').then(r => r.json()).then(setRecent) }, [])` para carregar uma vez no mount
- [x] 2.3 Substituir o bloco de "Initial state" atual (ícone + "Digite para buscar") por:
  - Se `recent.length > 0`: label `"Conteúdos recentes"` em `text-xs uppercase tracking-[0.25em] font-semibold text-white/40 mb-4` + grid com os cards
  - Se `recent.length === 0` (ainda carregando): manter o spinner ou silêncio (sem flash de tela vazia)
- [x] 2.4 Garantir que quando `hasQuery` é `true`, o grid de recentes NÃO aparece (só `results`)

## 3. Verificação

- [x] 3.1 Acessar `/lobby/buscar` sem digitar nada e confirmar que conteúdos recentes aparecem
- [x] 3.2 Digitar algo e confirmar que os recentes somem e os resultados da busca aparecem
- [x] 3.3 Limpar o campo e confirmar que os recentes voltam
- [x] 3.4 Aplicar um filtro de tipo com campo vazio e confirmar que mostra resultados filtrados (não os recentes)
