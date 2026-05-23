## 1. Instalação e Setup

- [x] 1.1 Instalar `@tanstack/react-query` e `@tanstack/react-query-devtools`
- [x] 1.2 Criar `src/components/providers/QueryProvider.tsx` com `QueryClientProvider` e `ReactQueryDevtools` (dev only)
- [x] 1.3 Importar `QueryProvider` em `src/app/layout.tsx` envolvendo o conteúdo do body

## 2. Hooks de Dados

- [x] 2.1 Criar `src/hooks/useUserProgress.ts` com `useQuery` para buscar progresso do usuário (staleTime: 60s)
- [x] 2.2 Criar `src/hooks/useInvalidateProgress.ts` (ou util) para `invalidateQueries(['user-progress'])` após mutações

## 3. Integração com Componentes Existentes

- [x] 3.1 Avaliar `TrailRow` — se busca de progresso é client-side, migrar para `useUserProgress`
- [x] 3.2 Garantir que `SkinPicker` invalida query de skin após `updateHeroSkin` bem-sucedido

## 4. Validação

- [x] 4.1 Verificar que `next build` conclui sem erros relacionados ao QueryProvider
- [x] 4.2 Testar em dev: devtools aparecem no browser
- [x] 4.3 Testar em prod build: devtools não aparecem, bundle não inclui devtools
