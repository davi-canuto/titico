## ADDED Requirements

### Requirement: Estado inicial da busca com conteúdos recentes
A página de busca SHALL exibir conteúdos recentes quando o campo de busca está vazio e nenhum filtro está ativo.

#### Scenario: Página carregada sem interação
- **WHEN** o usuário acessa `/lobby/buscar` sem digitar nada
- **THEN** a página exibe uma grade com até 8 conteúdos publicados recentes, com label "Conteúdos recentes"
- **THEN** a tela em branco com apenas ícone de lupa não é exibida

#### Scenario: Usuário digita na busca
- **WHEN** o usuário digita qualquer caractere no campo de busca
- **THEN** a grade de recentes é substituída pelos resultados da busca em tempo real (comportamento atual)

#### Scenario: Usuário aplica filtro de tipo ou dificuldade
- **WHEN** o usuário clica em um filtro com campo vazio
- **THEN** a grade de recentes é substituída pelos resultados filtrados

#### Scenario: Busca ativa sem resultados
- **WHEN** a busca retorna zero resultados
- **THEN** o estado vazio atual ("Nenhum resultado para X") é exibido — os conteúdos recentes não reaparecem
