"use client"

import { useEffect, useRef, useState } from "react"
import type { Content, VideoMeta, MatchupMeta } from "@prisma/client"
import { ContentType, Difficulty } from "@prisma/client"
import ContentCard from "@/components/platform/ContentCard"

type SearchResult = Content & { video: VideoMeta | null; matchup: MatchupMeta | null }

const TYPE_OPTIONS: { value: ContentType; label: string }[] = [
  { value: ContentType.VIDEO,   label: "Vídeo" },
  { value: ContentType.MATCHUP, label: "Matchup" },
  { value: ContentType.BUILD,   label: "Build" },
  { value: ContentType.ARTICLE, label: "Artigo" },
]

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: Difficulty.EASY,   label: "Fácil" },
  { value: Difficulty.MEDIUM, label: "Médio" },
  { value: Difficulty.HARD,   label: "Difícil" },
]

export default function BuscarPage() {
  const [query, setQuery]           = useState("")
  const [type, setType]             = useState<ContentType | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [results, setResults]       = useState<SearchResult[] | null>(null)
  const [loading, setLoading]       = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (abortRef.current) abortRef.current.abort()
      const controller = new AbortController()
      abortRef.current = controller

      const params = new URLSearchParams({ q: query })
      if (type) params.set("type", type)
      if (difficulty) params.set("difficulty", difficulty)

      setLoading(true)
      fetch(`/api/search?${params}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data: SearchResult[]) => {
          setResults(data)
          setLoading(false)
        })
        .catch((err) => {
          if (err.name !== "AbortError") setLoading(false)
        })
    }, 300)

    return () => clearTimeout(timer)
  }, [query, type, difficulty])

  const hasQuery = query.trim().length > 0 || type !== null || difficulty !== null
  const empty = results !== null && results.length === 0

  return (
    <main className="min-h-screen bg-[#0d0d0d]">

      {/* ── Header + input ──────────────────────────────────────────── */}
      <div className="px-6 pt-10 pb-6 md:px-12">
        <h1 className="mb-6 text-3xl font-black uppercase tracking-tight text-white">Buscar</h1>

        <div className="relative">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar conteúdos, campeões..."
            className="w-full rounded-xl border border-white/10 bg-[#161616] py-3 pl-12 pr-4 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/30"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
            </div>
          )}
        </div>

        {/* Filter chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setType(type === opt.value ? null : opt.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-colors ${
                type === opt.value
                  ? "bg-white text-black"
                  : "border border-white/10 text-white/50 hover:border-white/30 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
          <div className="h-6 w-px self-center bg-white/10" />
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDifficulty(difficulty === opt.value ? null : opt.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-colors ${
                difficulty === opt.value
                  ? "bg-white text-black"
                  : "border border-white/10 text-white/50 hover:border-white/30 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────────── */}
      <div className="px-6 pb-16 md:px-12">

        {/* Count */}
        {results !== null && !empty && (
          <p className="mb-6 text-sm text-white/40">
            {results.length} resultado{results.length !== 1 ? "s" : ""}
            {query.trim() ? ` para "${query.trim()}"` : ""}
          </p>
        )}

        {/* Grid */}
        {results !== null && !empty && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {empty && hasQuery && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#111111] py-24 text-center">
            <p className="text-sm font-semibold text-white/30">
              Nenhum resultado para{query.trim() ? ` "${query.trim()}"` : " os filtros aplicados"}
            </p>
            <p className="mt-1 text-xs text-white/20">Tente outros termos ou remova os filtros</p>
          </div>
        )}

        {/* Initial state — no query yet */}
        {results === null && !loading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg className="mb-4 text-white/10" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <p className="text-sm text-white/30">Digite para buscar conteúdos</p>
          </div>
        )}

      </div>
    </main>
  )
}
