## Context

Produtos com `downloadUrl` entregam o arquivo via link exibido na página `/checkout/sucesso`. A entrega depende do usuário estar presente na página e salvar o link — não há garantia de recuperação posterior. O Resend já está integrado (`src/lib/email/`) com interface `EmailProvider` e helper `sendPurchaseConfirmation`. O webhook Stripe (`checkout.session.completed`) já persiste a compra no banco.

## Goals / Non-Goals

**Goals:**
- Disparar e-mail de entrega do PDF imediatamente após pagamento confirmado, via webhook
- E-mail contém link de download e, se configurada, a senha do arquivo
- Página de sucesso exibe mensagem "enviamos para seu e-mail" para produtos PDF, sem expor link/senha

**Non-Goals:**
- Reenvio manual de e-mail pelo admin
- Geração dinâmica de senha por compra
- Upload de PDF direto pela plataforma (arquivo hospedado externamente)
- Alteração no modelo de dados (campos `downloadUrl` e `downloadPassword` já existem)

## Decisions

### 1. Disparo no webhook, não na página de sucesso

O webhook é o único ponto confiável de confirmação de pagamento — a página de sucesso pode não ser carregada (tab fechada, queda de rede). O e-mail vai para `guestEmail` (compra sem login) ou para o e-mail do usuário autenticado, buscado via `userId`.

Alternativa descartada: disparar na página de sucesso via `syncPurchase` — não confiável (SSR pode ser pulado).

### 2. Novo template `pdfDeliveryEmail` em `src/lib/email/templates.ts`

Segue o padrão dos templates existentes (`welcomeEmail`, `purchaseConfirmationEmail`) — função pura que retorna `{ subject, html }`. O webhook chama um novo helper `sendPdfDelivery(email, downloadUrl, downloadPassword?)`.

### 3. Página de sucesso: sem link, mensagem de e-mail enviado

Quando `downloadUrl` está presente no produto, a página exibe apenas confirmação de que o e-mail foi enviado. O link não é mais exibido diretamente — elimina dependência de o usuário salvar a URL na hora.

### 4. Fire-and-forget no webhook

O envio de e-mail usa `await` mas falhas não bloqueiam o `200 { received: true }` para o Stripe. Erros são logados mas não propagados — evita Stripe retentar o webhook por falha de e-mail.

## Risks / Trade-offs

- **E-mail cai em spam** → Mitigação: domínio já verificado no Resend; sem anexo (só link), menor chance de filtragem
- **userId presente mas e-mail não encontrado** → Buscar usuário no banco; logar e não enviar se não encontrado (não bloqueia a compra)
- **downloadUrl configurada incorretamente** → Fora do escopo — responsabilidade do admin; o e-mail entrega o que está configurado
