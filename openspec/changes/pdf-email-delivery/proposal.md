## Why

Produtos do tipo PDF entregam o arquivo via link exibido na página de sucesso, expondo a URL e senha diretamente na tela — sem garantia de que o comprador anotou. Precisamos enviar o link de download (e senha, se houver) por e-mail imediatamente após o pagamento confirmado, tornando a entrega confiável e profissional.

## What Changes

- O webhook `checkout.session.completed` passa a enviar um e-mail de entrega quando o produto tiver `downloadUrl` configurada
- O e-mail contém o link do PDF e, se configurada, a senha do arquivo
- A página `/checkout/sucesso` deixa de exibir o link e a senha diretamente — passa a mostrar mensagem informando que o acesso foi enviado por e-mail

## Capabilities

### New Capabilities

- `pdf-delivery-email`: E-mail transacional disparado após pagamento de produto com `downloadUrl`, contendo link de download e senha opcional

### Modified Capabilities

- `stripe-webhook`: Adiciona disparo de e-mail de entrega após salvar a compra concluída
- `checkout`: Página de sucesso adapta mensagem para produtos PDF — exibe confirmação de e-mail enviado em vez do link direto

## Impact

- `src/app/api/stripe/webhook/route.ts` — adicionar envio de e-mail após upsert da compra
- `src/app/checkout/sucesso/page.tsx` — remover exibição do link/senha, mostrar mensagem de e-mail enviado
- `src/lib/email/` — adicionar template de e-mail de entrega de PDF
- Resend já está instalado e configurado; nenhuma nova dependência necessária
