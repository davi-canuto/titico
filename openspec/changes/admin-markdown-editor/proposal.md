## Why

O textarea de body dos artigos no admin não oferece feedback visual — o criador escreve markdown sem saber como vai ficar. Sem preview, é fácil cometer erros de formatação que só aparecem quando o conteúdo já está publicado.

## What Changes

- O textarea de `body` nas páginas de criação e edição de artigos ganha um preview markdown ao lado
- Layout: dois painéis lado a lado (editor à esquerda, preview à direita) em telas médias+; em mobile o preview fica abaixo
- O preview é renderizado em tempo real conforme o usuário digita, usando o mesmo componente `MarkdownBody` da change `article-markdown-rendering`
- Sem nova dependência — reutiliza `react-markdown` já instalado pela change anterior

## Capabilities

### New Capabilities

- `admin-markdown-editor`: Editor de markdown com preview ao vivo no admin de artigos

### Modified Capabilities

(nenhuma)

## Impact

- **Novo:** `src/components/admin/MarkdownEditor.tsx` — Client Component com textarea + preview lado a lado
- **Modificado:** `src/app/admin/conteudos/novo/page.tsx` — usa `MarkdownEditor` no lugar do `<textarea name="body">`
- **Modificado:** `src/app/admin/conteudos/[id]/editar/page.tsx` — idem, com `defaultValue`
- **Depende de:** change `article-markdown-rendering` (usa `MarkdownBody`)
