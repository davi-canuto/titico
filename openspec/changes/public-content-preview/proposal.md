## Why

Qualquer link direto para um conteúdo (artigo, matchup, vídeo) cai em `/login` para visitantes não autenticados — o usuário não vê nada antes de precisar criar conta, eliminando o potencial de conversão orgânica vindo de links compartilhados no Discord, Twitter ou WhatsApp.

## What Changes

- Nova rota pública `/preview/[contentId]` acessível sem autenticação
- A página exibe thumbnail, título, tags, dificuldade e os primeiros parágrafos/seções do conteúdo (corte feito server-side — o conteúdo completo nunca é enviado ao cliente sem acesso)
- O restante do conteúdo é bloqueado por um gradiente + "gate" de compra com CTA em vermelho, exibindo produto necessário, preço e botão "Garantir acesso" → checkout
- Metadados Open Graph corretos (og:title, og:description, og:image) para preview rico no Discord/WhatsApp/Twitter
- Usuário autenticado **com acesso** ao conteúdo: redireciona para `/dashboard/conteudo/[id]`
- Usuário autenticado **sem acesso**: vê o gate de compra normalmente (sem redirect para login)
- Novo endpoint `GET /api/preview/[contentId]` que retorna dados truncados do conteúdo sem exigir autenticação

## Capabilities

### New Capabilities

- `public-content-preview`: Página pública de preview de conteúdo com gate de compra e metadados Open Graph

### Modified Capabilities

- `content`: Adiciona query de conteúdo truncado (sem autenticação) para o endpoint de preview; o campo `body` do `ArticleMeta` passa a ter um modo de leitura parcial para visitantes

## Impact

- **Nova rota:** `src/app/preview/[contentId]/page.tsx` (Server Component, sem autenticação obrigatória)
- **Novo endpoint:** `src/app/api/preview/[contentId]/route.ts` — retorna dados truncados do `Content` + meta + produto associado + preço
- **Prisma:** sem schema changes — usa models existentes (`Content`, `TrailItem`, `Product`, `ProductAccess`)
- **Middleware:** rota `/preview/*` deve ser excluída do matcher de autenticação obrigatória
- **SEO/OG:** `generateMetadata` no Server Component usa thumbnail e título do conteúdo
