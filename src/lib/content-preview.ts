import { ContentType, PurchaseStatus } from "@prisma/client"
import { prisma } from "./prisma"

type PreviewProduct = {
  id: string
  name: string
  price: string
}

type ArticlePreview = {
  type: "ARTICLE"
  bodyTruncated: string[]
}

type VideoPreview = {
  type: "VIDEO"
  duration: string | null
}

type MatchupPreview = {
  type: "MATCHUP"
  champion: string
  difficulty: string
  tips: string[]
  itemSuggestion: string | null
}

type OtherPreview = {
  type: "BUILD" | "PDF"
}

type ContentPreviewMeta = ArticlePreview | VideoPreview | MatchupPreview | OtherPreview

export type PreviewData = {
  id: string
  title: string
  slug: string
  thumbnail: string | null
  meta: ContentPreviewMeta
  product: PreviewProduct | null
  hasAccess: boolean
}

function formatPrice(centavos: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(centavos / 100)
}

export async function getPreviewData(contentId: string, userId?: string): Promise<PreviewData | null> {
  const content = await prisma.content.findFirst({
    where: { id: contentId, status: "PUBLISHED", active: true },
    include: {
      article: true,
      video: true,
      matchup: true,
      products: {
        include: {
          product: { select: { id: true, name: true, price: true, active: true } },
        },
      },
    },
  })

  if (!content) return null

  // Truncate meta server-side — never expose full content
  let meta: ContentPreviewMeta
  if (content.type === ContentType.ARTICLE && content.article) {
    const paragraphs = content.article.body.split("\n\n").filter(Boolean)
    meta = { type: "ARTICLE", bodyTruncated: paragraphs.slice(0, 2) }
  } else if (content.type === ContentType.VIDEO && content.video) {
    meta = { type: "VIDEO", duration: content.video.duration }
    // youtubeId intentionally excluded
  } else if (content.type === ContentType.MATCHUP && content.matchup) {
    meta = {
      type: "MATCHUP",
      champion: content.matchup.champion,
      difficulty: content.matchup.difficulty,
      tips: content.matchup.tips.slice(0, 2),
      itemSuggestion: content.matchup.itemSuggestion,
      // strategy intentionally excluded
    }
  } else {
    meta = { type: content.type as "BUILD" | "PDF" }
  }

  const activeProduct = content.products.find((cp) => cp.product.active)
  const product = activeProduct
    ? {
        id: activeProduct.product.id,
        name: activeProduct.product.name,
        price: formatPrice(activeProduct.product.price),
      }
    : null

  let hasAccess = false
  if (userId && product) {
    const purchase = await prisma.purchase.findFirst({
      where: { userId, productId: product.id, status: PurchaseStatus.COMPLETED },
    })
    hasAccess = purchase !== null
  } else if (userId && !product) {
    // No product restriction — free content
    hasAccess = true
  }

  return {
    id: content.id,
    title: content.title,
    slug: content.slug,
    thumbnail: content.thumbnail,
    meta,
    product,
    hasAccess,
  }
}
