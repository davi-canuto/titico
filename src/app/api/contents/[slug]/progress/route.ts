import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const { slug } = await params
  const content = await prisma.content.findUnique({ where: { slug }, select: { id: true } })
  if (!content) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
  }

  const progress = await prisma.userProgress.findUnique({
    where: { userId_contentId: { userId: session.user.id, contentId: content.id } },
    select: { watchedSeconds: true, completedAt: true },
  })

  return NextResponse.json({
    watchedSeconds: progress?.watchedSeconds ?? null,
    completedAt: progress?.completedAt ?? null,
  })
}

const schema = z.object({
  watchedSeconds: z.number().int().nonnegative().optional(),
  completedAt: z.string().datetime().optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const { slug } = await params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "VALIDATION_ERROR", issues: parsed.error.issues }, { status: 400 })
  }

  const content = await prisma.content.findUnique({ where: { slug }, select: { id: true } })
  if (!content) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
  }

  const userId = session.user.id as string
  const progress = await prisma.userProgress.upsert({
    where: { userId_contentId: { userId, contentId: content.id } },
    create: {
      userId,
      contentId: content.id,
      watchedSeconds: parsed.data.watchedSeconds,
      completedAt: parsed.data.completedAt ? new Date(parsed.data.completedAt) : null,
    },
    update: {
      watchedSeconds: parsed.data.watchedSeconds ?? undefined,
      completedAt: parsed.data.completedAt ? new Date(parsed.data.completedAt) : undefined,
    },
  })

  return NextResponse.json(progress)
}
