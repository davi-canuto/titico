## Why

O link "Comunidade" existe na navbar e aponta para `/dashboard/comunidade`, mas a rota não existe — resulta em 404. A comunidade é um diferencial de plataformas de ensino de jogos: um espaço onde jogadores trocam replays, tiram dúvidas e compartilham resultados. Para o MVP, uma página estática com links para os canais externos (Discord, YouTube, Reddit) já resolve o 404 e comunica onde a comunidade vive.

## What Changes

- Página `/dashboard/comunidade` com seções: Discord (link para convite), YouTube (canal), grupo de WhatsApp (se houver), e um feed estático de "últimas discussões" linkando para posts externos
- Layout visual consistente com o resto da plataforma (dark, vermelho, uppercase)
- Sem backend dinâmico nesta iteração — conteúdo configurado via constantes no código
- No futuro: integração com Discord API para mostrar membros online (fora de escopo agora)

## Capabilities

### New Capabilities

- `community`: Define a página de comunidade — quais links e canais são exibidos, estrutura das seções, e como novos canais são adicionados (constantes no código).

### Modified Capabilities

*(nenhuma — o link já existe na navbar, apenas a rota de destino está ausente)*

## Impact

- `src/app/dashboard/comunidade/page.tsx` (novo): página estática de comunidade
- `src/app/dashboard/comunidade/` (novo diretório)
- Nenhuma dependência nova, sem mudança de schema ou API
