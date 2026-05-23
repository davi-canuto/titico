"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getStripe } from "@/lib/stripe"
import { PurchaseStatus } from "@prisma/client"

const REFUND_DAYS = 7

export async function requestRefund(purchaseId: string): Promise<{ error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Sessão inválida. Faça login novamente." }

  const purchase = await prisma.purchase.findUnique({ where: { id: purchaseId } })

  if (!purchase) return { error: "Compra não encontrada." }
  if (purchase.userId !== session.user.id) return { error: "Acesso negado." }
  if (purchase.status !== PurchaseStatus.COMPLETED) {
    return { error: "Esta compra não está elegível para reembolso." }
  }
  if (!purchase.stripePaymentId) {
    return { error: "Pagamento não encontrado. Entre em contato com o suporte." }
  }

  const deadlineAt = new Date(purchase.createdAt.getTime() + REFUND_DAYS * 24 * 60 * 60 * 1000)
  if (new Date() > deadlineAt) {
    return { error: "O prazo de reembolso de 7 dias expirou." }
  }

  try {
    await getStripe().refunds.create({ payment_intent: purchase.stripePaymentId })
  } catch {
    return { error: "Erro ao processar reembolso. Tente novamente." }
  }

  await prisma.purchase.update({
    where: { id: purchaseId },
    data: { status: PurchaseStatus.REFUNDED },
  })

  revalidatePath("/dashboard/perfil")
  return {}
}
