## 1. Configuração

- [ ] 1.1 Criar (ou identificar) o produto "PDF Guia Shaco AD" na tabela `Product` do banco com `active: true`
- [ ] 1.2 Adicionar `NEXT_PUBLIC_PDF_PRODUCT_ID=<id-do-produto>` no `.env.local` e no ambiente de produção
- [ ] 1.3 Habilitar PIX no Stripe Dashboard (Settings → Payment methods → PIX) se ainda não estiver ativo

## 2. Endpoint de Checkout

- [x] 2.1 Adicionar `paymentMethod: z.enum(['card', 'pix']).optional()` ao schema Zod do body em `src/app/api/checkout/session/route.ts`
- [x] 2.2 Mapear `paymentMethod` para `payment_method_types` na criação da sessão Stripe: `'card'` → `['card']`, `'pix'` → `['pix']`, ausente → sem campo
- [x] 2.3 PIX não suporta `transfer_data`: `buildPaymentIntentData` só é chamado quando `paymentMethod !== 'pix'`

## 3. Componente PdfPaymentModal

- [x] 3.1 Criar `src/components/landing/PdfPaymentModal.tsx` como client component
- [x] 3.2 Props: `open: boolean`, `onClose: () => void`, `productId: string`, `isAuthenticated: boolean`
- [x] 3.3 Implementar overlay escuro com card central (bg `#161616`, border `white/10`, rounded-xl)
- [x] 3.4 Título "COMO VOCÊ QUER PAGAR?" com label vermelho acima
- [x] 3.5 Botão "Cartão de Crédito" — primário (bg `#e3001b`) com ícone de cartão SVG inline
- [x] 3.6 Botão "PIX" — outline (`border-white/25`) com ícone do logo PIX (SVG inline)
- [x] 3.7 Ao clicar: verificar `isAuthenticated` — se falso, `router.push('/login?callbackUrl=/')` e fechar modal
- [x] 3.8 Ao clicar com sessão: exibir loading spinner no botão clicado, `POST /api/checkout/session` com `{ productId, paymentMethod }`, redirecionar para `checkoutUrl`
- [x] 3.9 Em caso de erro da API: exibir mensagem de erro inline abaixo dos botões, restaurar estado dos botões
- [x] 3.10 Fechar ao clicar no overlay ou no X (botão no canto superior direito)
- [x] 3.11 Tecla Escape fecha o modal (`useEffect` com `keydown` listener)

## 4. Integrar na ProductsCTA

- [x] 4.1 Importar `PdfPaymentModal` e `useState` em `ProductsCTA.tsx`
- [x] 4.2 Adicionar estado `pdfModalOpen: boolean` e prop `isAuthenticated`
- [x] 4.3 Substituir `<Link href="/planos">` do card PDF por `<button onClick={() => setPdfModalOpen(true)}>`; desabilitar se `PDF_PRODUCT_ID` vazio
- [x] 4.4 Renderizar `<PdfPaymentModal>` no final do componente; `page.tsx` passa `isAuthenticated={!!session}`

## 5. Testes Manuais

- [ ] 5.1 Clicar "Comprar" sem estar logado → redireciona para `/login`
- [ ] 5.2 Clicar "Comprar" logado → modal abre com Cartão e PIX
- [ ] 5.3 Escolher Cartão → loading aparece → redireciona para Stripe Checkout com método cartão
- [ ] 5.4 Escolher PIX → loading aparece → redireciona para Stripe Checkout com QR code PIX
- [ ] 5.5 Fechar modal pelo X e pelo overlay → modal fecha sem iniciar checkout
- [ ] 5.6 Pressionar Escape → modal fecha
- [ ] 5.7 Simular erro (produto ID errado) → mensagem de erro aparece no modal
- [ ] 5.8 Verificar que os botões de Agendar Coaching e Análise continuam funcionando normalmente
