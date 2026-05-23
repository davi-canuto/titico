import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { ContentType } from "@prisma/client"

const baseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  thumbnail: z.string().url().optional(),
  creatorId: z.string().min(1),
  productIds: z.array(z.string()).optional(),
})

const videoSchema = baseSchema.extend({
  type: z.literal(ContentType.VIDEO),
  meta: z.object({ youtubeId: z.string().min(1), duration: z.string().optional() }),
})
const matchupSchema = baseSchema.extend({
  type: z.literal(ContentType.MATCHUP),
  meta: z.object({
    champion: z.string().min(1),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    tips: z.array(z.string()),
    strategy: z.string().min(1),
    itemSuggestion: z.string().optional(),
  }),
})
const buildSchema = baseSchema.extend({
  type: z.literal(ContentType.BUILD),
  meta: z.object({
    champion: z.string().min(1),
    items: z.array(z.string()),
    runes: z.array(z.string()),
    notes: z.string().optional(),
  }),
})
const articleSchema = baseSchema.extend({
  type: z.literal(ContentType.ARTICLE),
  meta: z.object({ body: z.string().min(1) }),
})
const fileSchema = baseSchema.extend({
  type: z.literal(ContentType.PDF),
  meta: z.object({ url: z.string().url(), sizeBytes: z.number().int().optional() }),
})

const contentSchema = z.discriminatedUnion("type", [
  videoSchema, matchupSchema, buildSchema, articleSchema, fileSchema,
])

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const body = await req.json()
  const parsed = contentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "VALIDATION_ERROR", issues: parsed.error.issues }, { status: 400 })
  }

  const existing = await prisma.content.findUnique({ where: { slug: parsed.data.slug } })
  if (existing) {
    return NextResponse.json({ error: "CONFLICT" }, { status: 409 })
  }

  const { type, title, slug, thumbnail, creatorId, productIds, meta } = parsed.data

  const metaCreate = {
    video: type === ContentType.VIDEO ? { create: meta as { youtubeId: string; duration?: string } } : undefined,
    matchup: type === ContentType.MATCHUP ? { create: meta } : undefined,
    build: type === ContentType.BUILD ? { create: meta } : undefined,
    article: type === ContentType.ARTICLE ? { create: meta } : undefined,
    file: type === ContentType.PDF ? { create: meta } : undefined,
  }

  const content = await prisma.content.create({
    data: { type, title, slug, thumbnail, creatorId, ...metaCreate },
    include: { video: true, matchup: true, build: true, article: true, file: true },
  })

  if (productIds && productIds.length > 0) {
    await prisma.contentProduct.createMany({
      data: productIds.map((productId) => ({ contentId: content.id, productId })),
      skipDuplicates: true,
    })
  }

  return NextResponse.json(content, { status: 201 })
}
