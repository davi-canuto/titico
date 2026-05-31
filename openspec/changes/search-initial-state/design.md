## Context

A página de busca é um Client Component com `results: SearchResult[] | null`. O estado `null` significa "ainda não buscou nada" e hoje exibe a tela vazia. A API `/api/search?q=` já retorna os 50 conteúdos mais recentes com `q` vazio — basta aproveitar isso para o estado inicial.

## Goals / Non-Goals

**Goals:**
- Mostrar 8 conteúdos recentes quando busca está vazia e sem filtros
- Label "Conteúdos recentes" para diferenciar do resultado de busca

**Non-Goals:**
- "Conteúdos populares" (exigiria contagem de views — sem esse dado)
- Paginação ou "ver mais" no estado inicial
- Persistência da listagem inicial (recalcula a cada mount)

## Decisions

### D1: Estado separado `recent` em vez de reutilizar `results`

Adicionar `const [recent, setRecent] = useState<SearchResult[]>([])` carregado uma vez no mount. O estado `results` (busca ativa) não é contaminado. A lógica de exibição fica clara: mostrar `recent` quando `!hasQuery && results === null`, mostrar `results` quando `hasQuery`.

### D2: Reutilizar `/api/search?q=&limit=8`

A API já existe e retorna os mais recentes com `q` vazio. Adicionar suporte ao parâmetro `limit` na rota para evitar buscar 50 quando só precisamos de 8. Alternativa: buscar 50 e fatiar no cliente — mais simples mas desperdiça rede.

## Risks / Trade-offs

- **[Trade-off] `limit` na API** → Pequena adição mas evita payload desnecessário. Vale os 3 linhas de mudança.
