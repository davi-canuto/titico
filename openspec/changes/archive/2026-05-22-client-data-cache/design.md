## Context

O app usa Server Components para busca inicial de dados e Server Actions para mutações. Não existe camada de cache no cliente: todo re-render ou interação que exige dados frescos (ex.: marcar progresso, mudar skin) recarrega a página inteira via router.refresh(). React Query fornece cache, deduplicação, stale-while-revalidate e invalidação coordenada sem substituir os Server Components existentes.

## Goals / Non-Goals

**Goals:**
- Instalar e configurar React Query com `QueryClientProvider` no layout raiz
- Criar hooks tipados reutilizáveis para queries do cliente (ex.: `useUserProgress`, `useUserSkin`)
- Coordenar invalidação de cache após Server Actions bem-sucedidas
- Adicionar React Query Devtools em `NODE_ENV === 'development'`

**Non-Goals:**
- Substituir Server Components por Client Components apenas para usar React Query
- Implementar SSR prefetch com `dehydrate/HydrationBoundary` nesta iteração
- Migrar todas as queries do app — apenas as que têm interatividade cliente relevante

## Decisions

### QueryClient instanciado por request no servidor, singleton no cliente

Usar `useState(() => new QueryClient(...))` dentro do `QueryProvider` garante que múltiplos requests SSR não compartilhem estado, enquanto o cliente mantém um único instance durante a sessão.

*Alternativa considerada*: singleton global — descartado porque vaza estado entre requests no servidor.

### Coordenação com Server Actions via callback `onSuccess`

Após uma Server Action mutar dados, o client component chama `queryClient.invalidateQueries({ queryKey: ['progresso'] })`. Isso mantém o cache fresco sem `router.refresh()` completo.

*Alternativa considerada*: `revalidatePath` no servidor apenas — já funciona para Server Components, mas não atualiza componentes client já montados.

### staleTime de 60s para dados de progresso

Progresso do usuário muda apenas quando ele assiste vídeos. 60s de staleTime evita re-fetches desnecessários em navegação entre páginas.

## Risks / Trade-offs

[Bundle size] React Query adiciona ~13kb gzip → mitigado por ser tree-shakeable e estar em um único provider lazy

[Divergência SSR/cliente] Se o servidor renderiza dados A e o cliente busca dados B, há flash de conteúdo → mitigado usando `initialData` passado via props dos Server Components nos primeiros renders

[Over-engineering para escala atual] Com poucos dados dinâmicos hoje, o ganho é pequeno → mitigado limitando a adoção aos casos com interatividade real (progresso, skin)

## Migration Plan

1. Instalar dependências
2. Criar `QueryProvider` e envolver layout
3. Criar hooks por domínio em `src/hooks/`
4. Migrar componentes cliente relevantes para usar os hooks
5. Validar que Server Components existentes não foram afetados
6. Rollback: remover `QueryProvider` do layout — nenhuma mudança de schema ou API
