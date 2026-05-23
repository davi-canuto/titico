"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "./admin"
import { prisma } from "./prisma"
import { ContentStatus, ContentType, Difficulty } from "@prisma/client"

// ─── Content ──────────────────────────────────────────────────────────────────

export async function publishContent(id: string) {
  const { error } = await requireAdmin()
  if (error) return
  const content = await prisma.content.update({
    where: { id },
    data: { status: ContentStatus.PUBLISHED, publishedAt: new Date() },
    select: { slug: true },
  })
  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/conteudo/" + content.slug)
}

export async function unpublishContent(id: string) {
  const { error } = await requireAdmin()
  if (error) return
  const content = await prisma.content.update({
    where: { id },
    data: { status: ContentStatus.DRAFT, publishedAt: null },
    select: { slug: true },
  })
  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/conteudo/" + content.slug)
}

export async function deleteContent(id: string) {
  const { error } = await requireAdmin()
  if (error) return
  await prisma.content.delete({ where: { id } })
  revalidatePath("/dashboard/admin")
}

export async function createContent(formData: FormData) {
  const { error } = await requireAdmin()
  if (error) redirect("/login")

  const tipo = formData.get("tipo") as ContentType
  const title = (formData.get("title") as string).trim()
  const slug = (formData.get("slug") as string).trim()
  const thumbnailRaw = (formData.get("thumbnail") as string).trim()
  const thumbnail = thumbnailRaw || null
  const creatorId = (formData.get("creatorId") as string).trim()
  const productIds = formData.getAll("productIds") as string[]

  const existing = await prisma.content.findUnique({ where: { slug } })
  if (existing) {
    redirect(`/dashboard/admin/conteudos/novo?tipo=${tipo}&error=slug`)
  }

  const metaCreate: Record<string, unknown> = {}

  switch (tipo) {
    case ContentType.VIDEO:
      metaCreate.video = {
        create: {
          youtubeId: (formData.get("youtubeId") as string).trim(),
          duration: (formData.get("duration") as string).trim() || null,
        },
      }
      break
    case ContentType.MATCHUP:
      metaCreate.matchup = {
        create: {
          champion: (formData.get("champion") as string).trim(),
          difficulty: formData.get("difficulty") as Difficulty,
          tips: (formData.get("tips") as string)
            .split("\n")
            .map((t) => t.trim())
            .filter(Boolean),
          strategy: (formData.get("strategy") as string).trim(),
          itemSuggestion: (formData.get("itemSuggestion") as string).trim() || null,
        },
      }
      break
    case ContentType.BUILD:
      metaCreate.build = {
        create: {
          champion: (formData.get("champion") as string).trim(),
          items: (formData.get("items") as string)
            .split("\n")
            .map((t) => t.trim())
            .filter(Boolean),
          runes: (formData.get("runes") as string)
            .split("\n")
            .map((t) => t.trim())
            .filter(Boolean),
          notes: (formData.get("notes") as string).trim() || null,
        },
      }
      break
    case ContentType.ARTICLE:
      metaCreate.article = {
        create: { body: (formData.get("body") as string).trim() },
      }
      break
    case ContentType.PDF:
      metaCreate.file = {
        create: {
          url: (formData.get("url") as string).trim(),
          sizeBytes: formData.get("sizeBytes")
            ? parseInt(formData.get("sizeBytes") as string, 10)
            : null,
        },
      }
      break
  }

  const content = await prisma.content.create({
    data: { type: tipo, title, slug, thumbnail, creatorId, ...metaCreate },
  })

  if (productIds.length > 0) {
    await prisma.contentProduct.createMany({
      data: productIds.map((productId) => ({ contentId: content.id, productId })),
      skipDuplicates: true,
    })
  }

  redirect("/dashboard/admin")
}

// ─── Trail ────────────────────────────────────────────────────────────────────

export async function toggleTrail(id: string, active: boolean) {
  const { error } = await requireAdmin()
  if (error) return
  await prisma.trail.update({ where: { id }, data: { active } })
  revalidatePath("/dashboard/admin")
}

export async function deleteTrail(id: string) {
  const { error } = await requireAdmin()
  if (error) return
  await prisma.trail.delete({ where: { id } })
  revalidatePath("/dashboard/admin")
}

export async function createTrail(formData: FormData) {
  const { error } = await requireAdmin()
  if (error) redirect("/login")

  const title = (formData.get("title") as string).trim()
  const slug = (formData.get("slug") as string).trim()
  const descriptionRaw = (formData.get("description") as string).trim()
  const thumbnailRaw = (formData.get("thumbnail") as string).trim()

  const existing = await prisma.trail.findUnique({ where: { slug } })
  if (existing) {
    redirect("/dashboard/admin/trilhas/novo?error=slug")
  }

  await prisma.trail.create({
    data: {
      title,
      slug,
      description: descriptionRaw || null,
      thumbnail: thumbnailRaw || null,
      active: false,
    },
  })

  redirect("/dashboard/admin?tab=trilhas")
}

