import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ContentStatus } from "@prisma/client"
import {
  addTrailItem,
  removeTrailItem,
  moveTrailItemUp,
  moveTrailItemDown,
} from "@/lib/admin-actions"
import ConfirmButton from "@/components/admin/ConfirmButton"

const TYPE_LABELS: Record<string, string> = {
  VIDEO: "Vídeo",
  MATCHUP: "Matchup",
  BUILD: "Build",
  ARTICLE: "Artigo",
  PDF: "PDF",
}

const TYPE_COLORS: Record<string, string> = {
  VIDEO: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  MATCHUP: "text-red-400 border-red-400/30 bg-red-400/10",
  BUILD: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  ARTICLE: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  PDF: "text-zinc-400 border-zinc-400/30 bg-zinc-400/10",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TrailItensPage({ params }: PageProps) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { id: trailId } = await params

  const trail = await prisma.trail.findUnique({
    where: { id: trailId },
    include: {
      items: {
        orderBy: { order: "asc" },
        include: { content: true },
      },
    },
  })

  if (!trail) notFound()

  const addedIds = trail.items.map((i) => i.content.id)

  const available = await prisma.content.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      id: { notIn: addedIds },
    },
    orderBy: [{ type: "asc" }, { title: "asc" }],
  })

  const totalItems = trail.items.length

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-white/40">
        <Link href="/admin" className="hover:text-white/70 transition-colors">Admin</Link>
        <span>/</span>
        <Link href="/admin?tab=trilhas" className="hover:text-white/70 transition-colors">Trilhas</Link>
        <span>/</span>
        <span className="text-white/70">{trail.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="border-l-2 border-[#e3001b] pl-3 text-2xl font-black uppercase tracking-tight text-white">
            {trail.title}
          </h1>
          <p className="mt-1 pl-5 text-sm text-white/40">
            {totalItems} {totalItems === 1 ? "item" : "itens"} na trilha
          </p>
        </div>
      </div>

      {/* Item list */}
      <div className="mb-10 flex flex-col gap-2">
        {trail.items.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-[#161616] py-12 text-center">
            <p className="text-sm text-white/30">Nenhum conteúdo nesta trilha ainda</p>
          </div>
        ) : (
          trail.items.map((item, idx) => {
            const isFirst = idx === 0
            const isLast = idx === totalItems - 1
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#161616] px-4 py-3"
              >
                {/* Position */}
                <span className="w-6 shrink-0 text-center text-xs font-black text-white/25">
                  {item.order}
                </span>

                {/* Type badge */}
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${TYPE_COLORS[item.content.type] ?? ""}`}>
                  {TYPE_LABELS[item.content.type] ?? item.content.type}
                </span>

                {/* Title */}
                <span className="flex-1 truncate text-sm font-semibold text-white">
                  {item.content.title}
                </span>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  <form action={moveTrailItemUp.bind(null, item.id, trailId)}>
                    <button
                      type="submit"
                      disabled={isFirst}
                      className="flex h-7 w-7 items-center justify-center rounded border border-white/10 bg-[#0d0d0d] text-white/50 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                    </button>
                  </form>

                  <form action={moveTrailItemDown.bind(null, item.id, trailId)}>
                    <button
                      type="submit"
                      disabled={isLast}
                      className="flex h-7 w-7 items-center justify-center rounded border border-white/10 bg-[#0d0d0d] text-white/50 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  </form>

                  <form action={removeTrailItem.bind(null, item.id, trailId)}>
                    <ConfirmButton
                      message={`Remover "${item.content.title}" da trilha?`}
                      className="ml-1 flex h-7 items-center rounded border border-[#ef4444]/20 bg-[#0d0d0d] px-2 text-xs text-[#ef4444] transition-colors hover:border-[#ef4444]/50"
                    >
                      Remover
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add content */}
      <div className="flex flex-col gap-4">
        <h2 className="border-l-2 border-[#e3001b] pl-3 text-base font-black uppercase tracking-tight text-white">
          Adicionar conteúdo
        </h2>

        {available.length === 0 ? (
          <p className="text-sm text-white/30">Todos os conteúdos já foram adicionados.</p>
        ) : (
          <form action={addTrailItem.bind(null, trailId)} className="flex gap-3">
            <select
              name="contentId"
              required
              className="flex-1 rounded-lg border border-white/10 bg-[#161616] px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 transition-colors"
            >
              {available.map((c) => (
                <option key={c.id} value={c.id}>
                  [{TYPE_LABELS[c.type] ?? c.type}] {c.title}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-[#e3001b] px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015] active:bg-[#900010]"
            >
              + Adicionar
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
