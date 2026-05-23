import { prisma } from "@/lib/prisma"
import { PurchaseStatus } from "@prisma/client"
import { DomainError } from "./errors"
import { VALID_SKIN_NUMS } from "@/lib/shaco-skins"
import type { UserProfile, UserAccessStatus } from "@/types/domain"

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      purchases: {
        where: { status: PurchaseStatus.COMPLETED },
        orderBy: { createdAt: "desc" as const },
        take: 1,
        include: { product: true },
      },
    },
  })
  if (!user) throw new DomainError("NOT_FOUND", `User ${userId} not found`)
  return user
}

export async function updateHeroSkin(userId: string, skinNum: string): Promise<void> {
  if (!VALID_SKIN_NUMS.has(skinNum as never)) {
    throw new DomainError("INVALID_INPUT", `Invalid skin number: ${skinNum}`)
  }
  await prisma.user.update({
    where: { id: userId },
    data: { heroSkin: skinNum },
  })
}

export async function getUserAccessStatus(userId: string): Promise<UserAccessStatus> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { purchases: { select: { status: true }, where: { status: PurchaseStatus.COMPLETED }, take: 1 } },
  })
  if (!user) throw new DomainError("NOT_FOUND", `User ${userId} not found`)
  const completed = user.purchases[0] ?? null
  return { hasAccess: completed !== null, status: completed?.status ?? null }
}
