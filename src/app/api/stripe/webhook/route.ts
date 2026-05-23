import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { PurchaseStatus } from "@prisma/client"
import type Stripe from "stripe"

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
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    const productId = session.metadata?.productId

    if (!userId || !productId) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
    }

    await prisma.purchase.upsert({
      where: { stripeSessionId: session.id },
      create: {
        userId,
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
