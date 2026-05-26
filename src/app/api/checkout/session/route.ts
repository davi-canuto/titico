import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getStripe, buildPaymentIntentData } from "@/lib/stripe"
import { PurchaseStatus } from "@prisma/client"

const bodySchema = z.object({
  productId: z.string().min(1),
})

const appUrl = process.env.APP_URL ?? "http://localhost:3000"

export async function POST(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id ?? null

  const body = await req.json()
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "VALIDATION_ERROR", issues: parsed.error.issues }, { status: 400 })
  }

  const { productId } = parsed.data

  const product = await prisma.product.findFirst({
    where: { id: productId, active: true },
  })
  if (!product) {
    return NextResponse.json({ error: "VALIDATION_ERROR", issues: [{ message: "Product not found" }] }, { status: 400 })
  }

  if (userId) {
    const existing = await prisma.purchase.findFirst({
      where: { userId, productId, status: PurchaseStatus.COMPLETED },
    })
    if (existing) {
      return NextResponse.json({ error: "ALREADY_PURCHASED" }, { status: 409 })
    }
  }

  const paymentIntentData = buildPaymentIntentData(product.price)

  let checkoutSession
  try {
    checkoutSession = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "brl",
            unit_amount: product.price,
            product_data: { name: product.name },
          },
        },
      ],
      success_url: product.calSlug
        ? `${appUrl}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}&calSlug=${encodeURIComponent(product.calSlug)}`
        : `${appUrl}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancelado`,
      metadata: { productId, ...(userId ? { userId } : {}) },
      payment_intent_data: paymentIntentData,
    })
  } catch (err) {
    console.error("[checkout/session] Stripe error:", err)
    return NextResponse.json({ error: "STRIPE_ERROR" }, { status: 500 })
  }

  return NextResponse.json({ checkoutUrl: checkoutSession.url, sessionId: checkoutSession.id })
}
