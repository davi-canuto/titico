import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { userCanAccessContent } from "@/lib/access"
import { ContentStatus } from "@prisma/client"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const { slug } = await params

  const content = await prisma.content.findUnique({
    where: { slug },
    include: {
      video: true,
      matchup: true,
      build: true,
      article: true,
      file: true,
    },
  })

  if (!content || !content.active || content.status !== ContentStatus.PUBLISHED) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
  }

  const canAccess = await userCanAccessContent(session.user.id as string, content.id)
  if (!canAccess) {
    return NextResponse.json({ error: "ACCESS_DENIED" }, { status: 403 })
  }

  return NextResponse.json(content)
}
