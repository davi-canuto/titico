## Why

O controle de acesso atual é baseado em níveis hierárquicos fixos (`FREE < BASIC < PAID < FULL`) armazenados no usuário e comparados com o nível do conteúdo. Esse modelo não reflete a realidade do negócio: o acesso deve ser determinado por **qual produto o usuário comprou** e **quais conteúdos fazem parte daquele produto** — não por uma hierarquia rígida de níveis. O modelo atual impede, por exemplo, ter conteúdos exclusivos de um produto específico que um usuário com "nível mais alto" não deveria ver automaticamente.

## What Changes

- **BREAKING**: Remover `Content.accessLevel` (enum `AccessLevel`) e substituir por uma relação many-to-many `ContentProduct` entre `Content` e `Product`, indicando quais produtos dão acesso a cada conteúdo. Conteúdo sem nenhum produto associado é considerado **gratuito** (acessível a todos).
- **BREAKING**: Remover `User.accessLevel` e `Purchase.accessLevel` — o acesso do usuário passa a ser derivado dinamicamente das suas `Purchase`s com `status: COMPLETED`.
- **BREAKING**: `Purchase` deixa de ter `@unique` em `userId` — um usuário pode ter múltiplas compras (uma por produto).
- **BREAKING**: Remover `Product.accessLevel` — produtos não concedem mais um "nível", apenas desbloqueiam os conteúdos associados a eles.
- Substituir a função `canAccess(userLevel, contentLevel)` em `src/lib/access.ts` por uma verificação baseada em produto: o usuário acessa o conteúdo se ele tiver ao menos uma `Purchase` `COMPLETED` para algum produto associado àquele conteúdo.
- Remover o enum `AccessLevel` do schema Prisma (ou reduzir a apenas `FREE` se ainda necessário para outro contexto).
- Atualizar todas as superfícies que consomem `accessLevel`: APIs de conteúdo, página de explorar, player, admin, webhook do Stripe e session JWT.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `content`: A estrutura de acesso do `Content` muda de `accessLevel` (enum) para relação many-to-many com `Product` via `ContentProduct`.
- `content-player`: A verificação de acesso ao conteúdo passa a checar produtos comprados, não `accessLevel`.
- `explorar`: A página de explorar passa a derivar conteúdos travados via produtos, não por comparação de nível.
- `checkout`: `Purchase` passa a suportar múltiplas compras por usuário; `Purchase.accessLevel` é removido.
- `stripe-webhook`: O webhook passa a criar `Purchase` sem `accessLevel` e sem elevar `User.accessLevel`.
- `products`: `Product.accessLevel` é removido; produtos passam a ter relação com conteúdos via `ContentProduct`.
- `admin-content-management`: O formulário de criação/edição de conteúdo substitui o seletor de `accessLevel` por um seletor de produtos associados.
- `auth`: `session.user.accessLevel` é removido do token e da sessão.

## Impact

- **Schema Prisma**: nova tabela `ContentProduct`, remoção de campos `accessLevel` em `Content`, `User`, `Purchase` e `Product`; `Purchase.userId` deixa de ser `@unique`.
- **Migration**: migration destrutiva — dados de `accessLevel` existentes são perdidos; `Purchase` existentes precisam ser migrados.
- **22+ arquivos** afetados (APIs, páginas, componentes, lib, auth config).
- **Enum `AccessLevel`**: removido do schema; qualquer referência em TypeScript precisa ser eliminada.
- Nenhuma mudança de UX visível para o usuário final — o comportamento de "trava/destrava" conteúdo permanece, apenas a lógica interna muda.
