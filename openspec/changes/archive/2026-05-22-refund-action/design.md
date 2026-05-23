## Context

O perfil do usuário (`/dashboard/perfil`) exibe um botão "Solicitar reembolso" que atualmente abre um `mailto:` pré-preenchido. Isso exige que o usuário tenha cliente de email configurado e depende de processamento manual. O Stripe SDK já está instalado e o `Purchase` model armazena `stripePaymentId` — todos os ingredientes para automação já existem.

O webhook `charge.refunded` já atualiza o status para `REFUNDED` quando o Stripe notifica. A Server Action apenas antecipa essa chamada programaticamente.

## Goals / Non-Goals

**Goals:**
- Processar reembolso via `stripe.refunds.create` direto do servidor
- Validar ownership e janela de 7 dias no servidor (nunca confiar no cliente)
- Atualizar `Purchase.status = REFUNDED` imediatamente após sucesso
- Dar feedback de loading/sucesso/erro na UI sem navegação

**Non-Goals:**
- Reembolsos parciais
- Admin dashboard para gerenciar reembolsos
- Notificação por email ao usuário após reembolso (pode ser adicionado depois)
- Suporte a múltiplas compras por usuário (modelo atual: 1 purchase por usuário)

## Decisions

**Server Action vs. Route Handler**
Usar Server Action (`'use server'`) em vez de `/api/refund` route handler. Motivo: a página de perfil já é Server Component com Server Actions para logout — mantém consistência e evita criar endpoint público extra.

**Validação dupla de segurança**
A Server Action valida:
1. Sessão autenticada (`auth()`)
2. Purchase pertence ao `session.user.id` (IDOR prevention)
3. Status é `COMPLETED` (não reembolsar compra já reembolsada)
4. `createdAt` está dentro de 7 dias (regra de negócio)
5. `stripePaymentId` não é nulo (necessário para chamar a API)

**Idempotência**
O webhook `charge.refunded` já faz `updateMany({ stripePaymentId })` → `REFUNDED`. A Server Action também atualiza o banco. Se ambos rodarem (raro), o resultado final é o mesmo — sem problema de concorrência pois são updates para o mesmo valor.

**UI: formulário com `useFormState` vs. `revalidatePath`**
A página de perfil é Server Component. A Server Action chama `revalidatePath('/dashboard/perfil')` após sucesso — o Next.js re-renderiza a página com os dados atualizados. Para feedback de loading/erro, o botão de reembolso precisa ser extraído para um Client Component separado com `useTransition` ou `useFormStatus`.

## Risks / Trade-offs

**[Risco] Double-refund**: Usuário clica duas vezes antes do estado atualizar → Mitigation: validar `status === COMPLETED` no servidor antes de chamar Stripe; segunda chamada retornará erro da própria validação.

**[Risco] Stripe retorna erro (já reembolsado, payment não encontrado)**: → Mitigation: capturar erro Stripe e retornar mensagem amigável na UI sem crash.

**[Trade-off] revalidatePath causa flash de loading**: Re-render do Server Component é perceptível. → Aceitável para MVP; alternativa seria mover todo o estado de acesso para Client Component com React Query, mas isso é escopo de `client-data-cache`.
