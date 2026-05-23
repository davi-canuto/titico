## Why

O nome "Bar do Tititliei" ainda é centrado em um único criador. A plataforma evolui para ser um **hub de mono-champs** — hoje é o Titiltei (Shaco), amanhã pode entrar o Malandrao e outros. Para suportar isso sem reescrever o sistema, precisamos de um modelo `Creator` que represente cada mono-champ como uma entidade independente, com seus próprios produtos e conteúdos. O nome da plataforma passa a ser **Lobby do Titiltei** — o "lobby" que agrega esses criadores.

## What Changes

### Rebrand de texto
- Substituir todas as ocorrências de "Bar do Tititliei" e "Bar" (como nome da marca) por "Lobby do Titiltei" / "Lobby" nos mesmos arquivos alterados pelo change `rebrand-bar-do-tititliei`.

### Novo modelo `Creator`
- Introduzir o model `Creator` no schema Prisma com campos: `id`, `slug` (único, kebab-case), `name`, `champion`, `description`, `avatarUrl`, `bannerUrl`, `active`, `createdAt`.
- `Product` recebe campo `creatorId` (FK para `Creator`).
- `Content` recebe campo `creatorId` (FK para `Creator`).
- Seed cria o primeiro `Creator`: Titiltei (Shaco) e reassocia os produtos e conteúdos existentes a ele.

### Superfícies afetadas pelo `Creator`
- `GET /api/products` pode filtrar por `?creatorSlug=titiltei`.
- `GET /api/contents` e Explorar podem filtrar por creator.
- Página pública de creator: `/[creatorSlug]` ou `/criadores/[slug]` — fora do escopo desta change (listado como Non-Goal).
- Admin: seletor de creator ao criar produto ou conteúdo.

## Capabilities

### New Capabilities
- `creator`: Model `Creator`, CRUD básico via admin, relações com `Product` e `Content`.

### Modified Capabilities
- `content`: `Content` recebe `creatorId` obrigatório (FK `Creator`).
- `products`: `Product` recebe `creatorId` obrigatório (FK `Creator`); `GET /api/products` aceita filtro `?creatorSlug`.
- `admin-content-management`: formulário de criação/edição de conteúdo adiciona seletor de creator.
- `plans-page`: página de planos exibe produtos agrupados ou filtrados por creator.
- `explorar`: página de explorar suporta filtro por creator.
- `email-service`: textos do email de boas-vindas usam "Lobby do Titiltei".
- `login-page`: textos da página de login usam "Lobby do Titiltei".
- `dashboard`: heading usa "Lobby do Titiltei".

## Impact

- **Schema Prisma**: novo model `Creator`; FK `creatorId` em `Content` e `Product`; migration com dados (seed do Creator inicial).
- **~15 arquivos de código** afetados por rebrand de texto.
- **~8 arquivos** afetados pela introdução do `creatorId` (APIs, admin, seed).
- **Backwards-compatible**: o sistema continua funcionando com um único creator (Titiltei) — adicionar outro creator não quebra nada existente.
- Página pública por creator (`/criadores/[slug]`) é Non-Goal desta change — entra em change futura.
