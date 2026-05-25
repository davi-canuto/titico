import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { BookingStatus, UserRole } from "@prisma/client"

const bodySchema = z.object({
  status: z.enum([BookingStatus.COMPLETED, BookingStatus.POSTPONED]),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "VALIDATION_ERROR" }, { status: 400 })
  }

  const booking = await prisma.booking.findUnique({ where: { id } })
  if (!booking) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })

  await prisma.booking.update({ where: { id }, data: { status: parsed.data.status } })
  return NextResponse.json({ ok: true })
}
