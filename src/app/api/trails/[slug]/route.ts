import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const { slug } = await params
  const userId = session.user.id as string

  const trail = await prisma.trail.findUnique({
    where: { slug },
    include: {
      items: {
        orderBy: { order: "asc" },
        include: {
          content: {
            include: {
              video: true,
              matchup: true,
              build: true,
              article: true,
              file: true,
              progress: { where: { userId } },
            },
          },
        },
      },
    },
  })

  if (!trail || !trail.active) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
  }

  const { userCanAccessContent } = await import("@/lib/access")

  const items = await Promise.all(
    trail.items.map(async ({ content, ...item }) => ({
      ...item,
      content: {
        id: content.id,
        type: content.type,
        title: content.title,
        slug: content.slug,
        thumbnail: content.thumbnail,
        status: content.status,
        locked: !(await userCanAccessContent(userId, content.id)),
        video: content.video,
        matchup: content.matchup,
        build: content.build,
        article: content.article,
        file: content.file,
        userProgress: content.progress[0] ?? null,
      },
    }))
  )

  return NextResponse.json({ ...trail, items })
}
