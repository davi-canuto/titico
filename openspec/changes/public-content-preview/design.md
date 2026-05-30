## Context

Atualmente todo tráfego para `/dashboard/*` é bloqueado pelo middleware de autenticação Next.js, que redireciona visitantes não autenticados para `/login`. Links de conteúdo compartilhados no Discord ou redes sociais não têm valor de conversão porque o visitante bate num wall antes de ver qualquer coisa. A plataforma já tem `Content`, `ArticleMeta`, `VideoMeta`, `MatchupMeta`, `Product`, e `ProductAccess` no schema Prisma — não há necessidade de mudanças de schema.

## Goals / Non-Goals

**Goals:**
- Página pública `/preview/[contentId]` sem autenticação obrigatória
- Corte de conteúdo server-side (nunca expor body completo ao cliente sem acesso)
- Gate de compra inline com produto, preço e CTA
- Open Graph tags para preview rico em redes sociais
- Redirect para `/dashboard/conteudo/[id]` para usuários autenticados com acesso

**Non-Goals:**
- Rotas `/preview/` para cada tipo individualmente (uma rota genérica cobre todos os tipos)
- Cache de edge / ISR nesta change (pode vir depois)
- Paginação ou listagem de conteúdos públicos
- Modificar o sistema de access control existente

## Decisions

### D1: Rota pública `/preview/[contentId]` em vez de `/c/[slug]`

Usar o `contentId` (cuid) em vez do slug evita colisão com rotas existentes e simplifica a query Prisma (PK lookup). Um redirect de `/c/[slug]` pode ser adicionado depois sem quebrar nada. O slug pode ser incluído na URL como parâmetro decorativo futuro.

**Alternativa considerada:** `/c/[slug]` — mais legível, mas requer query por slug e potencial conflito com rotas de dashboard.

### D2: Corte de conteúdo feito no Server Component, não no endpoint de API

O Server Component (`page.tsx`) busca os dados e trunca antes de renderizar. Não existe um endpoint separado `/api/preview/[contentId]` — a página é um Server Component puro que consulta Prisma diretamente. Isso elimina uma superfície de API pública que poderia ser usada para extrair conteúdo via fetch direto.

**Regra de corte:** Para `ArticleMeta.body` (markdown ou texto), extrair os primeiros 2 parágrafos (split por `\n\n`, pegar índices 0-1). Para vídeos, exibir apenas thumbnail + título + duração sem embed. Para matchups, exibir champion + difficulty + primeiros 2 tips, ocultar strategy completa.

**Alternativa considerada:** Endpoint `/api/preview/[contentId]` retornando dados truncados — mais flexível para SPAs, mas cria superfície adicional e requer autenticação opcional complexa.

### D3: Verificação de acesso via `ProductAccess` no Server Component

O Server Component verifica a sessão via `auth()` do Auth.js. Se autenticado, consulta `ProductAccess` para saber se o usuário tem acesso ao produto que contém este conteúdo (via `TrailItem` → `Trail` → `Product`). Se tem acesso, faz redirect para `/dashboard/conteudo/[id]`. Toda essa lógica fica server-side.

### D4: Middleware — adicionar `/preview` como rota pública

O arquivo `src/middleware.ts` usa um matcher que protege rotas. `/preview/*` deve ser excluído do matcher (ou adicionado à lista de rotas públicas) para que visitantes não autenticados alcancem o Server Component.

### D5: `generateMetadata` para Open Graph

O Server Component exporta `generateMetadata` que usa `content.title`, `content.thumbnail` e os primeiros 160 caracteres do body truncado como `og:description`. Funciona automaticamente com Next.js App Router sem biblioteca adicional.

## Risks / Trade-offs

- **[Risco] Conteúdo truncado exposto publicamente** → Mitigação: o corte é feito server-side antes da serialização; a regra de 2 parágrafos / 2 tips é aplicada na camada de dados, nunca enviando o restante.
- **[Risco] Produto associado ao conteúdo não encontrado** → Mitigação: se nenhum produto estiver associado ao TrailItem, o gate exibe mensagem genérica "Acesso necessário" com CTA para `/planos`.
- **[Trade-off] Sem cache** → A página faz queries Prisma a cada request. Para MVP é aceitável; ISR pode ser adicionado em change separada.
- **[Risco] Middleware matcher incorreto abre outras rotas** → Mitigação: testar explicitamente que `/dashboard/*` ainda redireciona para login após a mudança no matcher.

## Migration Plan

1. Atualizar `src/middleware.ts` para excluir `/preview/*` do matcher protegido
2. Criar `src/app/preview/[contentId]/page.tsx` (Server Component)
3. Criar helper `src/lib/content-preview.ts` com lógica de truncamento e lookup de produto
4. Deploy sem feature flag — a rota é aditiva e não altera rotas existentes
5. Rollback: remover a rota `/preview` e reverter o middleware
