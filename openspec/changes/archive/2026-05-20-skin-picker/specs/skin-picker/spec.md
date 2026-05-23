## ADDED Requirements

### Requirement: Preferência de skin persistida por usuário
O sistema SHALL armazenar a skin escolhida pelo usuário no campo `heroSkin` do modelo `User`. O valor padrão SHALL ser `"0"` (skin clássica).

#### Scenario: Usuário acessa a home pela primeira vez
- **WHEN** um usuário sem `heroSkin` configurada acessa `/dashboard`
- **THEN** o hero exibe a splash art `Shaco_0.jpg` (clássica)

#### Scenario: Usuário escolhe uma skin
- **WHEN** o usuário seleciona uma skin no seletor
- **THEN** `User.heroSkin` é atualizado no banco via Server Action
- **THEN** o hero background muda para a splash art correspondente

#### Scenario: Skin inválida enviada
- **WHEN** a Server Action recebe um `skinNum` fora da lista de valores permitidos
- **THEN** a action retorna erro sem atualizar o banco

### Requirement: Seletor de skin acessível na home
O sistema SHALL exibir um botão discreto sobre o hero que abre um painel com as 15 skins disponíveis do Shaco em miniatura.

#### Scenario: Usuário abre o seletor
- **WHEN** o usuário clica no botão de skin picker no hero
- **THEN** um painel deslizante exibe as 15 skins em grid com nome e miniatura `aspect-video`
- **THEN** a skin atualmente ativa é destacada com borda vermelha

#### Scenario: Usuário seleciona uma skin no painel
- **WHEN** o usuário clica em uma miniatura de skin
- **THEN** o painel fecha
- **THEN** a imagem do hero atualiza otimisticamente no client
- **THEN** a Server Action persiste a escolha no banco

#### Scenario: Usuário fecha o painel sem escolher
- **WHEN** o usuário clica fora do painel ou pressiona Escape
- **THEN** o painel fecha sem alterar a skin atual

### Requirement: Posicionamento correto da splash art no hero
O sistema SHALL exibir a splash art com `object-top` para mostrar o personagem e não o fundo da imagem.

#### Scenario: Hero renderizado
- **WHEN** a página `/dashboard` é renderizada
- **THEN** a splash art usa `object-cover object-top` como posicionamento
