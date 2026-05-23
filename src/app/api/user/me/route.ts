import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PurchaseStatus } from "@prisma/client"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    include: { purchases: { where: { status: PurchaseStatus.COMPLETED }, include: { product: true } } },
  })

  if (!user) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })

  const hasAccess = user.purchases.length > 0

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    hasAccess,
    purchases: user.purchases.map((p) => ({
      id: p.id,
      status: p.status,
      productId: p.productId,
      productName: p.product.name,
      createdAt: p.createdAt,
    })),
  })
}