export async function updateContent(id: string, formData: FormData) {
  const { error } = await requireAdmin()
  if (error) redirect("/login")

  const title = (formData.get("title") as string).trim()
  const slug = (formData.get("slug") as string).trim()
  const thumbnailRaw = (formData.get("thumbnail") as string).trim()
  const thumbnail = thumbnailRaw || null
  const creatorId = (formData.get("creatorId") as string).trim()
  const productIds = formData.getAll("productIds") as string[]

  const existing = await prisma.content.findFirst({ where: { slug, id: { not: id } } })
  if (existing) {
    redirect(`/dashboard/admin/conteudos/${id}/editar?error=slug`)
  }

  const content = await prisma.content.update({
    where: { id },
    data: { title, slug, thumbnail, creatorId },
  })

  revalidatePath("/dashboard/conteudo/" + content.slug)

  switch (content.type) {
    case ContentType.VIDEO:
      await prisma.videoMeta.update({
        where: { contentId: id },
        data: {
          youtubeId: (formData.get("youtubeId") as string).trim(),
          duration: (formData.get("duration") as string).trim() || null,
        },
      })
      break
    case ContentType.MATCHUP:
      await prisma.matchupMeta.update({
        where: { contentId: id },
        data: {
          champion: (formData.get("champion") as string).trim(),
          difficulty: formData.get("difficulty") as Difficulty,
          tips: (formData.get("tips") as string).split("\n").map((t) => t.trim()).filter(Boolean),
          strategy: (formData.get("strategy") as string).trim(),
          itemSuggestion: (formData.get("itemSuggestion") as string).trim() || null,
        },
      })
      break
    case ContentType.BUILD:
      await prisma.buildMeta.update({
        where: { contentId: id },
        data: {
          champion: (formData.get("champion") as string).trim(),
          items: (formData.get("items") as string).split("\n").map((t) => t.trim()).filter(Boolean),
          runes: (formData.get("runes") as string).split("\n").map((t) => t.trim()).filter(Boolean),
          notes: (formData.get("notes") as string).trim() || null,
        },
      })
      break
    case ContentType.ARTICLE:
      await prisma.articleMeta.update({
        where: { contentId: id },
        data: { body: (formData.get("body") as string).trim() },
      })
      break
    case ContentType.PDF:
      await prisma.fileMeta.update({
        where: { contentId: id },
        data: {
          url: (formData.get("url") as string).trim(),
          sizeBytes: formData.get("sizeBytes") ? parseInt(formData.get("sizeBytes") as string, 10) : null,
        },
      })
      break
  }

  await prisma.contentProduct.deleteMany({ where: { contentId: id } })
  if (productIds.length > 0) {
    await prisma.contentProduct.createMany({
      data: productIds.map((productId) => ({ contentId: id, productId })),
      skipDuplicates: true,
    })
  }

  redirect("/dashboard/admin")
}

export async function updateTrail(id: string, formData: FormData) {
  const { error } = await requireAdmin()
  if (error) redirect("/login")

  const title = (formData.get("title") as string).trim()
  const slug = (formData.get("slug") as string).trim()
  const descriptionRaw = (formData.get("description") as string).trim()
  const thumbnailRaw = (formData.get("thumbnail") as string).trim()

  const existing = await prisma.trail.findFirst({ where: { slug, id: { not: id } } })
  if (existing) {
    redirect(`/dashboard/admin/trilhas/${id}/editar?error=slug`)
  }

  await prisma.trail.update({
    where: { id },
    data: { title, slug, description: descriptionRaw || null, thumbnail: thumbnailRaw || null },
  })

  redirect("/dashboard/admin?tab=trilhas")
}

// ─── Product ──────────────────────────────────────────────────────────────────

export async function toggleProduct(id: string, active: boolean) {
  const { error } = await requireAdmin()
  if (error) return
  await prisma.product.update({ where: { id }, data: { active } })
  revalidatePath("/planos")
  revalidatePath("/dashboard/admin")
}

