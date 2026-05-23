import { PurchaseStatus } from "@prisma/client"
import { prisma } from "./prisma"

export async function userCanAccessContent(userId: string, contentId: string): Promise<boolean> {
  const productCount = await prisma.contentProduct.count({
    where: { contentId },
  })
  if (productCount === 0) return true

  const purchase = await prisma.purchase.findFirst({
    where: {
      userId,
      status: PurchaseStatus.COMPLETED,
      product: { contents: { some: { contentId } } },
    },
  })
  return purchase !== null
}

export async function userHasProduct(userId: string, productId: string): Promise<boolean> {
  const purchase = await prisma.purchase.findFirst({
    where: { userId, productId, status: PurchaseStatus.COMPLETED },
  })
  return purchase !== null
}
