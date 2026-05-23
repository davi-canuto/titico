import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ContentStatus, ContentType, Difficulty } from "@prisma/client"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q") ?? ""
  const typeParam = searchParams.get("type")
  const difficultyParam = searchParams.get("difficulty")

  const type = Object.values(ContentType).includes(typeParam as ContentType)
    ? (typeParam as ContentType)
    : undefined

  const difficulty = Object.values(Difficulty).includes(difficultyParam as Difficulty)
    ? (difficultyParam as Difficulty)
    : undefined

  const contents = await prisma.content.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      active: true,
      ...(type ? { type } : {}),
      ...(difficulty ? { matchup: { difficulty } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { matchup: { champion: { contains: q, mode: "insensitive" } } },
              { build: { champion: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      video: true,
      matchup: true,
    },
    take: 50,
    orderBy: { publishedAt: "desc" },
  })

  return NextResponse.json(contents)
}
