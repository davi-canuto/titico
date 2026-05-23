## Why

Os 5 planos do Sindicato do Titiltei (PDF, Módulos, Análise, Coach, Acesso) vivem apenas no seed — não há como editá-los pelo painel admin. Para ajustar preços, nomes, descrições ou ativar/desativar um plano sem precisar mexer no código e rodar o seed novamente, o admin precisa de uma aba de gerenciamento de Produtos.

## What Changes

- Adicionar aba "Produtos" na página `/dashboard/admin` (ao lado de Conteúdos, Trilhas, Analytics)
- Listar todos os produtos com nome, descrição, preço formatado, access level e status ativo/inativo
- Ações inline por produto: ativar/desativar (toggle `active`)
- Página de edição `/dashboard/admin/produtos/[id]/editar` com formulário para nome, descrição e preço
- Server Actions: `toggleProduct(id, active)` e `updateProduct(id, formData)` em `src/lib/admin-actions.ts`

## Capabilities

### New Capabilities

- `admin-product-management`: Gerenciamento de produtos/planos pelo painel admin — listagem, edição de nome/descrição/preço e toggle de ativo/inativo.

### Modified Capabilities

- `admin-content-management`: A página `/dashboard/admin` recebe nova aba "Produtos" no mesmo padrão visual das abas existentes.

## Impact

- `src/app/dashboard/admin/page.tsx` — nova aba Produtos + tab logic
- `src/app/dashboard/admin/produtos/[id]/editar/page.tsx` — novo formulário de edição
- `src/lib/admin-actions.ts` — `toggleProduct` e `updateProduct`
