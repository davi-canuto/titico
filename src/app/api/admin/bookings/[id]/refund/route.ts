import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getStripe } from "@/lib/stripe"
import { BookingStatus, UserRole } from "@prisma/client"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const { id } = await params

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { purchase: true },
  })
  if (!booking) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
  if (booking.status === BookingStatus.REFUNDED) {
    return NextResponse.json({ error: "ALREADY_REFUNDED" }, { status: 409 })
  }

  if (!booking.purchase?.stripePaymentId) {
    return NextResponse.json(
      { error: "PIX_PAYMENT", message: "Estorno não disponível para pagamentos PIX — processe manualmente no painel Woovi." },
      { status: 422 }
    )
  }

  await getStripe().refunds.create({ payment_intent: booking.purchase.stripePaymentId })
  await prisma.booking.update({ where: { id }, data: { status: BookingStatus.REFUNDED } })

  return NextResponse.json({ ok: true })
}
