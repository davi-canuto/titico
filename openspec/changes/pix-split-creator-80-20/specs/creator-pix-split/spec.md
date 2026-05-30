## ADDED Requirements

### Requirement: Creator tem chave Pix cadastrável
O model `Creator` SHALL ter um campo `pixKey` opcional (`String?`) para armazenar a chave Pix do creator (qualquer tipo: CPF, CNPJ, email, telefone ou chave aleatória).

#### Scenario: Creator sem pixKey cadastrada
- **WHEN** um `Creator` é criado sem `pixKey`
- **THEN** o campo `pixKey` é `null` e não bloqueia nenhuma operação

#### Scenario: Creator com pixKey cadastrada
- **WHEN** um admin cadastra uma `pixKey` válida para um `Creator`
- **THEN** o campo `pixKey` é persistido no banco e disponível para uso no split

### Requirement: Admin pode cadastrar e editar pixKey do Creator
A UI de admin de creators SHALL exibir um campo de texto para cadastrar ou editar a `pixKey` do creator.

#### Scenario: Cadastro de pixKey na criação do creator
- **WHEN** um admin preenche o campo `pixKey` ao criar um creator
- **THEN** o valor é salvo no banco junto com os demais dados

#### Scenario: Edição de pixKey em creator existente
- **WHEN** um admin edita um creator já existente e altera o campo `pixKey`
- **THEN** o novo valor é persistido e sobrescreve o anterior

#### Scenario: Remoção de pixKey
- **WHEN** um admin salva um creator com o campo `pixKey` vazio
- **THEN** o campo é salvo como `null` no banco
