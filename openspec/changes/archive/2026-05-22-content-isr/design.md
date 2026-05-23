## Context

`/dashboard/conteudo/[slug]` é uma página dinâmica que faz 2-3 queries ao banco a cada request (conteúdo, vídeo, trilha). O conteúdo em si raramente muda após publicação; apenas o progresso do usuário é dinâmico. Separar esses dois tipos de dados permite cachear a parte estática em CDN enquanto o progresso permanece dinâmico por request.

## Goals / Non-Goals

**Goals:**
- `revalidate = 3600` para metadados de conteúdo (slug, título, vídeo, trilha)
- `generateStaticParams` para pré-gerar slugs de conteúdos publicados no build
- `dynamicParams = true` para servir slugs novos on-demand (ISR)
- `revalidatePath` acionado via admin actions ao publicar/atualizar conteúdo
- Progresso do usuário (`UserProgress`) permanece dinâmico — nunca cacheado

**Non-Goals:**
- ISR para páginas de listagem (`/dashboard/explorar`) nesta iteração — filtros tornam o cache complexo
- Cache de autenticação/sessão
- Implementar cache tags (`revalidateTag`) — revalidatePath por slug é suficiente agora

## Decisions

### Separar metadados de conteúdo do progresso do usuário

O componente de página busca dados em dois momentos: dados do conteúdo (estáticos, cacheáveis) e progresso (dinâmico, por usuário). A query de progresso usa `unstable_noStore()` ou é movida para um Client Component com fetch separado, impedindo que dados de usuário contaminem o cache estático.

*Alternativa considerada*: `cookies()` força dynamic — mas a chamada a `auth()` já faz isso. A solução é mover o progresso para fora da página cacheada.

### `generateStaticParams` apenas para PUBLISHED + active

Gerar params apenas para conteúdos ativos evita builds lentos com conteúdos rascunho. Novos conteúdos publicados são servidos on-demand via ISR.

### revalidate de 3600s (1 hora)

Balanceia frescor e custo de rebuild. Admin pode forçar revalidação imediata via `revalidatePath` ao salvar.

## Risks / Trade-offs

[Stale content após edição] Entre revalidações (até 1h), usuários veem versão antiga → mitigado por `revalidatePath` explícito nas admin actions

[Progresso não cacheado = query por request] Para usuários que assistem vídeos ativamente, isso é correto — não é um problema

[Cold ISR] Primeiro request após expiração do cache é lento (renderiza sob demanda) → mitigado por `generateStaticParams` pré-gerando os conteúdos mais acessados

## Migration Plan

1. Exportar `revalidate` e `generateStaticParams` na page
2. Separar query de progresso (mover para client ou usar `noStore`)
3. Adicionar `revalidatePath` nas admin actions relevantes
4. Testar com `next build` + `next start` (ISR não funciona em dev mode)
5. Rollback: remover `revalidate` export — página volta a ser dinâmica
