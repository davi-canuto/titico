## ADDED Requirements

### Requirement: Landing page pública renderiza todas as seções em ordem
A rota `/` SHALL renderizar as seções na seguinte ordem: `LandingHeader`, `Hero`, `VideoSection`, `MatchupGrid`, `About`, `PricingSection`, `LandingFooter`. O layout SHALL usar fundo global `#0d0d0d` e cor de texto primária branca.

#### Scenario: Visitante não autenticado acessa a raiz
- **WHEN** usuário não autenticado acessa `/`
- **THEN** a página é renderizada com todas as seções visíveis e o header exibe botão "Entrar" apontando para `/login`

#### Scenario: Usuário autenticado acessa a raiz
- **WHEN** usuário com sessão ativa acessa `/`
- **THEN** o header exibe botão "Entrar no Lobby" apontando para `/dashboard`

---

### Requirement: LandingHeader — navegação fixa e responsiva
O `LandingHeader` SHALL ser fixo no topo (`position: fixed`), com links de âncora para `#matchups`, `#sobre` e `#pricing`. Em mobile (< md), SHALL exibir menu hambúrguer que abre/fecha um painel com os mesmos links. SHALL exibir ícones de redes sociais (Instagram, YouTube, TikTok, Twitch, Kick) em desktop.

#### Scenario: Navegação desktop visível
- **WHEN** viewport é ≥ 768px
- **THEN** links de navegação e ícones sociais são exibidos inline no header

#### Scenario: Menu mobile abre e fecha
- **WHEN** usuário clica no botão hambúrguer em viewport < 768px
- **THEN** painel mobile abre exibindo links de navegação e CTA
- **WHEN** usuário clica em qualquer link do painel
- **THEN** painel fecha

---

### Requirement: Hero — seção de destaque com preview de matchups
O `Hero` SHALL ocupar 100dvh, com splash art do Shaco como background (opacidade 20–30%), gradient overlay e headline "GUIA DO SHACO" com "SHACO" em vermelho `#e3001b`. SHALL exibir dois CTAs: "Entrar no Lobby" (`href="#pricing"`) e "Ver Matchups Grátis" (`href="#matchups"`). SHALL exibir grid de preview com os primeiros 5 matchups gratuitos (com ring vermelho) e os primeiros 7 matchups bloqueados (grayscale + ícone de cadeado), além de contador dos matchups bloqueados restantes.

#### Scenario: Preview de matchups na hero
- **WHEN** página carrega
- **THEN** hero exibe até 5 avatares de matchups gratuitos com ring vermelho e até 7 avatares bloqueados com overlay de cadeado e grayscale

#### Scenario: Click em matchup bloqueado no hero
- **WHEN** usuário clica em avatar bloqueado no hero
- **THEN** página rola até `#pricing`

---

### Requirement: VideoSection — vídeo YouTube embutido
A `VideoSection` SHALL exibir um `<iframe>` do YouTube com aspect ratio 16:9, com título "Veja o que você vai aprender". O embed SHALL ter `allowFullScreen` habilitado.

#### Scenario: Vídeo renderizado
- **WHEN** página carrega
- **THEN** iframe do YouTube é exibido com proporção 16:9 e borda arredondada

---

### Requirement: MatchupGrid — grid interativo com painel inline e modal de locked
O `MatchupGrid` SHALL exibir todos os matchups gratuitos e bloqueados em grid. Matchups gratuitos SHALL ser clicáveis e abrir painel inline `MatchupPanel` com a análise completa. Matchups bloqueados SHALL abrir modal com animação do Shaco ao ser clicado. O modal SHALL ter botão de fechar (×) e, ao clicar na imagem do Shaco, SHALL navegar para `#pricing` com efeito de flash e fechar o modal. SHALL exibir legenda de dificuldade (Fácil/Médio/Difícil) abaixo do grid. SHALL exibir CTA "Entrar no Lobby" no rodapé da seção.

#### Scenario: Selecionar matchup gratuito
- **WHEN** usuário clica em avatar de matchup gratuito
- **THEN** painel inline com análise do matchup é exibido abaixo do grid e página rola até ele

#### Scenario: Desselecionar matchup
- **WHEN** usuário clica no mesmo avatar já selecionado
- **THEN** painel inline é ocultado

#### Scenario: Click em matchup bloqueado abre modal
- **WHEN** usuário clica em avatar de matchup bloqueado
- **THEN** modal com imagem animada do Shaco é exibido com overlay escuro

#### Scenario: Click no Shaco do modal redireciona para pricing
- **WHEN** usuário clica na imagem do Shaco dentro do modal
- **THEN** efeito de flash branco ocorre, modal fecha e página navega para `#pricing`

#### Scenario: Fechar modal pelo botão ×
- **WHEN** usuário clica no botão × do modal
- **THEN** modal fecha sem navegar

---

### Requirement: About — seção de bio do criador
A seção `About` SHALL exibir foto do Titiltei (`/titico.jpeg`), texto de apresentação e dois badges: "Top 1 Shaco do Mundo" (fundo vermelho) e "Top 1 Shaco BR" (fundo branco/5). Layout SHALL ser coluna em mobile e linha em desktop (md+).

#### Scenario: Layout responsivo da seção About
- **WHEN** viewport < 768px
- **THEN** foto e texto empilham verticalmente
- **WHEN** viewport ≥ 768px
- **THEN** foto fica à esquerda e texto à direita em flex-row

---

### Requirement: PricingSection — cards de planos do banco
A `PricingSection` SHALL buscar produtos ativos do banco via Prisma (`product.findMany({ where: { active: true } })`), ordenados por preço crescente. SHALL renderizar um `PlanCard` por produto, marcando o de maior preço como popular (`isPopular`). SHALL exibir barra de trust com textos "Pagamento seguro via Stripe", "Pagamento único", "Sem renovação automática" e "Acesso vitalício". Caso não haja produtos, SHALL exibir mensagem "Planos em breve".

#### Scenario: Produtos disponíveis no banco
- **WHEN** há produtos ativos cadastrados
- **THEN** seção exibe um card por produto, com o de maior preço marcado como popular

#### Scenario: Nenhum produto ativo
- **WHEN** consulta ao banco retorna lista vazia
- **THEN** seção exibe mensagem "Planos em breve"

#### Scenario: Erro de banco de dados
- **WHEN** Prisma lança exceção durante a query
- **THEN** seção exibe mensagem "Planos em breve" sem lançar erro para o usuário

---

### Requirement: LandingFooter — rodapé com logo, links e aviso legal
O `LandingFooter` SHALL exibir logo "TITILTEI" (com "TEI" em vermelho), link de contato por e-mail, links para Twitch/Kick/YouTube, ícones sociais (Instagram, YouTube, TikTok, Twitch, Kick) e aviso de copyright com "Não afiliado à Riot Games".

#### Scenario: Footer renderizado
- **WHEN** página carrega
- **THEN** footer exibe logo, links de plataformas, ícones sociais e aviso legal com ano atual