export async function updateProduct(id: string, formData: FormData) {
  const { error } = await requireAdmin()
  if (error) redirect("/login")

  const name = (formData.get("name") as string).trim()
  const description = (formData.get("description") as string).trim()
  const priceRaw = (formData.get("price") as string).replace(",", ".")
  const features = (formData.get("features") as string)
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean)
  const creatorIdRaw = (formData.get("creatorId") as string | null)?.trim()

  if (!name) redirect(`/dashboard/admin/produtos/${id}/editar?error=nome`)

  const priceReais = parseFloat(priceRaw)
  if (isNaN(priceReais) || priceReais <= 0) {
    redirect(`/dashboard/admin/produtos/${id}/editar?error=preco`)
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      features,
      price: Math.round(priceReais * 100),
      ...(creatorIdRaw ? { creatorId: creatorIdRaw } : {}),
    },
  })

  revalidatePath("/planos")
  revalidatePath("/dashboard/admin")
  redirect("/dashboard/admin?tab=produtos")
}

// ─── Creator ──────────────────────────────────────────────────────────────────

export async function createCreator(formData: FormData) {
  const { error } = await requireAdmin()
  if (error) redirect("/login")

  const slug = (formData.get("slug") as string).trim()
  const name = (formData.get("name") as string).trim()
  const champion = (formData.get("champion") as string).trim()
  const descriptionRaw = (formData.get("description") as string).trim()
  const avatarUrl = ((formData.get("avatarUrl") as string) || "").trim() || null
  const bannerUrl = ((formData.get("bannerUrl") as string) || "").trim() || null

  await prisma.creator.create({
    data: { slug, name, champion, description: descriptionRaw || null, avatarUrl, bannerUrl, active: true },
  })

  revalidatePath("/dashboard/admin")
  redirect("/dashboard/admin?tab=criadores")
}

export async function toggleCreatorActive(creatorId: string) {
  const { error } = await requireAdmin()
  if (error) return
  const creator = await prisma.creator.findUnique({ where: { id: creatorId } })
  if (!creator) return
  await prisma.creator.update({ where: { id: creatorId }, data: { active: !creator.active } })
  revalidatePath("/dashboard/admin")
}

// ─── Trail Items ──────────────────────────────────────────────────────────────

export async function addTrailItem(trailId: string, formData: FormData) {
  const { error } = await requireAdmin()
  if (error) return
  const contentId = formData.get("contentId") as string
  const agg = await prisma.trailItem.aggregate({ where: { trailId }, _max: { order: true } })
  const nextOrder = (agg._max.order ?? 0) + 1
  try {
    await prisma.trailItem.create({ data: { trailId, contentId, order: nextOrder } })
  } catch {
    // unique constraint — already added, ignore
  }
  revalidatePath(`/dashboard/admin/trilhas/${trailId}/itens`)
}

export async function removeTrailItem(itemId: string, trailId: string) {
  const { error } = await requireAdmin()
  if (error) return
  await prisma.trailItem.delete({ where: { id: itemId } })
  const remaining = await prisma.trailItem.findMany({
    where: { trailId },
    orderBy: { order: "asc" },
  })
  await prisma.$transaction(
    remaining.map((item, i) =>
      prisma.trailItem.update({ where: { id: item.id }, data: { order: i + 1 } })
    )
  )
  revalidatePath(`/dashboard/admin/trilhas/${trailId}/itens`)
}

export async function moveTrailItemUp(itemId: string, trailId: string) {
  const { error } = await requireAdmin()
  if (error) return
  const item = await prisma.trailItem.findUnique({ where: { id: itemId } })
  if (!item || item.order <= 1) return
  const above = await prisma.trailItem.findFirst({
    where: { trailId, order: item.order - 1 },
  })
  if (!above) return
  await prisma.$transaction([
    prisma.trailItem.update({ where: { id: item.id }, data: { order: 9999 } }),
    prisma.trailItem.update({ where: { id: above.id }, data: { order: item.order } }),
    prisma.trailItem.update({ where: { id: item.id }, data: { order: item.order - 1 } }),
  ])
  revalidatePath(`/dashboard/admin/trilhas/${trailId}/itens`)
}

export async function moveTrailItemDown(itemId: string, trailId: string) {
  const { error } = await requireAdmin()
  if (error) return
  const item = await prisma.trailItem.findUnique({ where: { id: itemId } })
  if (!item) return
  const below = await prisma.trailItem.findFirst({
    where: { trailId, order: item.order + 1 },
  })
  if (!below) return
  await prisma.$transaction([
    prisma.trailItem.update({ where: { id: item.id }, data: { order: 9999 } }),
    prisma.trailItem.update({ where: { id: below.id }, data: { order: item.order } }),
    prisma.trailItem.update({ where: { id: item.id }, data: { order: item.order + 1 } }),
  ])
  revalidatePath(`/dashboard/admin/trilhas/${trailId}/itens`)
}
