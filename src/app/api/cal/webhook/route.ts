import { NextRequest, NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"
import { prisma } from "@/lib/prisma"
import { BookingStatus, PurchaseStatus } from "@prisma/client"

function verifySignature(raw: string, signature: string): boolean {
  const secret = process.env.CAL_WEBHOOK_SECRET
  if (!secret) return false
  const expected = createHmac("sha256", secret).update(raw).digest("hex")
  if (signature.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

export async function POST(req: NextRequest) {
  const raw = await req.text()
  const signature = req.headers.get("x-cal-signature-256") ?? ""

  if (!verifySignature(raw, signature)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: true })
  }

  const payload = body as Record<string, unknown>
  const triggerEvent = payload.triggerEvent as string | undefined
  const booking = payload.payload as Record<string, unknown> | undefined

  if (!triggerEvent || !booking) return NextResponse.json({ ok: true })

  if (triggerEvent === "BOOKING_CREATED") {
    const calBookingId = String(booking.uid ?? booking.id ?? "")
    const scheduledAt = new Date(booking.startTime as string)
    const attendee = (booking.attendees as { name: string; email: string }[])?.[0]

    if (!calBookingId || !attendee) return NextResponse.json({ ok: true })

    const purchase = await prisma.purchase.findFirst({
      where: {
        status: PurchaseStatus.COMPLETED,
        product: { calSlug: { not: null } },
        booking: null,
        OR: [
          { user: { email: attendee.email } },
          { guestEmail: attendee.email },
        ],
      },
      orderBy: { createdAt: "desc" },
    })

    await prisma.booking.upsert({
      where: { calBookingId },
      update: {},
      create: {
        calBookingId,
        scheduledAt,
        attendeeName: attendee.name,
        attendeeEmail: attendee.email,
        status: BookingStatus.PENDING,
        purchaseId: purchase?.id ?? null,
      },
    })
  }

  if (triggerEvent === "BOOKING_CANCELLED") {
    const calBookingId = String(booking.uid ?? booking.id ?? "")
    if (!calBookingId) return NextResponse.json({ ok: true })

    await prisma.booking.updateMany({
      where: { calBookingId },
      data: { status: BookingStatus.POSTPONED },
    })
  }

  return NextResponse.json({ ok: true })
}
