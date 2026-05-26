export const dynamic = "force-dynamic"

import Link from "next/link"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { PurchaseStatus } from "@prisma/client"

interface Props {
  searchParams: Promise<{ session_id?: string; calSlug?: string }>
}

interface ProductInfo {
  calSlug: string | null
  downloadUrl: string | null
  downloadPassword: string | null
}

async function syncPurchase(sessionId: string): Promise<ProductInfo | null> {
  try {
    const stripeSession = await getStripe().checkout.sessions.retrieve(sessionId)
    if (stripeSession.payment_status !== "paid") return null

    const userId = stripeSession.metadata?.userId || null
    const productId = stripeSession.metadata?.productId
    if (!productId) return null

    const guestEmail = userId ? null : (stripeSession.customer_details?.email ?? null)

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return null

    await prisma.purchase.upsert({
      where: { stripeSessionId: sessionId },
      create: {
        userId,
        guestEmail,
        productId,
        stripeSessionId: sessionId,
        stripePaymentId:
          typeof stripeSession.payment_intent === "string" ? stripeSession.payment_intent : null,
        status: PurchaseStatus.COMPLETED,
      },
      update: {
        status: PurchaseStatus.COMPLETED,
        stripePaymentId:
          typeof stripeSession.payment_intent === "string" ? stripeSession.payment_intent : undefined,
      },
    })
    return {
      calSlug: product.calSlug ?? null,
      downloadUrl: product.downloadUrl ?? null,
      downloadPassword: product.downloadPassword ?? null,
    }
  } catch (err) {
    console.error("[checkout/sucesso] sync failed:", err)
    return null
  }
}

export default async function CheckoutSucessoPage({ searchParams }: Props) {
  const { session_id, calSlug: calSlugParam } = await searchParams

  let productInfo: ProductInfo | null = null
  if (session_id) {
    productInfo = await syncPurchase(session_id)
  }

  const calSlug = productInfo?.calSlug ?? calSlugParam ?? null
  const downloadUrl = productInfo?.downloadUrl ?? null
  const downloadPassword = productInfo?.downloadPassword ?? null

  return (
    <main className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-8 text-center">

        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#4ade80]/20 bg-[#4ade80]/10">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        {calSlug ? (
          <>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e3001b]">
                Pagamento confirmado
              </p>
              <h1 className="text-4xl font-black uppercase leading-tight tracking-tight text-white">
                Agora é só<br />agendar
              </h1>
              <p className="text-sm text-white/50 leading-relaxed">
                Clique abaixo para escolher o melhor horário no calendário.
              </p>
            </div>

            <a
              href={`https://cal.com/${calSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#e3001b] px-8 py-3 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015] active:bg-[#900010]"
            >
              Agendar agora
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </>
        ) : downloadUrl ? (
          <>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e3001b]">
                Pagamento confirmado
              </p>
              <h1 className="text-4xl font-black uppercase leading-tight tracking-tight text-white">
                PDF a<br />caminho
              </h1>
              <p className="text-sm text-white/50 leading-relaxed">
                Enviamos o link de download para o seu e-mail. Verifique também a caixa de spam.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#161616] px-5 py-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <p className="text-sm text-white/70">Verifique sua caixa de entrada</p>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}

      </div>
    </main>
  )
}
