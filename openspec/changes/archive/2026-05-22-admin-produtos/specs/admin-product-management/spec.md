## ADDED Requirements

### Requirement: Admin product list
A aba "Produtos" em `/dashboard/admin?tab=produtos` SHALL listar todos os produtos com nome, descrição resumida, preço formatado em BRL, access level e badge de ativo/inativo. Apenas usuários com `role: ADMIN` podem acessar.

#### Scenario: Admin vê todos os produtos
- **WHEN** um ADMIN acessa `/dashboard/admin?tab=produtos`
- **THEN** todos os registros de `Product` são listados, ativos e inativos, ordenados por `createdAt asc`

#### Scenario: Badge de status
- **WHEN** um produto com `active: true` é renderizado
- **THEN** exibe badge verde "Ativo"
- **WHEN** um produto com `active: false` é renderizado
- **THEN** exibe badge cinza "Inativo"

### Requirement: Toggle ativo/inativo
Um ADMIN SHALL poder ativar ou desativar um produto inline via Server Action sem recarregar a página inteira.

#### Scenario: Desativar produto ativo
- **WHEN** um ADMIN clica em "Desativar" em um produto `active: true`
- **THEN** o produto é atualizado para `active: false`
- **THEN** `/planos` é revalidado e o produto some da listagem pública

#### Scenario: Ativar produto inativo
- **WHEN** um ADMIN clica em "Ativar" em um produto `active: false`
- **THEN** o produto é atualizado para `active: true`
- **THEN** `/planos` é revalidado e o produto aparece na listagem pública

### Requirement: Edição de produto
A página `/dashboard/admin/produtos/[id]/editar` SHALL exibir formulário com campos nome, descrição e preço (em R$). Ao salvar, os dados são atualizados no banco e `/planos` é revalidado.

#### Scenario: Formulário pré-preenchido
- **WHEN** um ADMIN acessa `/dashboard/admin/produtos/[id]/editar`
- **THEN** os campos exibem os valores atuais do produto
- **THEN** o preço é exibido em reais (ex: "47,00"), não em centavos

#### Scenario: Salvar edição válida
- **WHEN** um ADMIN submete o formulário com nome não vazio e preço numérico positivo
- **THEN** o produto é atualizado no banco
- **THEN** o admin é redirecionado para `/dashboard/admin?tab=produtos`
- **THEN** `/planos` é revalidado

#### Scenario: Preço inválido
- **WHEN** um ADMIN submete o formulário com preço não numérico ou <= 0
- **THEN** a action redireciona de volta com `?error=preco` sem salvar
