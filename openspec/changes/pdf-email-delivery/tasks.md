## 1. Template de e-mail

- [x] 1.1 Adicionar função `pdfDeliveryEmail(downloadUrl, downloadPassword?)` em `src/lib/email/templates.ts` retornando `{ subject, html }` com link e senha opcional
- [x] 1.2 Adicionar helper `sendPdfDelivery(email, downloadUrl, downloadPassword?)` em `src/lib/email/index.ts` que chama `getEmailProvider().send()` com try/catch (loga erro, não relança)

## 2. Webhook Stripe

- [x] 2.1 Em `src/app/api/stripe/webhook/route.ts`, após o upsert da compra em `checkout.session.completed`, verificar se `product.downloadUrl` está definido
- [x] 2.2 Resolver o e-mail do comprador: se `userId` presente, buscar `user.email` no banco; caso contrário usar `session.customer_details.email`
- [x] 2.3 Chamar `sendPdfDelivery` com o e-mail resolvido, `downloadUrl` e `downloadPassword` (fire-and-forget dentro de try/catch)

## 3. Página de sucesso

- [x] 3.1 Em `src/app/checkout/sucesso/page.tsx`, substituir o bloco que exibe link + senha por mensagem informando que o PDF foi enviado por e-mail quando `downloadUrl` estiver presente
