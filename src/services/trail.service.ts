import { prisma } from "@/lib/prisma"
import { ContentStatus } from "@prisma/client"
import type { TrailWithItems } from "@/types/domain"

export async function getActiveTrails(): Promise<TrailWithItems[]> {
  return prisma.trail.findMany({
    where: { active: true },
    include: {
      items: {
        where: { content: { status: ContentStatus.PUBLISHED, active: true } },
        orderBy: { order: "asc" },
        take: 16,
        include: { content: { include: { video: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
  })
}

export async function getTrailProgress(
  trailId: string,
  userId: string,
): Promise<Record<string, { watchedSeconds: number | null }>> {
  const trail = await prisma.trail.findUnique({
    where: { id: trailId },
    select: { items: { select: { contentId: true } } },
  })
  if (!trail) return {}

  const contentIds = trail.items.map((i) => i.contentId)
  const progress = await prisma.userProgress.findMany({
    where: { userId, contentId: { in: contentIds } },
    select: { contentId: true, watchedSeconds: true },
  })

  return Object.fromEntries(progress.map((p) => [p.contentId, { watchedSeconds: p.watchedSeconds }]))
}
