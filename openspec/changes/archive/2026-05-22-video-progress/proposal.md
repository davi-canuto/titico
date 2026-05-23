## Why

O `UserProgress.watchedSeconds` já existe no banco e a rota `POST /api/contents/[slug]/progress` já salva progresso. Porém o `VideoPlayer` só dispara o save em PAUSE/END via postMessage do YouTube IFrame, sem retomar de onde parou, sem saves periódicos e sem indicação visual de progresso na página de conteúdo. O usuário perde o contexto ao sair e voltar.

## What Changes

- `VideoPlayer`: saves periódicos a cada 15s enquanto o vídeo está tocando (além de PAUSE/END)
- `VideoPlayer`: inicia o vídeo na posição salva (`start` param na URL do iframe) quando há `watchedSeconds > 0`
- `VideoPlayer`: envia `completedAt` quando o vídeo chega a ≥ 90% do total (considera como assistido)
- Página de conteúdo (`/dashboard/conteudo/[slug]`): exibe barra de progresso e badge "Concluído" se `completedAt` estiver definido
- Botão "Marcar como concluído" manual na página de conteúdo
- `GET /api/contents/[slug]/progress`: nova rota para buscar progresso do usuário naquele conteúdo (usada pelo VideoPlayer para saber o `startTime`)

## Capabilities

### New Capabilities

- `video-progress`: Define o contrato completo de rastreamento de progresso — saves periódicos, retomada de posição, threshold de conclusão, e exibição de estado na UI.

### Modified Capabilities

- `videos`: A página de conteúdo passa a exibir estado de progresso (barra, badge "Concluído") e o player retoma da posição salva.
- `content`: A listagem de conteúdos (TrailRow/ContentCard) já exibe barra de progresso — esse comportamento é preservado e alimentado pelos saves mais frequentes.

## Impact

- `src/components/platform/VideoPlayer.tsx`: adiciona save periódico, leitura de startTime, detecção de 90%
- `src/app/api/contents/[slug]/progress/route.ts`: adiciona `GET` handler
- `src/app/dashboard/conteudo/[slug]/page.tsx`: busca progresso do usuário, exibe barra e badge
- `prisma/schema.prisma`: sem mudanças (campos já existem)
