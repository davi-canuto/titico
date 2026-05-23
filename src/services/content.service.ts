import { prisma } from "@/lib/prisma"
import { ContentStatus } from "@prisma/client"
import { DomainError } from "./errors"
import type { ContentWithMeta, UserProgressWithContent } from "@/types/domain"

export async function getContentBySlug(slug: string): Promise<ContentWithMeta> {
  const content = await prisma.content.findFirst({
    where: { slug, status: ContentStatus.PUBLISHED, active: true },
    include: { video: true, matchup: true, build: true, article: true, file: true },
  })
  if (!content) throw new DomainError("NOT_FOUND", `Content "${slug}" not found`)
  return content
}

export async function getContinueWatching(userId: string): Promise<UserProgressWithContent[]> {
  return prisma.userProgress.findMany({
    where: { userId, content: { status: ContentStatus.PUBLISHED, active: true } },
    include: { content: { include: { video: true } } },
    orderBy: { updatedAt: "desc" },
    take: 10,
  })
}

export async function getContentById(id: string): Promise<ContentWithMeta> {
  const content = await prisma.content.findUnique({
    where: { id },
    include: { video: true, matchup: true, build: true, article: true, file: true },
  })
  if (!content) throw new DomainError("NOT_FOUND", `Content ${id} not found`)
  return content
}
