## ADDED Requirements

### Requirement: Editor de markdown com preview ao vivo no admin
O admin SHALL exibir um editor de dois painéis para o campo `body` de artigos: textarea à esquerda e preview renderizado à direita.

#### Scenario: Admin edita artigo existente
- **WHEN** o admin acessa a página de edição de um artigo
- **THEN** o campo body é exibido como editor de dois painéis com o conteúdo atual no textarea e o preview correspondente renderizado ao lado

#### Scenario: Preview atualiza em tempo real
- **WHEN** o admin digita no textarea do editor
- **THEN** o painel de preview atualiza imediatamente com o markdown renderizado

#### Scenario: Submissão do formulário
- **WHEN** o admin submete o formulário de criação ou edição
- **THEN** o valor do campo `body` submetido é o texto markdown do textarea (não o HTML renderizado)

#### Scenario: Layout em mobile
- **WHEN** a página é acessada em tela pequena (< 768px)
- **THEN** o textarea aparece acima e o preview abaixo (empilhado verticalmente)
