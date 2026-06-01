## 1. Componente MarkdownEditor

- [x] 1.1 Criar `src/components/admin/MarkdownEditor.tsx` como Client Component (`'use client'`)
- [x] 1.2 Props: `name: string`, `defaultValue?: string`, `rows?: number`
- [x] 1.3 Estado interno: `const [value, setValue] = useState(defaultValue ?? '')`
- [x] 1.4 Layout: `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">`
- [x] 1.5 Painel esquerdo: `<textarea name={name} value={value} onChange={e => setValue(e.target.value)} rows={rows ?? 14} className="...mesmo estilo do textarea atual..." />`
- [x] 1.6 Painel direito: label "Preview" + `<div className="min-h-[200px] rounded-xl border border-white/10 bg-[#0d0d0d] p-4 overflow-auto"><MarkdownBody>{value || '_Sem conteúdo_'}</MarkdownBody></div>`
- [x] 1.7 Importar `MarkdownBody` de `@/components/platform/MarkdownBody`

## 2. Integração nas páginas de admin

- [x] 2.1 Em `src/app/admin/conteudos/novo/page.tsx`, importar `MarkdownEditor` e substituir `<textarea name="body" required rows={12} className={textareaCls} placeholder="..." />` por `<MarkdownEditor name="body" rows={14} />`
- [x] 2.2 Em `src/app/admin/conteudos/[id]/editar/page.tsx`, substituir `<textarea name="body" required rows={14} defaultValue={content.article.body} className={textareaCls} />` por `<MarkdownEditor name="body" defaultValue={content.article.body} rows={14} />`

## 3. Verificação

- [x] 3.1 Abrir criação de artigo no admin e confirmar editor de dois painéis
- [x] 3.2 Digitar markdown (`## Título`, `**negrito**`, `- item`) e confirmar preview ao vivo
- [x] 3.3 Salvar artigo e confirmar que o body foi salvo como markdown (verificar no banco ou na página de conteúdo)
- [x] 3.4 Abrir edição de artigo existente e confirmar que o defaultValue aparece no editor
