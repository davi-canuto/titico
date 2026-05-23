## Context

O app usa Prisma com PostgreSQL. A busca pode ser feita com `contains` + `mode: 'insensitive'` do Prisma (traduz para `ILIKE` no PostgreSQL). Para o catálogo atual (dezenas a centenas de conteúdos), isso é suficiente sem precisar de Elasticsearch ou pg_trgm. A página de explorar já tem filtros por tipo/dificuldade — a busca reutiliza o mesmo `ContentCard`.

## Goals / Non-Goals

**Goals:**
- `GET /api/search?q=&type=&difficulty=` — retorna conteúdos publicados e ativos que batem com os filtros
- Página `/dashboard/buscar` com input controlado, debounce de 300ms, resultados em tempo real
- Navbar "Buscar..." vira botão que navega para `/dashboard/buscar` (foca no input automaticamente)
- Busca em: `title`, `matchup.champion`, `build.champion`
- Filtros: `type` (enum ContentType), `difficulty` (enum Difficulty, apenas para matchups)
- Resultados: grid de `ContentCard` igual ao explorar, com contagem

**Non-Goals:**
- Full-text search com ranking/relevância (pg_trgm, tsvector) — ILIKE é suficiente no volume atual
- Busca em corpo de artigos ou PDFs
- Autocomplete/sugestões
- Histórico de buscas

## Decisions

### Busca via API route com URLSearchParams (não Server Action)

`GET /api/search?q=...` permite debounce no cliente sem submit de formulário. A página é `'use client'` e usa `fetch` com AbortController para cancelar requests anteriores.

*Alternativa considerada*: Server Component com searchParams — requer navegação a cada keystroke, experiência ruim. Client Component + fetch é o padrão para busca em tempo real.

### Prisma OR query com includes

```ts
prisma.content.findMany({
  where: {
    status: 'PUBLISHED', active: true,
    AND: [
      typeFilter,
      difficultyFilter,
      { OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { matchup: { champion: { contains: q, mode: 'insensitive' } } },
        { build: { champion: { contains: q, mode: 'insensitive' } } },
      ]},
    ],
  },
  include: { video: true, matchup: true },
  take: 50,
})
```

### Debounce de 300ms no cliente

`useEffect` com `setTimeout` + cleanup. Cancela fetch anterior via `AbortController` se o usuário digitar antes da resposta chegar.

### Navbar: link simples, não modal

Em vez de abrir modal (mais complexo), a navbar "Buscar..." navega para `/dashboard/buscar`. Em mobile isso é mais simples e acessível. O input recebe `autoFocus` na página.

## Risks / Trade-offs

[ILIKE sem índice = full scan] Para tabelas grandes é lento → aceitável no volume atual; adicionar `CREATE INDEX` em `content.title` é upgrade fácil depois

[Sem paginação] `take: 50` é hard limit → suficiente para MVP; paginação pode ser adicionada depois

[Flash de conteúdo] Debounce de 300ms causa pequeno delay → exibir spinner durante fetch
