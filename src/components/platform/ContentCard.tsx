import Link from "next/link"
import Image from "next/image"
import { ContentType } from "@prisma/client"
import type { Content, VideoMeta } from "@prisma/client"

type ContentWithVideo = Content & { video?: Pick<VideoMeta, "duration"> | null }

interface ContentCardProps {
  content: ContentWithVideo
  userProgress?: { watchedSeconds?: number | null } | null
  locked?: boolean
  isFree?: boolean
}

const TYPE_COLORS: Record<ContentType, string> = {
  VIDEO:   "bg-purple-950",
  MATCHUP: "bg-red-950",
  BUILD:   "bg-yellow-950",
  ARTICLE: "bg-blue-950",
  PDF:     "bg-zinc-800",
}

const TYPE_LABELS: Record<ContentType, string> = {
  VIDEO:   "Vídeo",
  MATCHUP: "Matchup",
  BUILD:   "Build",
  ARTICLE: "Artigo",
  PDF:     "PDF",
}

function durationToSeconds(duration: string | null | undefined): number {
  if (!duration) return 0
  const parts = duration.split(":").map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return 0
}

export default function ContentCard({ content, userProgress, locked, isFree }: ContentCardProps) {
  const isLocked = locked ?? false
  const totalSec = durationToSeconds(content.video?.duration) || 300
  const watched  = userProgress?.watchedSeconds ?? 0
  const progressPct = Math.min((watched / totalSec) * 100, 100)
  const showProgress = watched > 0

  return (
    <Link href={`/dashboard/conteudo/${content.slug}`} className="group flex flex-col gap-2.5">

      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#161616]">

        {content.thumbnail ? (
          <Image
            src={content.thumbnail}
            alt={content.title}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 280px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className={`absolute inset-0 ${TYPE_COLORS[content.type]}`} />
        )}

        {/* Gradient overlay — always */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Hover overlay — play icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {!isLocked && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          )}
        </div>

        {/* Type badge — top left */}
        <span className="absolute left-2.5 top-2.5 rounded-md bg-black/50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
          {TYPE_LABELS[content.type]}
        </span>

        {/* Access badge — top right */}
        {isFree ? (
          <span className="absolute right-2.5 top-2.5 rounded-md bg-[#4ade80]/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] text-[#4ade80]">
            Grátis
          </span>
        ) : isLocked ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55">
            <div className="flex flex-col items-center gap-2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="rounded-md bg-black/60 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] text-white/70">
                Bloqueado
              </span>
            </div>
          </div>
        ) : null}

        {/* Progress bar */}
        {showProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
            <div className="h-full bg-[#e3001b] transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        )}
      </div>

      {/* Title */}
      <p className="line-clamp-2 text-sm font-semibold leading-snug text-white/90 transition-colors group-hover:text-white">
        {content.title}
      </p>

    </Link>
  )
}
