## MODIFIED Requirements

### Requirement: Admin content list
A página `/dashboard/admin` SHALL exibir as abas Conteúdos, Trilhas, Analytics **e Produtos** no mesmo padrão visual de tabs via `?tab=` search param.

#### Scenario: Admin vê aba Produtos
- **WHEN** um ADMIN acessa `/dashboard/admin?tab=produtos`
- **THEN** a aba "Produtos" é exibida como ativa com borda vermelha
- **THEN** o conteúdo da aba lista os produtos do banco

#### Scenario: Navegação entre abas
- **WHEN** um ADMIN clica em qualquer aba (Conteúdos, Trilhas, Analytics, Produtos)
- **THEN** a URL muda para `?tab=<nome>` e o conteúdo correto é exibido
