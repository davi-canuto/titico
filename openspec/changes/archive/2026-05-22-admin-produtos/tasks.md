## 1. Server Actions

- [x] 1.1 Adicionar `toggleProduct(id: string, active: boolean)` em `src/lib/admin-actions.ts` — chama `requireAdmin()`, atualiza `Product.active`, revalida `/planos` e `/dashboard/admin`
- [x] 1.2 Adicionar `updateProduct(id: string, formData: FormData)` em `src/lib/admin-actions.ts` — valida nome não vazio e preço numérico positivo; converte preço de reais para centavos; atualiza `Product`; revalida `/planos` e `/dashboard/admin`; redireciona para `/dashboard/admin?tab=produtos`

## 2. Aba Produtos no Admin

- [x] 2.1 Adicionar `"produtos"` como tab válida no `activeTab` em `src/app/dashboard/admin/page.tsx`
- [x] 2.2 Buscar `prisma.product.findMany({ orderBy: { createdAt: 'asc' } })` no `Promise.all` quando tab é produtos (ou sempre, para manter consistência com o padrão atual)
- [x] 2.3 Adicionar link `<Link href="/dashboard/admin?tab=produtos">` nas tabs com `tabCls("produtos")`
- [x] 2.4 Renderizar tabela de produtos com colunas: Nome, Descrição, Preço, Access Level, Status, Ações
- [x] 2.5 Badge de status: `active: true` → verde "Ativo", `active: false` → cinza "Inativo"
- [x] 2.6 Ação "Editar" → link para `/dashboard/admin/produtos/[id]/editar`
- [x] 2.7 Ação "Desativar"/"Ativar" → `<form action={toggleProduct.bind(null, p.id, !p.active)}>`

## 3. Página de Edição

- [x] 3.1 Criar `src/app/dashboard/admin/produtos/[id]/editar/page.tsx` com guard `requireAdmin()`
- [x] 3.2 Buscar produto por `id`; redirecionar para `/dashboard/admin?tab=produtos` se não encontrado
- [x] 3.3 Exibir formulário com campos: `name` (text), `description` (textarea), `price` (number, valor em reais com 2 casas decimais)
- [x] 3.4 Exibir erro "Preço inválido" se `?error=preco` na URL
- [x] 3.5 Botão "Salvar" submete para `updateProduct`; botão "Cancelar" volta para `/dashboard/admin?tab=produtos`
- [x] 3.6 Seguir design system: fundo `#0d0d0d`, campos `bg-[#161616] border-white/10`, botão primário vermelho

## 4. Validação

- [x] 4.1 Rodar `next build` sem erros de TypeScript
