## Why

Após assistir um conteúdo, o usuário não tem sugestão do que ver a seguir — precisa voltar ao dashboard e navegar manualmente. Recomendações baseadas no histórico de progresso aumentam o tempo na plataforma e guiam o usuário por uma jornada de aprendizado mais coesa. Para MVP, um algoritmo simples e determinístico é suficiente.

## What Changes

- Seção "Você pode gostar" no final da página de conteúdo (`/dashboard/conteudo/[slug]`) com até 6 cards
- Algoritmo de recomendação em duas camadas:
  1. **Por trilha**: conteúdos da mesma trilha que o usuário ainda não assistiu (ordenados por `order`)
  2. **Por tipo**: se não houver trilha ou faltar conteúdos, completar com conteúdos do mesmo `ContentType` mais assistidos globalmente que o usuário ainda não viu
- `GET /api/contents/[slug]/recommendations` — rota de API que retorna as recomendações
- Nenhum modelo novo no banco — usa `TrailItem`, `UserProgress` e `Content` existentes

## Capabilities

### New Capabilities

- `content-recommendations`: Define o algoritmo de recomendação — prioridade de trilha sobre tipo, exclusão de conteúdos já assistidos, limite de resultados, e formato de resposta.

### Modified Capabilities

- `content`: A página de conteúdo ganha uma seção de recomendações ao final, após o conteúdo principal.

## Impact

- `src/app/api/contents/[slug]/recommendations/route.ts` (novo): `GET` handler com lógica de recomendação
- `src/app/dashboard/conteudo/[slug]/page.tsx`: adiciona seção de recomendações
- Nenhuma mudança de schema Prisma
