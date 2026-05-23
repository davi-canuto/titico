import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  contentId: z.string().min(1),
  order: z.number().int().nonnegative(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id: trailId } = await params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "VALIDATION_ERROR", issues: parsed.error.issues }, { status: 400 })
  }

  const trail = await prisma.trail.findUnique({ where: { id: trailId } })
  if (!trail) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })

  try {
    const item = await prisma.trailItem.create({
      data: { trailId, contentId: parsed.data.contentId, order: parsed.data.order },
    })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: "CONFLICT" }, { status: 409 })
  }
}
