## Context

A plataforma hoje tem `Product` e `Content` sem qualquer noção de "de quem é esse conteúdo". Isso funciona com um único creator, mas não escala. O model `Creator` é a peça central que permite isolar o catálogo de cada mono-champ e no futuro personalizar a experiência por criador (página própria, branding, produtos).

O rebrand de texto ("Bar" → "Lobby") segue o mesmo padrão do change anterior — substituição direta de strings em ~15 arquivos.

## Goals / Non-Goals

**Goals:**
- Introduzir `Creator` como entidade de primeira classe no schema.
- `Product.creatorId` e `Content.creatorId` são obrigatórios — todo conteúdo e produto pertence a um creator.
- Seed cria Titiltei como o creator inicial e associa tudo a ele.
- Admin consegue selecionar o creator ao criar/editar conteúdo e produtos.
- `GET /api/products?creatorSlug=titiltei` filtra produtos por creator.
- Explorar aceita `?creator=titiltei` para filtrar conteúdos.
- Rebrand completo de "Bar do Tititliei" → "Lobby do Titiltei" em todos os textos.

**Non-Goals:**
- Página pública por creator (`/criadores/[slug]`) — change futura.
- Sistema de autenticação separado por creator (cada creator gerencia seu próprio acesso) — fora do escopo.
- Multi-tenancy de admin (um creator gerenciar apenas seus conteúdos, sem ver os de outros) — fora do escopo.
- Usuário seguir/favoritar um creator.

## Decisions

### `Creator` como model independente, não enum
Alternativa descartada: enum `CreatorSlug { TITILTEI MALANDRAO }`. Um enum exigiria deploy para cada novo creator. Model independente permite adicionar creators via admin sem tocar em código.

### `creatorId` obrigatório (não nullable) em `Content` e `Product`
Todo conteúdo pertence a um creator — não faz sentido ter conteúdo "órfão". O seed garante que Titiltei existe antes de qualquer `Content` ou `Product` ser criado. Migration com `@default` não é possível para FK; a migration define o `creatorId` do Titiltei como valor padrão via SQL raw ou cria o Creator antes de alterar as tabelas.

### Estratégia de migration para `creatorId`
1. Criar o Creator Titiltei no seed.
2. A migration adiciona `creatorId` como nullable inicialmente.
3. Script de migration preenche todos os registros existentes com o `id` do Titiltei.
4. Migration final torna o campo `NOT NULL`.
Alternativa descartada: coluna `NOT NULL` desde o início — quebraria registros existentes sem valor padrão.

### Filtro por creator no `GET /api/products` via query param
`?creatorSlug=titiltei` filtra no servidor. Sem filtro, retorna todos os produtos ativos de todos os creators (backward-compatible para o frontend atual). Alternativa: rotas separadas `/api/creators/[slug]/products` — mais RESTful, mas adiciona complexidade de roteamento sem ganho imediato.

### `slug` do Creator como identificador público
`Creator.slug` (ex: `"titiltei"`, `"malandrao"`) é usado nas URLs e query params. Imutável após criação para não quebrar links.

## Risks / Trade-offs

- [Migration destrutiva parcial] Adicionar `creatorId NOT NULL` em tabelas com dados exige o processo de 2 steps (nullable → preenche → NOT NULL). Se feito errado, a migration falha. → Mitigação: usar a estratégia documentada acima.
- [Admin sem isolamento] Um admin vê e edita conteúdo de todos os creators. Aceitável enquanto há um único admin; isolamento por creator é Non-Goal.
- [Filtro de products sem creator param] Retorna todos os produtos — pode confundir a `/planos` se houver múltiplos creators com produtos. → Quando o segundo creator entrar, a `/planos` deverá ser atualizada para agrupar por creator ou filtrar por um específico.
