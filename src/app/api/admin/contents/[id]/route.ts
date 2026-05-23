import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { ContentStatus } from "@prisma/client"

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  thumbnail: z.string().url().nullable().optional(),
  status: z.nativeEnum(ContentStatus).optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  active: z.boolean().optional(),
  productIds: z.array(z.string()).optional(),
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

  const content = await prisma.content.findUnique({ where: { id } })
  if (!content) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })

  const { productIds, ...contentData } = parsed.data

  const updated = await prisma.content.update({
    where: { id },
    data: {
      ...contentData,
      publishedAt: contentData.publishedAt === null ? null
        : contentData.publishedAt ? new Date(contentData.publishedAt) : undefined,
    },
    include: { video: true, matchup: true, build: true, article: true, file: true },
  })

  if (productIds !== undefined) {
    await prisma.contentProduct.deleteMany({ where: { contentId: id } })
    if (productIds.length > 0) {
      await prisma.contentProduct.createMany({
        data: productIds.map((productId) => ({ contentId: id, productId })),
        skipDuplicates: true,
      })
    }
  }

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  const content = await prisma.content.findUnique({ where: { id } })
  if (!content) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })

  await prisma.content.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
