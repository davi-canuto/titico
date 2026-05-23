## 1. Configuração ISR na Page

- [x] 1.1 Adicionar `export const revalidate = 3600` em `src/app/dashboard/conteudo/[slug]/page.tsx`
- [x] 1.2 Adicionar `export const dynamicParams = true` na mesma page
- [x] 1.3 Implementar `generateStaticParams()` que retorna slugs de conteúdos `status=PUBLISHED AND active=true`

## 2. Separação de Dados Estáticos e Dinâmicos

- [x] 2.1 Identificar as queries da page que dependem do usuário (progresso, `UserProgress`)
- [x] 2.2 Mover a query de progresso para um Client Component separado (`ProgressTracker`) que busca via API route ou Server Action com `cache: 'no-store'`
- [x] 2.3 Garantir que a query de conteúdo principal (metadados, vídeo) não inclui dados do usuário

## 3. Revalidação pelo Admin

- [x] 3.1 Adicionar `revalidatePath('/dashboard/conteudo/' + slug)` em `src/lib/admin-actions.ts` ao salvar conteúdo
- [x] 3.2 Adicionar `revalidatePath('/dashboard/conteudo/' + slug)` ao publicar/despublicar conteúdo

## 4. Validação

- [x] 4.1 Rodar `next build` e verificar que slugs são pré-gerados (logs de static generation)
- [x] 4.2 Testar com `next start` (não dev): confirmar que a page serve conteúdo cacheado
- [x] 4.3 Testar revalidação admin: após salvar conteúdo, próximo request reflete mudança
- [x] 4.4 Verificar que progresso de dois usuários diferentes é independente na mesma page
