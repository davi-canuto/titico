import type { Prisma, PurchaseStatus } from "@prisma/client"

export type ContentWithMeta = Prisma.ContentGetPayload<{
  include: {
    video: true
    matchup: true
    build: true
    article: true
    file: true
  }
}>

export type TrailWithItems = Prisma.TrailGetPayload<{
  include: {
    items: {
      include: { content: { include: { video: true } } }
    }
  }
}>

export type UserProgressWithContent = Prisma.UserProgressGetPayload<{
  include: { content: { include: { video: true } } }
}>

export type UserProfile = Prisma.UserGetPayload<{
  include: {
    purchases: {
      where: { status: "COMPLETED" }
      orderBy: { createdAt: "desc" }
      take: 1
      include: { product: true }
    }
  }
}>

export type UserAccessStatus = {
  hasAccess: boolean
  status: PurchaseStatus | null
}
