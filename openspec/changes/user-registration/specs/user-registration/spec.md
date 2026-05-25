## ADDED Requirements

### Requirement: Página de cadastro em /register
A rota pública `/register` SHALL exibir um formulário de criação de conta com campos: nome completo, email, senha e confirmação de senha.

#### Scenario: Visitante acessa /register sem sessão
- **WHEN** um usuário sem sessão navega para `/register`
- **THEN** o formulário de cadastro é exibido

#### Scenario: Usuário autenticado acessa /register
- **WHEN** um usuário com sessão ativa navega para `/register`
- **THEN** é redirecionado para `/dashboard`

### Requirement: Criação de conta via POST /api/auth/register
O endpoint `POST /api/auth/register` SHALL aceitar `{ name, email, password }`, validar os dados, fazer hash da senha com bcrypt (salt=12), criar o `User` no banco e retornar 201.

#### Scenario: Cadastro com dados válidos
- **WHEN** `POST /api/auth/register` recebe nome não-vazio, email válido, senha ≥ 8 caracteres e email não existente no banco
- **THEN** um novo `User` é criado com `password` armazenado como hash bcrypt, e a resposta é `201 { id, email, name }`

#### Scenario: Email já cadastrado
- **WHEN** o email enviado já existe no banco (seja via Google OAuth ou cadastro anterior)
- **THEN** a resposta é `409 { error: "Email já em uso" }`

#### Scenario: Dados inválidos (validação server-side)
- **WHEN** algum campo obrigatório está ausente, o email tem formato inválido ou a senha tem menos de 8 caracteres
- **THEN** a resposta é `400 { error: "<descrição>" }`

### Requirement: Auto-login após cadastro
Após cadastro bem-sucedido, o cliente SHALL chamar `signIn("credentials", { email, password })` e redirecionar para `/dashboard` sem exigir um segundo login manual.

#### Scenario: Cadastro seguido de login automático
- **WHEN** `POST /api/auth/register` retorna 201
- **THEN** o client chama `signIn("credentials", ...)` e redireciona para `/dashboard`

### Requirement: Email de boas-vindas no cadastro
Após criar a conta, o sistema SHALL enviar o email de boas-vindas usando `welcomeEmail(name)` via `getEmailProvider()` (fire-and-forget).

#### Scenario: Email enviado após criação
- **WHEN** o usuário é criado com sucesso
- **THEN** `welcomeEmail` é renderizado e enviado para o endereço cadastrado; falha no envio não impede o cadastro

### Requirement: Validação client-side no formulário
O formulário SHALL validar em tempo real: senhas coincidem, email tem formato válido, campos obrigatórios preenchidos. O botão de submit fica desabilitado enquanto a validação falhar.

#### Scenario: Senhas não coincidem
- **WHEN** o usuário digita senhas diferentes nos campos "senha" e "confirmar senha"
- **THEN** uma mensagem de erro inline é exibida e o submit é bloqueado

#### Scenario: Email com formato inválido
- **WHEN** o usuário digita um email sem formato válido (sem @, sem domínio)
- **THEN** uma mensagem de erro inline é exibida
