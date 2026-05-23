import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { content: { include: { video: true } } },
  })

  return NextResponse.json(bookmarks)
}

const postSchema = z.object({ contentId: z.string().min(1) })

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = postSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "VALIDATION_ERROR" }, { status: 400 })
  }

  const bookmark = await prisma.bookmark.upsert({
    where: { userId_contentId: { userId: session.user.id, contentId: parsed.data.contentId } },
    create: { userId: session.user.id, contentId: parsed.data.contentId },
    update: {},
  })

  return NextResponse.json(bookmark)
}
