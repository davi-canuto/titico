## ADDED Requirements

### Requirement: Página pública de preview de conteúdo
O sistema SHALL disponibilizar a rota `/preview/[contentId]` sem autenticação obrigatória, exibindo uma versão truncada do conteúdo e um gate de compra para visitantes sem acesso.

#### Scenario: Visitante não autenticado acessa preview
- **WHEN** um visitante sem sessão acessa `/preview/[contentId]` de um conteúdo `PUBLISHED`
- **THEN** a página exibe thumbnail, título, tipo, dificuldade (se aplicável) e os primeiros 2 parágrafos/seções do conteúdo truncado server-side
- **THEN** o restante do conteúdo está bloqueado por um gate de compra com nome do produto, preço formatado e botão "Garantir acesso"
- **THEN** a página retorna HTTP 200 sem exigir cookie de sessão

#### Scenario: Visitante acessa preview de conteúdo DRAFT
- **WHEN** um visitante sem sessão acessa `/preview/[contentId]` de um conteúdo com `status: DRAFT`
- **THEN** a página retorna `404 NOT_FOUND`

#### Scenario: contentId inválido ou inexistente
- **WHEN** um visitante acessa `/preview/[contentId]` com ID que não existe no banco
- **THEN** a página retorna `404 NOT_FOUND`

#### Scenario: Usuário autenticado com acesso ao conteúdo
- **WHEN** um usuário autenticado que possui `ProductAccess` válido acessa `/preview/[contentId]`
- **THEN** o sistema faz redirect 302 para `/dashboard/conteudo/[contentId]`

#### Scenario: Usuário autenticado sem acesso ao conteúdo
- **WHEN** um usuário autenticado sem `ProductAccess` válido acessa `/preview/[contentId]`
- **THEN** a página exibe o preview truncado e o gate de compra normalmente, sem redirect para login

---

### Requirement: Truncamento de conteúdo server-side
O sistema SHALL truncar o conteúdo antes da serialização para o cliente, garantindo que o corpo completo nunca seja enviado ao browser sem que o usuário tenha acesso.

#### Scenario: Artigo — truncamento por parágrafos
- **WHEN** o conteúdo é do tipo `ARTICLE` e `ArticleMeta.body` contém múltiplos parágrafos separados por `\n\n`
- **THEN** apenas os primeiros 2 parágrafos são incluídos na resposta serializada pelo Server Component
- **THEN** o restante do `body` não aparece em nenhuma parte do HTML ou JSON da resposta

#### Scenario: Matchup — truncamento de tips e strategy
- **WHEN** o conteúdo é do tipo `MATCHUP`
- **THEN** apenas os 2 primeiros itens de `MatchupMeta.tips` são exibidos
- **THEN** o campo `MatchupMeta.strategy` é omitido completamente da resposta

#### Scenario: Vídeo — sem embed no preview
- **WHEN** o conteúdo é do tipo `VIDEO`
- **THEN** a página exibe thumbnail e título mas NÃO renderiza o iframe do YouTube
- **THEN** `VideoMeta.youtubeId` não é exposto ao cliente

---

### Requirement: Gate de compra no preview
O sistema SHALL exibir um gate de compra para visitantes sem acesso, com informações do produto necessário e CTA para checkout.

#### Scenario: Produto associado ao conteúdo encontrado
- **WHEN** o conteúdo pertence a um `TrailItem` de uma `Trail` associada a um `Product` ativo
- **THEN** o gate exibe o nome do produto, preço formatado (`R$ X,XX`) e botão "Garantir acesso" que aponta para o checkout desse produto

#### Scenario: Nenhum produto associado ao conteúdo
- **WHEN** o conteúdo não pertence a nenhuma `Trail` com `Product` associado
- **THEN** o gate exibe uma mensagem genérica "Acesso necessário" e botão "Ver planos" apontando para `/planos`

#### Scenario: CTA para usuário autenticado sem acesso
- **WHEN** o visitante está autenticado mas sem acesso
- **THEN** o botão "Garantir acesso" aponta diretamente para o checkout do produto (não para /login)

#### Scenario: CTA para visitante não autenticado
- **WHEN** o visitante não está autenticado
- **THEN** o botão "Garantir acesso" aponta para o checkout do produto com parâmetro `?redirect=/preview/[contentId]` para retornar após o login/compra

---

### Requirement: Metadados Open Graph para preview
O sistema SHALL gerar metadados Open Graph corretos na rota `/preview/[contentId]` para que o link seja renderizado como rich preview no Discord, WhatsApp e Twitter/X.

#### Scenario: Conteúdo com thumbnail
- **WHEN** `Content.thumbnail` está preenchido
- **THEN** a página inclui `<meta property="og:image" content="[thumbnail URL]" />`
- **THEN** `og:title` é o título do conteúdo
- **THEN** `og:description` são os primeiros 160 caracteres do texto truncado (ou descrição derivada do tipo/matchup)

#### Scenario: Conteúdo sem thumbnail
- **WHEN** `Content.thumbnail` é nulo
- **THEN** `og:image` usa imagem padrão da plataforma (ex: logo/banner estático)

#### Scenario: Twitter Card
- **WHEN** qualquer conteúdo tem a rota `/preview/[contentId]` acessada por um crawler
- **THEN** a página inclui `<meta name="twitter:card" content="summary_large_image" />`
