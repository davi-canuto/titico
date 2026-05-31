## Context

A página de comunidade é um Server Component estático. A YouTube Data API v3 endpoint `GET /youtube/v3/search?part=snippet&channelId=...&order=date&maxResults=6&type=video` retorna os vídeos mais recentes com título, thumbnail e data.

## Goals / Non-Goals

**Goals:**
- 6 vídeos mais recentes com thumbnail, título, data e link para YouTube
- ISR com revalidação de 1 hora
- Degradação graciosa se a API falhar

**Non-Goals:**
- Player embutido (redireciona para YouTube)
- Paginação ou "ver mais"
- Contagem de views/likes

## Decisions

### D1: `fetch` com `next: { revalidate: 3600 }` no Server Component

Next.js cacheia o fetch automaticamente com ISR. Sem estado client-side, sem hook. A página vira dinâmica apenas para o segmento de vídeos — o resto permanece estático.

### D2: `YOUTUBE_CHANNEL_ID` como variável de ambiente

O channel ID do Titiltei (`UCxxxxxxxxx`) é fixo mas não deve ser hardcoded. Junto com `YOUTUBE_API_KEY`, ambos lidos no Server Component. Se qualquer um estiver ausente, a função retorna `[]` e a seção não renderiza.

### D3: Sem wrapper de cliente

Os cards são Server Components puros — sem `useState`, sem `onClick`. O link abre o YouTube em nova aba.

## Risks / Trade-offs

- **[Risco] Quota da YouTube API** → 10.000 unidades/dia no plano gratuito; cada search custa 100 unidades. Com revalidate de 1h = ~24 chamadas/dia. Dentro do limite com folga.
- **[Risco] YOUTUBE_API_KEY ausente em dev** → Mitigado: função retorna `[]` silenciosamente, seção não aparece.
