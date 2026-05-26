## Context

O model `Product` tem apenas `id` (cuid gerado) como identificador. O frontend usa um ID literal `'prod_pdf_guia_shaco_ad'` em `ProductsCTA` que nunca existiu no banco — o produto é buscado por esse valor e sempre retorna nulo. A solução é adicionar `slug` ao model, preencher nos forms de admin, e usar slug para lookup na landing page (passando o `id` real para o modal de pagamento).

## Goals / Non-Goals

**Goals:**
- Campo `slug` único e obrigatório no `Product`
- Admin gera slug automaticamente a partir do nome (kebab-case), mas permite edição manual
- `createProduct` e `updateProduct` persistem o slug, validando unicidade
- Landing page busca o produto PDF por slug server-side e passa o `id` real para `ProductsCTA`

**Non-Goals:**
- Slugs em rotas públicas de produto (não existe página `/produtos/[slug]`)
- Alterar o fluxo de checkout ou webhook — continuam usando `id`
- Migração automática de slugs via script complexo — backfill simples com `id` como slug temporário

## Decisions

### 1. `slug` obrigatório com backfill no migration

A migration adiciona `slug` como `TEXT UNIQUE NOT NULL` com `DEFAULT ''` temporário, faz um `UPDATE` para preencher os slugs existentes com o próprio `id` (garante unicidade), depois remove o default. Assim produtos existentes não quebram.

### 2. Geração automática no cliente (JavaScript)

O campo slug no form admin é pré-preenchido via `oninput` no campo nome: `value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')`. O usuário pode sobrescrever. Isso evita round-trip ao servidor só para gerar slug.

### 3. Landing page server-side lookup

A landing page (server component) recebe o slug configurado como constante e busca o produto via `prisma.product.findUnique({ where: { slug } })`. Se encontrado, passa `product.id` como prop `pdfProductId` para `ProductsCTA`. Se não encontrado, `pdfProductId` é `null` e o botão fica desabilitado.

### 4. `ProductsCTA` recebe `pdfProductId: string | null` como prop

Remove o ID hardcoded do componente cliente. Toda a lógica de lookup fica no server component pai.

## Risks / Trade-offs

- **Slug duplicado no admin** → `updateProduct` deve validar unicidade excluindo o próprio produto (igual ao slug de conteúdo já implementado); redirecionar com `?error=slug` se conflito
- **Produtos existentes sem slug** → backfill com `id` garante que o banco não quebre; admin precisará editar para definir um slug legível
- **Constante de slug na landing** → se o admin mudar o slug do produto PDF, precisa atualizar a constante no código — tradeoff aceitável para simplicidade
