## Context

O modelo atual usa `AccessLevel` (`FREE < BASIC < PAID < FULL`) como campo em `User`, `Content`, `Product` e `Purchase`. A função `canAccess(userLevel, contentLevel)` compara numericamente esses valores. O problema central é que esse modelo não captura "qual produto dá acesso a qual conteúdo" — é uma hierarquia global que trata todos os produtos como equivalentes se tiverem o mesmo nível.

O novo modelo é simples: um `Content` sem produtos associados é gratuito; um `Content` com produtos associados requer que o usuário tenha comprado ao menos um desses produtos.

## Goals / Non-Goals

**Goals:**
- Substituir o sistema de níveis por uma relação direta `ContentProduct` (many-to-many) entre `Content` e `Product`.
- A verificação de acesso passa a ser: "o usuário tem alguma `Purchase` `COMPLETED` para algum produto associado a este conteúdo?"
- Conteúdo sem produtos associados é gratuito (zero configuração extra).
- Um usuário pode ter múltiplas compras (uma por produto comprado).
- Admin pode associar múltiplos produtos a um conteúdo e vice-versa.

**Non-Goals:**
- Não introduzir sistema de assinatura recorrente (os produtos continuam sendo compras únicas).
- Não alterar a interface do usuário de forma perceptível — a experiência de "conteúdo travado" permanece idêntica visualmente.
- Não migrar dados históricos de `accessLevel` para o novo modelo em produção — isso é responsabilidade de um script separado pós-deploy.

## Decisions

### Tabela de junção `ContentProduct`
Relação many-to-many explícita com campos `contentId` e `productId`. `@@unique([contentId, productId])` previne duplicatas. Alternativa descartada: adicionar `String[]` de productIds ao `Content` — não é relacionamento relacional adequado, impede queries eficientes.

### "Conteúdo gratuito" = ausência de produtos associados
Um `Content` sem nenhuma entrada em `ContentProduct` é acessível a qualquer usuário autenticado. Alternativa descartada: campo booleano `isFree` — redundante e suscetível a inconsistências (conteúdo com `isFree: false` mas sem produtos).

### `Purchase.userId` deixa de ser `@unique`
Usuário pode ter várias compras, uma por produto. `@@unique([userId, productId])` previne compra duplicada do mesmo produto. A verificação "usuário já tem acesso a este produto" agora é `Purchase.findFirst({ where: { userId, productId, status: COMPLETED } })`.

### Remoção de `User.accessLevel`, `Content.accessLevel`, `Product.accessLevel`, `Purchase.accessLevel`
Todos esses campos são substituídos pelo grafo de relações. O enum `AccessLevel` é removido do schema. A função `canAccess()` e `LEVEL_ORDER` em `src/lib/access.ts` são substituídos por `userCanAccessContent(userId, contentId)` que faz uma query Prisma.

### `userCanAccessContent` como função server-side
A verificação de acesso requer uma query ao banco — não pode mais ser feita com dados do JWT. `session.user.accessLevel` é removido; o acesso é sempre verificado via query fresca no momento da request. Alternativa descartada: pre-carregar lista de productIds comprados no JWT — cresce indefinidamente conforme o usuário compra mais produtos e pode ficar stale.

### Admin: seletor de produtos em vez de accessLevel
O formulário de criação/edição de conteúdo substitui o `<select name="accessLevel">` por uma lista de checkboxes com os produtos ativos. A server action correspondente salva as relações em `ContentProduct`.

## Risks / Trade-offs

- [Migration] Dados existentes de `accessLevel` nos registros de `Content` são perdidos na migration. Conteúdos precisam ter produtos associados manualmente (via admin) após o deploy para não ficarem gratuitos por default → Mitigação: documentar e executar script de associação antes de remover os dados antigos.
- [Performance] Cada verificação de acesso agora requer uma query ao banco (join `ContentProduct` + `Purchase`). Para o volume atual é negligenciável; se escalar, adicionar índice em `Purchase(userId, status)` e `ContentProduct(productId)`. → Ambos já são criados via `@@unique` que gera índice implícito.
- [Session] `session.user.accessLevel` é removido. Qualquer código que leia essa propriedade quebrará em runtime se não atualizado. → Coberto pelas tasks.
- [Purchase única por usuário] O checkout atual verifica "já tem acesso" via `Purchase.findFirst({ userId })`. Agora precisa verificar por `productId` também — sem isso, o usuário pode recomprar o mesmo produto. → Coberto pela constraint `@@unique([userId, productId])` + atualização da rota de checkout.

## Migration Plan

1. Criar a migration Prisma com a nova tabela `ContentProduct` e remoção dos campos `accessLevel`.
2. Atualizar código (todas as 22+ referências) antes de rodar a migration em produção.
3. Após deploy, associar produtos aos conteúdos existentes via painel admin.
4. (Opcional) Script SQL para associar todos os conteúdos não-FREE ao produto principal existente.
