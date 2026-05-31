## ADDED Requirements

### Requirement: Vídeos recentes do YouTube na página de comunidade
A página `/lobby/comunidade` SHALL exibir os vídeos mais recentes do canal do Titiltei no YouTube, buscados via YouTube Data API.

#### Scenario: API configurada e canal com vídeos
- **WHEN** `YOUTUBE_API_KEY` e `YOUTUBE_CHANNEL_ID` estão configurados e o canal tem vídeos publicados
- **THEN** a página exibe até 6 cards de vídeos com thumbnail, título, data de publicação e link para o YouTube

#### Scenario: YOUTUBE_API_KEY ausente
- **WHEN** a variável `YOUTUBE_API_KEY` não está configurada
- **THEN** a seção de vídeos não é renderizada — nenhum erro é exibido ao usuário

#### Scenario: Erro na API do YouTube
- **WHEN** a chamada à YouTube Data API falha (timeout, quota excedida, etc.)
- **THEN** a seção de vídeos não é renderizada — nenhum erro é exibido ao usuário

#### Scenario: Revalidação de cache
- **WHEN** passam 1 hora desde o último fetch bem-sucedido
- **THEN** o Next.js revalida os dados na próxima requisição (ISR com `revalidate: 3600`)
