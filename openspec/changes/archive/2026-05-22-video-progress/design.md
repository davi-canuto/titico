## Context

O `VideoPlayer` atual usa `window.postMessage` para interceptar eventos do YouTube IFrame (`onStateChange`: 1=PLAYING, 2=PAUSED, 0=ENDED). Ao detectar PLAYING, salva 0 segundos e registra `startTimeRef`. Ao detectar PAUSE/END, calcula elapsed e faz POST para `/api/contents/[slug]/progress`. Problemas: (1) não salva periodicamente — fechar a aba sem pausar perde progresso; (2) não lê a posição salva para retomar; (3) não detecta conclusão por threshold; (4) a página de conteúdo não busca nem exibe o progresso do usuário.

## Goals / Non-Goals

**Goals:**
- Save periódico a cada 15s enquanto PLAYING, usando `setInterval`
- Retomar da posição salva: buscar `watchedSeconds` antes de renderizar o iframe, passar `?start=N` na URL
- Detectar conclusão: quando `elapsed >= 0.9 * totalDuration`, enviar `completedAt`
- `GET /api/contents/[slug]/progress` para o VideoPlayer buscar o startTime
- Exibir na página de conteúdo: barra de progresso e badge "Concluído"
- Botão "Marcar como concluído" que chama a rota com `completedAt: now`

**Non-Goals:**
- Sync bidirecional com YouTube (não é possível sem API key de player)
- Progresso em conteúdos não-vídeo (matchups, builds) nesta iteração
- Notificações push ao completar

## Decisions

### Save periódico via setInterval

A cada 15s enquanto `state === PLAYING`, calcular `elapsed = now - startTimeRef` e fazer POST. O `savedRef` atual impede double-save — remover essa restrição e permitir múltiplos saves, usando `watchedSeconds` acumulativo (não apenas delta).

*Alternativa considerada*: `visibilitychange` + `beforeunload` — só cobre saída de aba, não covers stays longas. setInterval é mais robusto.

### Retomada via `?start=N` no iframe src

O YouTube iframe aceita `?start=<segundos>` na URL. O VideoPlayer recebe `initialSeconds?: number` como prop. A página de conteúdo busca `GET /api/contents/[slug]/progress` no servidor antes de renderizar, passa `initialSeconds` ao VideoPlayer.

*Alternativa considerada*: YouTube Player API com `seekTo()` via postMessage — não funciona sem `enablejsapi=1` e handshake completo. `?start` é mais simples e confiável.

### Threshold de conclusão: 90%

`completedAt` é enviado quando `watchedSeconds >= 0.9 * totalDurationSeconds`. `VideoMeta.duration` já está no banco em formato `"MM:SS"` ou `"HH:MM:SS"`. Converter para segundos com a função `durationToSeconds` já existente em `ContentCard.tsx`.

### GET progress: Server Component, não fetch do cliente

A página `/dashboard/conteudo/[slug]` é um Server Component — busca o progresso via Prisma diretamente, sem precisar de uma rota extra de API. Passa `initialSeconds` ao VideoPlayer como prop.

*A rota GET ainda é criada* para uso futuro (React Query, prefetch), mas o caso de uso imediato usa Prisma no servidor.

## Risks / Trade-offs

[postMessage confiabilidade] YouTube pode mudar o formato da mensagem → já é assim hoje, não piora

[`?start` ignora progresso < 5s] YouTube às vezes ignora `start=1` ou `start=2` → aceitável; só relevante para vídeos muito curtos

[Drift de tempo] `Date.now()` pausa quando a aba fica em background → save periódico ainda dispara, mas elapsed pode ser menor que o real → conservador, aceitável
