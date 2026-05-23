## Context

O schema atual não tem model `Bookmark`. `UserProgress` usa `@@unique([userId, contentId])` como padrão — o mesmo padrão se aplica aqui. O `ContentCard` já é um `<Link>` client-side; adicionar um botão de bookmark requer cuidado para não propagar o clique para o link pai.

## Goals / Non-Goals

**Goals:**
- Model `Bookmark` com `userId`, `contentId`, `createdAt`
- APIs REST: `GET /api/bookmarks`, `POST /api/bookmarks`, `DELETE /api/bookmarks/[contentId]`
- `BookmarkButton` client component com estado otimista (toggle imediato, sync com servidor em background)
- Seção "Salvos" no perfil com grid de ContentCard

**Non-Goals:**
- Bookmark de trilhas inteiras (apenas conteúdos individuais)
- Ordenação ou pastas de bookmarks
- Limite máximo de bookmarks por usuário nesta iteração

## Decisions

### Estado otimista no BookmarkButton

O botão alterna imediatamente no cliente ao clicar, sem esperar a resposta da API. Se a API falhar, reverte para o estado anterior. Isso evita o delay perceptível de ~200ms.

```ts
function handleToggle() {
  setBookmarked(prev => !prev) // otimista
  fetch(bookmarked ? `DELETE /api/bookmarks/${contentId}` : `POST /api/bookmarks`, ...)
    .catch(() => setBookmarked(prev => !prev)) // reverte se falhar
}
```

### ContentCard recebe `isBookmarked?: boolean` como prop

A página que renderiza o ContentCard (Server Component) busca os bookmarks do usuário e passa o estado inicial. O `BookmarkButton` é renderizado dentro do card mas com `stopPropagation` no clique para não navegar.

### GET /api/bookmarks retorna conteúdo completo

Retorna `content` com `video` include para o ContentCard renderizar corretamente. Sem paginação no MVP (bookmarks são tipicamente poucos itens).

### DELETE idempotente

Deletar um bookmark que não existe retorna `200` em vez de `404` — facilita o cliente sem precisar rastrear estado exato do servidor.

## Risks / Trade-offs

[Race condition otimista] Dois cliques rápidos podem resultar em estado inconsistente → debounce de 300ms no handler do botão

[ContentCard como Link] O botão dentro de um `<Link>` precisa de `e.preventDefault()` + `e.stopPropagation()` para não navegar → padrão bem estabelecido com `onClick`
