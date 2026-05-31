## ADDED Requirements

### Requirement: Progresso geral no hero do dashboard
O dashboard SHALL exibir o total de conteúdos completados pelo usuário e o total disponível, com barra de progresso visual.

#### Scenario: Usuário com conteúdos completados
- **WHEN** um usuário autenticado acessa `/lobby` e possui registros `UserProgress` com `completedAt IS NOT NULL`
- **THEN** o hero exibe "X de Y concluídos" onde X é o count de completados e Y é o total de conteúdos PUBLISHED ativos
- **THEN** uma barra de progresso horizontal exibe visualmente o percentual (X/Y × 100%)

#### Scenario: Usuário sem nenhum conteúdo completado
- **WHEN** o usuário não possui nenhum `UserProgress.completedAt`
- **THEN** o hero exibe "0 de Y concluídos" com barra vazia

---

### Requirement: Progresso por trilha
Cada trilha no dashboard SHALL exibir o número de conteúdos completados pelo usuário naquela trilha.

#### Scenario: Trilha com progresso parcial
- **WHEN** o usuário completou K dos N itens de uma trilha
- **THEN** a trilha exibe "K/N concluídos" ao lado do título

#### Scenario: Trilha sem progresso
- **WHEN** o usuário não completou nenhum item da trilha
- **THEN** a trilha exibe "0/N concluídos"
