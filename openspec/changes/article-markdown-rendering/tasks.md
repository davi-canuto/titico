## 1. Dependências

- [x] 1.1 Instalar `react-markdown` e `rehype-sanitize`: `npm install react-markdown rehype-sanitize`

## 2. Componente MarkdownBody

- [x] 2.1 Criar `src/components/platform/MarkdownBody.tsx` como Client Component (`'use client'`)
- [x] 2.2 Props: `children: string` (o body markdown)
- [x] 2.3 Importar `ReactMarkdown` de `react-markdown` e `rehypeSanitize` de `rehype-sanitize`
- [x] 2.4 Passar `rehypePlugins={[rehypeSanitize]}` para sanitização XSS
- [x] 2.5 Definir `components` prop com estilos Tailwind para cada elemento:
  - `h2`: `text-xl font-black uppercase tracking-tight text-white mt-8 mb-3 border-l-2 border-[#e3001b] pl-3`
  - `h3`: `text-base font-black uppercase tracking-tight text-white mt-6 mb-2`
  - `p`: `text-white/80 leading-relaxed my-2`
  - `ul`: `my-4 space-y-2`
  - `ol`: `list-decimal pl-5 space-y-2 my-4 text-white/80`
  - `li` (dentro de `ul`): flex com bullet `·` em `text-[#e3001b] font-black mr-2` + `text-white/80`
  - `strong`: `text-white font-bold`
  - `em`: `italic text-white/80`
  - `a`: `text-[#e3001b] hover:underline`
  - `hr`: `border-white/10 my-8`
  - `code` (inline, sem `node.properties.className`): `bg-[#161616] border border-white/10 rounded px-1.5 py-0.5 text-sm font-mono text-white/90`
  - `pre`: `bg-[#161616] border border-white/10 rounded-xl p-4 overflow-x-auto my-4 text-sm font-mono text-white/80`

## 3. Integração no ProgressTracker

- [x] 3.1 Em `src/components/platform/ProgressTracker.tsx`, importar `MarkdownBody`
- [x] 3.2 Substituir `<p className="whitespace-pre-wrap leading-relaxed text-white/80">{content.article.body}</p>` por `<MarkdownBody>{content.article.body}</MarkdownBody>`

## 4. Integração no Preview

- [x] 4.1 Em `src/app/preview/[contentId]/page.tsx`, importar `MarkdownBody`
- [x] 4.2 Na função `PreviewBody`, para o caso `ARTICLE`, substituir os `<p>` simples por `<MarkdownBody>{meta.bodyTruncated.join('\n\n')}</MarkdownBody>`

## 5. Verificação

- [x] 5.1 Criar ou editar um artigo no admin com markdown (ex: `## Título\n\n**negrito** e *itálico*\n\n- item 1\n- item 2`) e confirmar renderização correta em `/lobby/conteudo/[slug]`
- [x] 5.2 Confirmar que artigo com texto puro (sem markdown) continua renderizando sem regressão
- [x] 5.3 Confirmar que o preview `/preview/[contentId]` também renderiza os parágrafos truncados com markdown
- [x] 5.4 Verificar que `<script>alert(1)</script>` no body não executa (sanitização XSS)
