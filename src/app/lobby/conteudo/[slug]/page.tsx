import { notFound } from "next/navigation"
import Link from "next/link"
import { ContentStatus, ContentType } from "@prisma/client"
import * as contentService from "@/services/content.service"
import { DomainError } from "@/services/errors"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { userCanAccessContent } from "@/lib/access"
import ProgressTracker from "@/components/platform/ProgressTracker"

export const dynamic = "force-dynamic"

function durationToSeconds(duration: string | null | undefined): number {
  if (!duration) return 0
  const parts = duration.split(":").map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return 0
}

const TYPE_LABELS: Record<ContentType, string> = {
  VIDEO:   "Vídeo",
  MATCHUP: "Matchup",
  BUILD:   "Build",
  ARTICLE: "Artigo",
  PDF:     "PDF",
}

interface ContentPageProps {
  params: Promise<{ slug: string }>
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug } = await params

  let content
  try {
    content = await contentService.getContentBySlug(slug)
  } catch (err) {
    if (err instanceof DomainError && err.code === "NOT_FOUND") notFound()
    throw err
  }

  const session = await auth()
  const userId = session?.user?.id as string | undefined
  const [locked, productCount] = await Promise.all([
    userId ? userCanAccessContent(userId, content.id).then((v) => !v) : Promise.resolve(true),
    prisma.contentProduct.count({ where: { contentId: content.id } }),
  ])
  const isFree = productCount === 0

  const totalDuration = durationToSeconds(content.video?.duration)

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      {/* Back link */}
      <Link
        href="/lobby"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Voltar
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-[#161616] px-3 py-0.5 text-xs font-semibold uppercase tracking-widest text-white/60">
            {TYPE_LABELS[content.type]}
          </span>
          {isFree && (
            <span className="rounded-full bg-[#4ade80]/20 px-3 py-0.5 text-xs font-black uppercase tracking-widest text-[#4ade80]">
              GRÁTIS
            </span>
          )}
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
          {content.title}
        </h1>
      </div>

      {/* Access gate */}
      {locked ? (
        <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#161616]">
          <div className="flex flex-col items-center justify-center gap-4 px-8 py-20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="text-center text-lg font-black uppercase tracking-tight text-white/60">
              Conteúdo bloqueado
            </p>
            <Link
              href="/planos"
              className="rounded-lg bg-[#e3001b] px-6 py-3 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015] active:bg-[#900010]"
            >
              Ver planos
            </Link>
          </div>
        </div>
      ) : (
        <ProgressTracker content={content} totalDuration={totalDuration} />
      )}
    </main>
  )
}
