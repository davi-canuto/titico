import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ContentCard from "@/components/platform/ContentCard"
import { ContentStatus, ContentType } from "@prisma/client"
import { userCanAccessContent } from "@/lib/access"

export const dynamic = "force-dynamic"
const TYPE_LABELS: Record<ContentType, string> = {
  VIDEO:   "Vídeo",
  MATCHUP: "Matchup",
  BUILD:   "Build",
  ARTICLE: "Artigo",
  PDF:     "PDF",
}

const ALL_TYPES = Object.values(ContentType)

interface ExplorarPageProps {
  searchParams: Promise<{ tipo?: string; creator?: string }>
}

export default async function ExplorarPage({ searchParams }: ExplorarPageProps) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const userId = session.user.id as string
  const { tipo, creator } = await searchParams
  const typeFilter = ALL_TYPES.includes(tipo as ContentType) ? (tipo as ContentType) : undefined

  const contents = await prisma.content.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      active: true,
      ...(typeFilter ? { type: typeFilter } : {}),
      ...(creator ? { creator: { slug: creator } } : {}),
    },
    include: { video: { select: { duration: true } } },
    orderBy: { publishedAt: "desc" },
  })

  const lockedMap = await Promise.all(
    contents.map(async (c) => ({
      id: c.id,
      locked: !(await userCanAccessContent(userId, c.id)),
    }))
  ).then((results) => Object.fromEntries(results.map((r) => [r.id, r.locked])))

  return (
    <main className="min-h-screen bg-[#0d0d0d]">

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="px-6 pt-10 pb-6 md:px-12">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Explorar</h1>
        <p className="mt-1 text-sm text-white/40">
          {contents.length} {contents.length === 1 ? "conteúdo" : "conteúdos"}{typeFilter ? ` · ${TYPE_LABELS[typeFilter]}` : ""}
        </p>
      </div>

      {/* ── Filter chips — sticky ──────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/5 px-6 py-3 md:px-12">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <Link
            href={creator ? `/lobby/explorar?creator=${creator}` : "/lobby/explorar"}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-colors ${
              !typeFilter
                ? "bg-white text-black"
                : "border border-white/10 text-white/50 hover:border-white/30 hover:text-white"
            }`}
          >
            Todos
          </Link>
          {ALL_TYPES.map((type) => (
            <Link
              key={type}
              href={`/lobby/explorar?tipo=${type}${creator ? `&creator=${creator}` : ""}`}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-colors ${
                typeFilter === type
                  ? "bg-white text-black"
                  : "border border-white/10 text-white/50 hover:border-white/30 hover:text-white"
              }`}
            >
              {TYPE_LABELS[type]}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Grid ──────────────────────────────────────────────────── */}
      <div className="px-6 py-8 md:px-12">
        {contents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {contents.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                locked={lockedMap[content.id]}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#111111] py-24">
            <p className="text-sm font-semibold text-white/30">Nenhum conteúdo encontrado</p>
          </div>
        )}
      </div>

    </main>
  )
}
