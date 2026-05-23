## 1. Schema Prisma — Model Creator

- [x] 1.1 Adicionar model `Creator` com campos `id`, `slug` (`@unique`), `name`, `champion`, `description?`, `avatarUrl?`, `bannerUrl?`, `active`, `createdAt`; relações `products Product[]` e `contents Content[]`
- [x] 1.2 Adicionar campo `creatorId String` (FK para `Creator`) em `Product` como nullable na primeira migration
- [x] 1.3 Adicionar campo `creatorId String` (FK para `Creator`) em `Content` como nullable na primeira migration
- [x] 1.4 Rodar `npx prisma migrate dev --name add-creator-model` para gerar a primeira migration
- [x] 1.5 Em `prisma/seed.ts`: criar o Creator Titiltei (`slug: "titiltei", name: "Titiltei", champion: "Shaco"`) e atualizar todos os `Product` e `Content` existentes com o `id` do Titiltei
- [x] 1.6 Rodar segunda migration para tornar `creatorId` `NOT NULL` em ambas as tabelas: `npx prisma migrate dev --name make-creator-id-required`
- [x] 1.7 Rodar `npx prisma generate` para atualizar o Prisma Client

## 2. API de Creators

- [x] 2.1 Criar `src/app/api/creators/route.ts`: `GET /api/creators` retorna todos os creators com `active: true`, campos `id`, `slug`, `name`, `champion`, `description`, `avatarUrl`, `bannerUrl`

## 3. API de Products — filtro por creator

- [x] 3.1 Em `src/app/api/products/route.ts`: ler query param `?creatorSlug`; se presente, adicionar `where: { creator: { slug: creatorSlug } }` à query Prisma; incluir `creator: { select: { slug, name, champion } }` na resposta

## 4. Explorar — filtro por creator

- [x] 4.1 Em `src/app/dashboard/explorar/page.tsx`: ler `searchParams.creator`; se presente, adicionar `where: { creator: { slug: creator } }` ao `prisma.content.findMany`; preservar o param `?creator` ao clicar nos chips de tipo

## 5. Admin — Creator CRUD

- [x] 5.1 Adicionar seção "Criadores" na página `src/app/dashboard/admin/page.tsx`: tabela listando todos os creators com `name`, `slug`, `champion`, `active` e contagem de produtos/conteúdos
- [x] 5.2 Adicionar server action `createCreator(formData)` em `src/lib/admin-actions.ts` para criar um `Creator`
- [x] 5.3 Adicionar server action `toggleCreatorActive(creatorId)` para ativar/desativar um creator

## 6. Admin — Seletor de Creator nos Formulários

- [x] 6.1 Em `src/app/dashboard/admin/conteudos/novo/page.tsx`: buscar creators ativos e adicionar `<select name="creatorId">` como campo obrigatório antes de title
- [x] 6.2 Em `src/app/dashboard/admin/conteudos/[id]/editar/page.tsx`: buscar creators ativos e adicionar seletor de creator pré-preenchido com o valor atual
- [x] 6.3 Em `src/lib/admin-actions.ts` (server action de criação/edição de conteúdo): incluir `creatorId` no `data` do `prisma.content.create` / `prisma.content.update`
- [x] 6.4 Na interface de criação/gestão de produtos no admin: adicionar `<select name="creatorId">` e persistir o `creatorId` ao criar/editar um produto

## 7. Plans Page — agrupamento por creator

- [x] 7.1 Em `src/app/planos/page.tsx`: agrupar produtos por `creator.slug` antes de renderizar; se houver mais de um creator, exibir o nome e campeão do creator como cabeçalho de seção antes dos cards; atualizar hero para "LOBBY DO TITILTEI"

## 8. Rebrand de Texto — "Bar" → "Lobby"

- [x] 8.1 Em `src/app/layout.tsx`: substituir "Bar do Tititliei" por "Lobby do Titiltei" no `title`, `description` e `openGraph`
- [x] 8.2 Em `src/components/landing/Hero.tsx`: substituir "Bar do Tititliei" / "Bar" por "Lobby do Titiltei" / "Lobby"
- [x] 8.3 Em `src/components/landing/LandingHeader.tsx`: substituir "Entrar no Bar" por "Entrar no Lobby"
- [x] 8.4 Em `src/components/landing/PricingSection.tsx`: substituir "Bar do Tititliei" / "Bar" por "Lobby do Titiltei" / "Lobby"
- [x] 8.5 Em `src/components/landing/MatchupGrid.tsx`: substituir "Entrar no Bar" por "Entrar no Lobby"
- [x] 8.6 Em `src/app/(auth)/login/page.tsx`: substituir "Bar" / "Bar do Tititliei" por "Lobby" / "Lobby do Titiltei"
- [x] 8.7 Em `src/app/dashboard/page.tsx`: substituir "Bar do Tititliei" por "Lobby do Titiltei"
- [x] 8.8 Em `src/app/dashboard/perfil/page.tsx`: substituir "Bar" por "Lobby" nos textos de acesso e CTAs
- [x] 8.9 Em `src/app/planos/page.tsx`: substituir "Bar do Tititliei" / "Bar" por "Lobby do Titiltei" / "Lobby" (além do agrupamento da task 7.1)
- [x] 8.10 Em `src/app/checkout/sucesso/page.tsx`: substituir "Bar" por "Lobby"
- [x] 8.11 Em `src/lib/email/templates/welcome.ts`: substituir "Bar do Tititliei" / "BAR DO TITITLIEI" por "Lobby do Titiltei" / "LOBBY DO TITILTEI" no subject e no HTML
- [x] 8.12 Em `prisma/seed.ts`: atualizar nome do produto "Acesso ao Bar do Tititliei" para "Acesso ao Lobby do Titiltei"
