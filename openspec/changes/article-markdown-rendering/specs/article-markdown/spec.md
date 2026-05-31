## ADDED Requirements

### Requirement: Renderização markdown no body de artigos
O sistema SHALL renderizar o campo `body` do `ArticleMeta` como markdown na página de conteúdo e no preview público, com estilos consistentes com o design system.

#### Scenario: Artigo com markdown renderizado na página de conteúdo
- **WHEN** um usuário autenticado acessa `/lobby/conteudo/[slug]` de um conteúdo do tipo `ARTICLE`
- **THEN** o `body` é renderizado com headers (`h2`, `h3`), listas, negrito, itálico, código inline, blocos de código, links e separadores formatados
- **THEN** o HTML gerado é sanitizado — tags e atributos não permitidos são removidos

#### Scenario: Artigo com texto puro (sem markdown)
- **WHEN** o `body` não contém sintaxe markdown
- **THEN** o conteúdo é exibido como parágrafos normais, sem regressão visual

#### Scenario: Preview público de artigo com markdown
- **WHEN** um visitante acessa `/preview/[contentId]` de um artigo
- **THEN** os primeiros 2 parágrafos truncados são renderizados como markdown (não como texto puro)

#### Scenario: Sanitização XSS
- **WHEN** o `body` contém tags HTML como `<script>` ou atributos `onerror`
- **THEN** essas tags e atributos são removidos antes da renderização — nenhum script é executado
