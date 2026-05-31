## Context

A renderização atual está em `ProgressTracker.tsx:195`: `<p className="whitespace-pre-wrap">{content.article.body}</p>`. Uma linha. O preview trunca por `split('\n\n')` e exibe parágrafos simples. Ambos precisam do mesmo componente de renderização.

## Goals / Non-Goals

**Goals:**
- Renderizar markdown com headers, listas, negrito, itálico, código, links, separadores
- Estilos consistentes com o design system (fundo escuro, texto branco, vermelho para destaques)
- Sanitização XSS

**Non-Goals:**
- Editor markdown no admin (melhoria #5, change separada)
- Suporte a tabelas ou HTML raw embutido
- Syntax highlighting em blocos de código (sem Prism/highlight.js — só estilo de fundo)

## Decisions

### D1: react-markdown + rehype-sanitize

`react-markdown` é a opção mais idiomática para Next.js/React. Renderiza markdown via AST sem `dangerouslySetInnerHTML`. `rehype-sanitize` adiciona sanitização XSS no pipeline rehype. Alternativa `marked` geraria HTML string e exigiria `dangerouslySetInnerHTML` — descartado por segurança.

### D2: Componente `MarkdownBody` como Client Component

`react-markdown` funciona em Server Components, mas os custom renderers com estilos Tailwind são mais simples de manter em um Client Component isolado. O componente é pequeno e folha — não propaga `'use client'` para cima.

### D3: Estilos via `components` prop do react-markdown

Cada elemento markdown recebe uma classe Tailwind via `components={{ h2: ..., ul: ..., code: ... }}`. Sem CSS global ou `prose` do Tailwind Typography — mantém controle total sobre o visual sem nova dependência.

**Estilos definidos:**
- `h2`: `text-xl font-black uppercase tracking-tight text-white mt-8 mb-3 border-l-2 border-[#e3001b] pl-3`
- `h3`: `text-base font-black uppercase tracking-tight text-white mt-6 mb-2`
- `ul`: `space-y-2 my-4`
- `li` (ul): bullet `·` em vermelho `#e3001b`
- `ol`: `list-decimal pl-5 space-y-2 my-4 text-white/80`
- `strong`: `text-white font-bold`
- `em`: `italic text-white/80`
- `code` (inline): `bg-[#161616] border border-white/10 rounded px-1.5 py-0.5 text-sm font-mono text-white/90`
- `pre` (bloco): `bg-[#161616] border border-white/10 rounded-xl p-4 overflow-x-auto my-4`
- `a`: `text-[#e3001b] hover:underline`
- `hr`: `border-white/10 my-8`
- `p`: `text-white/80 leading-relaxed`

## Risks / Trade-offs

- **[Trade-off] Bundle size** → `react-markdown` adiciona ~30kB gzip. Aceitável dado que só carrega na página de conteúdo (lazy por rota).
- **[Risco] Artigos existentes em texto puro** → Texto sem markdown renderiza identicamente: parágrafos separados por linha em branco viram `<p>`, o resto é texto puro. Sem regressão.
