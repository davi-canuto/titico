import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createCharge } from "@/lib/woovi"

const bodySchema = z.object({
  productId: z.string().min(1),
  guestEmail: z.string().email().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const siteConfig = await prisma.siteConfig.findUnique({ where: { id: "global" } })
    if (!siteConfig?.pixEnabled) {
      return NextResponse.json({ error: "PIX_DISABLED" }, { status: 503 })
    }

    const session = await auth()
    const userId = session?.user?.id ?? null

    const body = await req.json()
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "VALIDATION_ERROR" }, { status: 400 })
    }

    const { productId, guestEmail } = parsed.data

    if (!userId && !guestEmail) {
      return NextResponse.json({ error: "EMAIL_REQUIRED" }, { status: 400 })
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, active: true },
      include: { creator: { select: { pixKey: true } } },
    })
    if (!product) {
      return NextResponse.json({ error: "PRODUCT_NOT_FOUND" }, { status: 400 })
    }

    if (userId) {
      const existing = await prisma.purchase.findFirst({
        where: { userId, productId, status: "COMPLETED" },
      })
      if (existing) {
        return NextResponse.json({ error: "ALREADY_PURCHASED" }, { status: 409 })
      }
    }

    const correlationID = `pix-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

    await prisma.purchase.create({
      data: {
        userId,
        guestEmail: userId ? null : (guestEmail ?? null),
        productId,
        stripeSessionId: correlationID,
      },
    })

    const splits =
      product.creator.pixKey
        ? [{ pixAlias: { key: product.creator.pixKey }, value: Math.floor(product.price * 0.8) }]
        : undefined

    try {
      const charge = await createCharge({
        correlationID,
        value: product.price,
        comment: product.name,
        splits,
      })
      return NextResponse.json(charge, { status: 201 })
    } catch (err) {
      await prisma.purchase.delete({ where: { stripeSessionId: correlationID } }).catch(() => {})
      console.error("[checkout/pix] Woovi error:", err)
      return NextResponse.json({ error: "WOOVI_ERROR" }, { status: 500 })
    }
  } catch (err) {
    console.error("[checkout/pix] unexpected error:", err)
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
  }
}
