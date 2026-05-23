"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ContentType, Difficulty } from "@prisma/client"
import type { ContentWithMeta } from "@/types/domain"
import VideoSection from "./VideoSection"

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  EASY:   "text-[#4ade80] border-[#4ade80]/30 bg-[#4ade80]/10",
  MEDIUM: "text-[#fbbf24] border-[#fbbf24]/30 bg-[#fbbf24]/10",
  HARD:   "text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10",
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  EASY: "Fácil", MEDIUM: "Médio", HARD: "Difícil",
}

interface ProgressTrackerProps {
  content: ContentWithMeta
  totalDuration: number
}

export default function ProgressTracker({ content, totalDuration }: ProgressTrackerProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [watchedSeconds, setWatchedSeconds] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/user/me").then((r) => r.json()),
      fetch(`/api/contents/${content.slug}/progress`).then((r) => r.json()),
    ]).then(([user, prog]) => {
      setHasAccess(!!user?.hasAccess)
      setWatchedSeconds(prog?.watchedSeconds ?? 0)
      setCompleted(!!prog?.completedAt)
    }).catch(() => {
      setHasAccess(false)
    })
  }, [content.slug])

  const progressPercent =
    totalDuration > 0 ? Math.min((watchedSeconds / totalDuration) * 100, 100) : 0

  const isLoading = hasAccess === null
  const locked = hasAccess === false

  if (isLoading) {
    return (
      <div className="h-64 animate-pulse rounded-xl bg-[#161616]" />
    )
  }

  if (locked) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#161616]">
        {content.thumbnail && (
          <Image
            src={content.thumbnail}
            alt={content.title}
            width={800}
            height={450}
            className="w-full object-cover opacity-20"
          />
        )}
        <div className="flex flex-col items-center justify-center gap-4 px-8 py-20">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p className="text-center text-lg font-black uppercase tracking-tight text-white/60">
            Conteúdo exclusivo para assinantes
          </p>
          <Link
            href="/planos"
            className="rounded-lg bg-[#e3001b] px-6 py-3 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015] active:bg-[#900010]"
          >
            Comprar acesso
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Completed badge */}
      {completed && (
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#4ade80]/20 bg-[#4ade80]/10 px-3 py-0.5 text-xs font-semibold text-[#4ade80]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
          Concluído
        </span>
      )}

      {/* VIDEO */}
      {content.type === ContentType.VIDEO && content.video && (
        <VideoSection
          youtubeId={content.video.youtubeId}
          slug={content.slug}
          initialSeconds={watchedSeconds}
          totalDuration={totalDuration}
          initialCompleted={completed}
          progressPercent={progressPercent}
        />
      )}

      {/* MATCHUP */}
      {content.type === ContentType.MATCHUP && content.matchup && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Image
              src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${content.matchup.champion}.png`}
              alt={content.matchup.champion}
              width={64}
              height={64}
              className="rounded-lg border border-white/10"
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50">Matchup</p>
              <h2 className="text-2xl font-black uppercase text-white">{content.matchup.champion}</h2>
            </div>
            <span className={`ml-auto rounded-full border px-3 py-1 text-xs font-black uppercase tracking-widest ${DIFFICULTY_COLORS[content.matchup.difficulty]}`}>
              {DIFFICULTY_LABELS[content.matchup.difficulty]}
            </span>
          </div>
          <div className="rounded-xl border border-white/5 bg-[#161616] p-6">
            <h3 className="mb-3 border-l-2 border-[#e3001b] pl-3 text-sm font-black uppercase tracking-widest text-white">Estratégia</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-white/70">{content.matchup.strategy}</p>
          </div>
          {content.matchup.tips.length > 0 && (
            <div className="rounded-xl border border-white/5 bg-[#161616] p-6">
              <h3 className="mb-4 border-l-2 border-[#e3001b] pl-3 text-sm font-black uppercase tracking-widest text-white">Dicas</h3>
              <ul className="flex flex-col gap-2">
                {content.matchup.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-white/70">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e3001b]" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {content.matchup.itemSuggestion && (
            <div className="rounded-xl border border-white/5 bg-[#161616] p-6">
              <h3 className="mb-3 border-l-2 border-[#e3001b] pl-3 text-sm font-black uppercase tracking-widest text-white">Itens sugeridos</h3>
              <p className="text-sm text-white/70">{content.matchup.itemSuggestion}</p>
            </div>
          )}
        </div>
      )}

      {/* BUILD */}
      {content.type === ContentType.BUILD && content.build && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Image
              src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${content.build.champion}.png`}
              alt={content.build.champion}
              width={64}
              height={64}
              className="rounded-lg border border-white/10"
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50">Build</p>
              <h2 className="text-2xl font-black uppercase text-white">{content.build.champion}</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/5 bg-[#161616] p-6">
              <h3 className="mb-4 border-l-2 border-[#e3001b] pl-3 text-sm font-black uppercase tracking-widest text-white">Itens</h3>
              <ul className="flex flex-col gap-1.5">
                {content.build.items.map((item, i) => <li key={i} className="text-sm text-white/70">{item}</li>)}
              </ul>
            </div>
            <div className="rounded-xl border border-white/5 bg-[#161616] p-6">
              <h3 className="mb-4 border-l-2 border-[#e3001b] pl-3 text-sm font-black uppercase tracking-widest text-white">Runas</h3>
              <ul className="flex flex-col gap-1.5">
                {content.build.runes.map((rune, i) => <li key={i} className="text-sm text-white/70">{rune}</li>)}
              </ul>
            </div>
          </div>
          {content.build.notes && (
            <div className="rounded-xl border border-white/5 bg-[#161616] p-6">
              <h3 className="mb-3 border-l-2 border-[#e3001b] pl-3 text-sm font-black uppercase tracking-widest text-white">Notas</h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/70">{content.build.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* ARTICLE */}
      {content.type === ContentType.ARTICLE && content.article && (
        <div className="rounded-xl border border-white/5 bg-[#161616] p-6 md:p-8">
          <p className="whitespace-pre-wrap leading-relaxed text-white/80">{content.article.body}</p>
        </div>
      )}

      {/* PDF */}
      {content.type === ContentType.PDF && content.file && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-white/5 bg-[#161616] p-10">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          {content.file.sizeBytes && (
            <p className="text-sm text-white/40">{(content.file.sizeBytes / 1024 / 1024).toFixed(1)} MB</p>
          )}
          <a
            href={content.file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#e3001b] px-6 py-3 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015] active:bg-[#900010]"
          >
            Baixar PDF
          </a>
        </div>
      )}
    </div>
  )
}
