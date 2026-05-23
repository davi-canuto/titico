## ADDED Requirements

### Requirement: Página de perfil do usuário
O sistema SHALL renderizar `/dashboard/perfil` como página autenticada exibindo identidade, status de acesso e resumo de compra do usuário logado.

#### Scenario: Usuário sem compra acessa o perfil
- **WHEN** um usuário autenticado sem `Purchase` navega para `/dashboard/perfil`
- **THEN** a página exibe avatar, nome e e-mail do usuário
- **THEN** exibe badge "Sem plano" em vermelho apagado
- **THEN** exibe CTA "Ver planos" apontando para `/planos`

#### Scenario: Usuário com compra COMPLETED acessa o perfil
- **WHEN** um usuário com `Purchase.status === COMPLETED` navega para `/dashboard/perfil`
- **THEN** exibe badge "Acesso ativo" em verde (`#4ade80`)
- **THEN** exibe card de compra com: nome do produto, data de aquisição formatada em pt-BR, e valor pago formatado em BRL
- **THEN** não exibe CTA para planos

#### Scenario: Usuário não autenticado tenta acessar o perfil
- **WHEN** uma requisição sem sessão chega em `/dashboard/perfil`
- **THEN** o middleware redireciona para `/login`

### Requirement: Avatar da Navbar linka para o perfil
O sistema SHALL tornar o avatar do usuário na Navbar um link clicável para `/dashboard/perfil`.

#### Scenario: Usuário clica no avatar
- **WHEN** o usuário clica no avatar (foto ou inicial) na Navbar
- **THEN** é navegado para `/dashboard/perfil`

### Requirement: Logout disponível na página de perfil
O sistema SHALL exibir um botão de logout na página de perfil que encerra a sessão e redireciona para `/`.

#### Scenario: Usuário clica em "Sair" no perfil
- **WHEN** o usuário clica no botão "Sair" em `/dashboard/perfil`
- **THEN** a sessão é encerrada via `signOut`
- **THEN** o usuário é redirecionado para `/`

### Requirement: Endpoint GET /api/user/me implementado
O sistema SHALL implementar o handler de `GET /api/user/me` retornando dados do usuário e status de compra conforme spec `user-profile`.

#### Scenario: Usuário autenticado sem compra
- **WHEN** usuário autenticado chama `GET /api/user/me`
- **THEN** resposta inclui `id`, `name`, `email`, `image`, `role`, `hasAccess: false`, `purchase: null`

#### Scenario: Usuário autenticado com compra COMPLETED
- **WHEN** usuário autenticado com compra chama `GET /api/user/me`
- **THEN** resposta inclui `hasAccess: true` e objeto `purchase` com `productId`, `status`, `createdAt`, `accessLevel`

#### Scenario: Requisição não autenticada
- **WHEN** requisição sem sessão chega em `GET /api/user/me`
- **THEN** resposta é `401 UNAUTHORIZED`
