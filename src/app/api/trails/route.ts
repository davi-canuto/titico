import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const trails = await prisma.trail.findMany({
    where: { active: true },
    include: { _count: { select: { items: true } } },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json(
    trails.map(({ _count, ...trail }) => ({ ...trail, itemCount: _count.items }))
  )
}
