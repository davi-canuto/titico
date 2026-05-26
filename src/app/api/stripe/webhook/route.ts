import { NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { PurchaseStatus } from "@prisma/client"
import type Stripe from "stripe"
import { sendPdfDelivery } from "@/lib/email/send"

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set")
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 })
  }

  const rawBody = Buffer.from(await req.arrayBuffer())
  const sig = req.headers.get("stripe-signature")
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId || null
    const productId = session.metadata?.productId
    const guestEmail = userId ? null : (session.customer_details?.email ?? null)

    if (!productId) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })

    await prisma.purchase.upsert({
      where: { stripeSessionId: session.id },
      create: {
        userId,
        guestEmail,
        productId,
        stripeSessionId: session.id,
        stripePaymentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
        status: PurchaseStatus.COMPLETED,
      },
      update: {
        status: PurchaseStatus.COMPLETED,
        stripePaymentId: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
      },
    })

    if (product?.downloadUrl) {
      let buyerEmail: string | null = guestEmail ?? session.customer_details?.email ?? null
      if (userId && !buyerEmail) {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } })
        buyerEmail = user?.email ?? null
      }
      if (buyerEmail) {
        await sendPdfDelivery(buyerEmail, product.downloadUrl, product.downloadPassword ?? undefined)
      } else {
        console.error("[stripe/webhook] PDF product purchased but buyer email not found — skipping delivery email")
      }
    }
  } else if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge
    if (charge.payment_intent && typeof charge.payment_intent === "string") {
      await prisma.purchase.updateMany({
        where: { stripePaymentId: charge.payment_intent },
        data: { status: PurchaseStatus.REFUNDED },
      })
    }
  }

  return NextResponse.json({ received: true })
}
