## Why

A página `/lobby/comunidade` lista links estáticos para Discord e YouTube sem mostrar nenhum conteúdo real do canal. Exibir os vídeos mais recentes do YouTube diretamente na página aumenta o engajamento e prova que o canal está ativo — sem precisar sair da plataforma para descobrir o conteúdo.

## What Changes

- A página `/lobby/comunidade` passa a exibir os 6 vídeos mais recentes do canal do Titiltei no YouTube
- Cada card mostra: thumbnail, título, data de publicação e link para assistir no YouTube
- Os dados são buscados via YouTube Data API v3 (`GET /youtube/v3/search`) server-side no Server Component, com revalidação a cada 1 hora (ISR)
- A chave de API é lida de `YOUTUBE_API_KEY` no `.env`
- Se a API falhar ou a chave não estiver configurada, a seção é omitida silenciosamente — sem erro visible

## Capabilities

### New Capabilities

- `community-youtube`: Seção de vídeos recentes do YouTube na página de comunidade

### Modified Capabilities

(nenhuma)

## Impact

- **Modificado:** `src/app/lobby/comunidade/page.tsx` — busca vídeos via YouTube API e exibe cards
- **Nova variável de ambiente:** `YOUTUBE_API_KEY`
- **Sem nova dependência** — usa `fetch` nativo do Node
