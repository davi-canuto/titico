## Why

O corpo dos artigos é exibido como texto puro com `whitespace-pre-wrap` — sem títulos internos, listas, negrito ou código. Isso limita severamente a qualidade do material educacional que o Titiltei pode publicar.

## What Changes

- O campo `body` do `ArticleMeta` passa a ser interpretado como markdown no frontend
- `ProgressTracker` substitui a renderização `<p whitespace-pre-wrap>` por um componente `MarkdownBody` que converte markdown em HTML estilizado
- O mesmo componente é usado no `/preview/[contentId]` para renderizar os parágrafos truncados
- Sem mudança de schema — `body` continua `String`; artigos existentes em texto puro continuam funcionando
- Sanitização de HTML para evitar XSS

## Capabilities

### New Capabilities

- `article-markdown`: Renderização de markdown no body de artigos com estilos do design system

### Modified Capabilities

(nenhuma — a spec de `content` não muda requisitos, apenas a implementação de renderização)

## Impact

- **Novo:** `src/components/platform/MarkdownBody.tsx` — Client Component que renderiza markdown com estilos do projeto
- **Modificado:** `src/components/platform/ProgressTracker.tsx` — usa `MarkdownBody` para artigos
- **Modificado:** `src/app/preview/[contentId]/page.tsx` — `PreviewBody` usa `MarkdownBody` para artigos
- **Nova dependência:** `react-markdown` + `rehype-sanitize`
