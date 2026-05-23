## Context

`sendPurchaseConfirmation(to, name, productName)` está em `src/lib/email/send.ts` e já foi testado. O webhook `POST /api/stripe/webhook` ainda não está implementado (está na `stripe-integration` change). Esta change define onde e como a chamada é inserida.

## Goals / Non-Goals

**Goals:**
- Dentro do handler de `checkout.session.completed`, após o upsert da Purchase, disparar `sendPurchaseConfirmation` com os dados do usuário e produto
- Fire-and-forget com `void` — não bloquear a resposta `{ received: true }` ao Stripe
- Buscar `user.email`, `user.name`, e `product.name` via Prisma para montar o email

**Non-Goals:**
- Retry de email em caso de falha (já tratado com try/catch e log no `sendPurchaseConfirmation`)
- Email de reembolso (`charge.refunded`) — fora de escopo
- Mudança no template

## Decisions

### Buscar dados do usuário e produto no mesmo handler

O webhook já busca `userId` e `productId` do `metadata`. Adicionar um `prisma.user.findUnique` e um `prisma.product.findUnique` (ou incluir no upsert) para obter email, nome e nome do produto.

```ts
// Após o upsert da Purchase:
const [user, product] = await Promise.all([
  prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } }),
  prisma.product.findUnique({ where: { id: productId }, select: { name: true } }),
])
if (user?.email && product?.name) {
  void sendPurchaseConfirmation(user.email, user.name ?? '', product.name)
}
```

### Dependência da stripe-integration change

Esta change modifica o webhook handler que a `stripe-integration` cria. Na prática, o email deve ser implementado junto com o webhook ou imediatamente após. As tasks refletem isso — são tasks adicionais ao handler já implementado.

## Risks / Trade-offs

[Email disparado antes de commit do banco] Se o Prisma upsert suceder mas o banco fizer rollback (raro) → o email é enviado mas a Purchase não existe → aceitável (caso extremamente raro, email é melhor que não enviar)

[Dados de usuário deletados] Se o userId do metadata não existir mais no banco → `user` será null, email não é enviado → aceitável com log de aviso
