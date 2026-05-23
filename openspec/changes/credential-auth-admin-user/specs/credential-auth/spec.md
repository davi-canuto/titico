## ADDED Requirements

### Requirement: Login por email e senha
O sistema SHALL permitir autenticação via email e senha usando o Credentials provider do Auth.js com verificação bcrypt. Apenas usuários com campo `password` preenchido no banco podem usar este fluxo.

#### Scenario: Credenciais válidas
- **WHEN** o usuário submete email e senha corretos no formulário de login
- **THEN** o `authorize()` retorna o objeto do usuário e o Auth.js cria uma sessão JWT

#### Scenario: Senha incorreta
- **WHEN** o usuário submete email correto mas senha errada
- **THEN** o `authorize()` retorna `null` e o Auth.js redireciona para `/login?error=CredentialsSignin`

#### Scenario: Email não encontrado
- **WHEN** o usuário submete um email que não existe no banco
- **THEN** o `authorize()` retorna `null`

#### Scenario: Usuário OAuth sem senha tenta login por credenciais
- **WHEN** um usuário cadastrado via Google (sem campo `password`) tenta login por senha
- **THEN** o `authorize()` retorna `null` sem tentar bcrypt

### Requirement: Hash seguro de senha
Senhas DEVEM ser armazenadas exclusivamente como hash bcrypt com salt rounds >= 12. Nenhuma senha em texto plano pode ser persistida.

#### Scenario: Criação de usuário admin via script
- **WHEN** o script `prisma/create-admin.ts` é executado
- **THEN** a senha é hasheada com bcrypt (salt=12) antes de inserir no banco, e o hash é o único valor armazenado

#### Scenario: Verificação de senha no authorize
- **WHEN** `authorize()` recebe email e senha
- **THEN** usa `bcrypt.compare(senha, hash)` para verificar — nunca compara texto plano
