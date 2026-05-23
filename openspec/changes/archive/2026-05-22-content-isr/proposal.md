## Why

As páginas de conteúdo (`/dashboard/conteudo/[slug]`) fazem queries pesadas ao banco (vídeo, trilha, dados do conteúdo) a cada request, mesmo que o conteúdo mude raramente. ISR (Incremental Static Regeneration) pré-renderiza e armazena em CDN, reduzindo latência e carga no banco para usuários que acessam os conteúdos mais populares.

## What Changes

- Exportar `revalidate` e `generateStaticParams` em `src/app/dashboard/conteudo/[slug]/page.tsx`
- Adicionar `dynamicParams = true` para permitir slugs não pré-gerados
- Separar queries de dados estáticos (metadados do conteúdo, vídeo) de dados dinâmicos por usuário (progresso) — dados do usuário continuam sendo buscados dinamicamente
- Configurar revalidação de 1 hora para conteúdos publicados
- Chamar `revalidatePath` nas Server Actions de admin ao publicar ou atualizar conteúdo

## Capabilities

### New Capabilities

- `content-isr`: Estratégia de cache de página para conteúdo estático — define o contrato de revalidação, geração estática e separação entre dados estáticos e dinâmicos por usuário.

### Modified Capabilities

- `content`: O comportamento de renderização da página de conteúdo muda — dados do conteúdo passam a ser estáticos com TTL; progresso do usuário permanece dinâmico por request.

## Impact

- `src/app/dashboard/conteudo/[slug]/page.tsx`: adiciona `export const revalidate = 3600` e `generateStaticParams`
- `src/lib/admin-actions.ts`: adiciona chamadas a `revalidatePath` / `revalidateTag` ao salvar conteúdo
- Nenhuma mudança de schema Prisma necessária
- CDN (Vercel Edge Network ou similar) começa a servir pages cacheadas
