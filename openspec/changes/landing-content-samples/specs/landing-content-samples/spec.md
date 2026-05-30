## ADDED Requirements

### Requirement: Seção de amostras de conteúdo na landing
A landing page SHALL exibir uma seção com até 4 conteúdos publicados, cada um com link para o preview público.

#### Scenario: Conteúdos publicados existem
- **WHEN** a landing page é carregada por qualquer visitante
- **THEN** a seção "Veja antes de assinar" é exibida com até 4 cards de conteúdo com status `PUBLISHED` e `active: true`, ordenados por `publishedAt` decrescente

#### Scenario: Nenhum conteúdo publicado
- **WHEN** não existe nenhum `Content` com `status: PUBLISHED` e `active: true`
- **THEN** a seção não é renderizada (retorna null)

#### Scenario: Card de conteúdo
- **WHEN** um card de conteúdo é exibido
- **THEN** o card mostra thumbnail (se existir), título, badge de tipo (`VIDEO`, `ARTICLE`, `MATCHUP`, etc.)
- **THEN** se o tipo for `MATCHUP`, o card também exibe o badge de dificuldade com cor correspondente (fácil → verde, médio → amarelo, difícil → vermelho)
- **THEN** o card contém link "Ver amostra gratuita →" apontando para `/preview/[contentId]`

#### Scenario: Link de amostra
- **WHEN** o visitante clica em "Ver amostra gratuita →"
- **THEN** é redirecionado para `/preview/[contentId]` correspondente ao card clicado
