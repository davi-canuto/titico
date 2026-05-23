import Link from "next/link"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { PurchaseStatus } from "@prisma/client"

interface Props {
  searchParams: Promise<{ session_id?: string }>
}

async function syncPurchase(sessionId: string): Promise<boolean> {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== "paid") return false

    const userId = session.metadata?.userId
    const productId = session.metadata?.productId
    if (!userId || !productId) return false

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return false
    // product is validated to exist, purchase upsert proceeds
    await prisma.purchase.upsert({
      where: { stripeSessionId: sessionId },
      create: {
        userId,
        productId,
        stripeSessionId: sessionId,
        stripePaymentId:
          typeof session.payment_intent === "string" ? session.payment_intent : null,
        status: PurchaseStatus.COMPLETED,
      },
      update: {
        status: PurchaseStatus.COMPLETED,
        stripePaymentId:
          typeof session.payment_intent === "string" ? session.payment_intent : undefined,
      },
    })
    return true
  } catch (err) {
    console.error("[checkout/sucesso] sync failed:", err)
    return false
  }
}

export default async function CheckoutSucessoPage({ searchParams }: Props) {
  const { session_id } = await searchParams

  if (session_id) {
    await syncPurchase(session_id)
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-8 text-center">

        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#4ade80]/20 bg-[#4ade80]/10">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e3001b]">
            Pagamento confirmado
          </p>
          <h1 className="text-4xl font-black uppercase leading-tight tracking-tight text-white">
            Bem-vindo ao<br />Lobby
          </h1>
          <p className="text-sm text-white/50 leading-relaxed">
            Seu acesso já está liberado. Clique abaixo para entrar no Lobby.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-[#e3001b] px-8 py-3 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015] active:bg-[#900010]"
        >
          Entrar no Lobby
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>

      </div>
    </main>
  )
}
