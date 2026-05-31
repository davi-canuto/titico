## Context

As páginas de novo/editar conteúdo são Server Components com `<form action={serverAction}>`. O `<textarea name="body">` é um campo de formulário simples. Para ter preview ao vivo, o componente precisa ser um Client Component — mas o formulário pode continuar sendo Server Action.

## Goals / Non-Goals

**Goals:**
- Preview ao vivo enquanto digita
- O valor do textarea continua sendo submetido normalmente pelo formulário (compatível com Server Actions)

**Non-Goals:**
- Toolbar de formatação (negrito/itálico via botão)
- Upload de imagens
- Autosave

## Decisions

### D1: Componente `MarkdownEditor` com `<textarea>` interno

Client Component que recebe `defaultValue?: string` e `name: string`. Mantém o texto em `useState`. O `<textarea name={name}>` submete normalmente com o formulário. O preview usa `MarkdownBody` do lado direito.

### D2: Layout com CSS Grid — 50/50 em md+

`grid grid-cols-1 md:grid-cols-2 gap-4`. Em mobile empilha verticalmente (editor em cima, preview embaixo). Sem biblioteca de layout.

### D3: Depende de `article-markdown-rendering` estar implementado

`MarkdownEditor` importa `MarkdownBody`. Se a change de markdown ainda não foi implementada, este editor não pode ser usado. As tasks devem ser aplicadas após a melhoria #2.

## Risks / Trade-offs

- **[Trade-off] Client Component em página de admin** → O formulário tem `action={serverAction}`, que funciona normalmente mesmo com Client Components internos no Next.js App Router.
