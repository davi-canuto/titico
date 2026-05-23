import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  thumbnail: z.string().url().nullable().optional(),
  active: z.boolean().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "VALIDATION_ERROR", issues: parsed.error.issues }, { status: 400 })
  }

  const trail = await prisma.trail.findUnique({ where: { id } })
  if (!trail) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })

  const updated = await prisma.trail.update({ where: { id }, data: parsed.data })
  return NextResponse.json(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  const trail = await prisma.trail.findUnique({ where: { id } })
  if (!trail) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })

  await prisma.trail.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
