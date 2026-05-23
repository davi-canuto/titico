## Why

Server Components cobrem a busca inicial de dados, mas interações do cliente (filtros, paginação, invalidação após mutações) causam re-renders completos de página ou exigem prop-drilling. Adotar React Query resolve o ciclo de vida de dados assíncronos no lado cliente — cache, stale-while-revalidate, invalidação — sem reescrever os Server Components existentes.

## What Changes

- Instalar `@tanstack/react-query` e `@tanstack/react-query-devtools`
- Criar `QueryProvider` (`'use client'`) envolvendo o layout raiz
- Migrar hooks de busca no cliente (ex.: progresso, preferências de skin) para `useQuery` / `useMutation`
- Substituir invalidação manual por `queryClient.invalidateQueries` após mutações de Server Actions
- Adicionar `ReactQueryDevtools` em desenvolvimento

## Capabilities

### New Capabilities

- `client-data-cache`: Camada de cache e gerenciamento de estado assíncrono no lado cliente via React Query — prefetch, stale-while-revalidate, invalidação coordenada com Server Actions.

### Modified Capabilities

- `dashboard`: O componente de progresso ("Continue assistindo") passa a usar `useQuery` para re-busca incremental, sem recarregar a página inteira.

## Impact

- `package.json`: adiciona `@tanstack/react-query` e `@tanstack/react-query-devtools`
- `src/app/layout.tsx`: adiciona `QueryProvider`
- `src/components/platform/TrailRow.tsx` / `SkinPicker.tsx`: podem se beneficiar de queries em cache
- Nenhuma quebra de API externa; Server Components permanecem inalterados
