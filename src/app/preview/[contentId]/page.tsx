import { notFound, redirect } from "next/navigation"
import Image from "next/image"
import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { getPreviewData, type PreviewData } from "@/lib/content-preview"
import { PurchaseGate } from "../_components/PurchaseGate"

type Props = {
  params: Promise<{ contentId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { contentId } = await params
  const data = await getPreviewData(contentId)
  if (!data) return {}

  let description = ""
  if (data.meta.type === "ARTICLE") {
    description = data.meta.bodyTruncated.join(" ").slice(0, 160)
  } else if (data.meta.type === "MATCHUP") {
    description = `${data.meta.champion} — ${DIFFICULTY_LABELS[data.meta.difficulty] ?? data.meta.difficulty}`
  } else {
    description = data.title
  }

  return {
    title: data.title,
    description,
    openGraph: {
      title: data.title,
      description,
      images: data.thumbnail ? [{ url: data.thumbnail }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description,
      images: data.thumbnail ? [data.thumbnail] : [],
    },
  }
}

const DIFFICULTY_COLORS: Record<string, string> = {
  EASY: "#4ade80",
  MEDIUM: "#fbbf24",
  HARD: "#ef4444",
}

const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: "Fácil",
  MEDIUM: "Médio",
  HARD: "Difícil",
}

const TYPE_LABELS: Record<string, string> = {
  ARTICLE: "Artigo",
  VIDEO: "Vídeo",
  MATCHUP: "Matchup",
  BUILD: "Build",
  PDF: "PDF",
}

export default async function PreviewPage({ params }: Props) {
  const { contentId } = await params
  const session = await auth()
  const data = await getPreviewData(contentId, session?.user?.id)

  if (!data) notFound()

  if (data.hasAccess) {
    redirect(`/lobby/conteudo/${data.slug}`)
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-8">
          {data.thumbnail && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6">
              <Image
                src={data.thumbnail}
                alt={data.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-white/50">
              {TYPE_LABELS[data.meta.type] ?? data.meta.type}
            </span>

            {data.meta.type === "MATCHUP" && (
              <span
                className="text-xs uppercase tracking-[0.25em] font-semibold px-2 py-0.5 rounded"
                style={{
                  color: DIFFICULTY_COLORS[data.meta.difficulty],
                  backgroundColor: DIFFICULTY_COLORS[data.meta.difficulty] + "20",
                }}
              >
                {DIFFICULTY_LABELS[data.meta.difficulty] ?? data.meta.difficulty}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-black uppercase tracking-tight">{data.title}</h1>

          {data.meta.type === "MATCHUP" && (
            <p className="text-white/60 mt-2 text-sm">
              Campeão:{" "}
              <span className="text-white font-semibold">{data.meta.champion}</span>
            </p>
          )}
        </div>

        {/* Truncated content with fade */}
        <div className="relative mb-2">
          <PreviewBody meta={data.meta} />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
        </div>

        {/* Purchase gate */}
        <div className="mt-8">
          <PurchaseGate
            product={data.product}
            contentId={data.id}
            isAuthenticated={!!session?.user}
          />
        </div>
      </div>
    </main>
  )
}

function PreviewBody({ meta }: { meta: PreviewData["meta"] }) {
  if (meta.type === "ARTICLE") {
    return (
      <div className="space-y-4 text-white/80 leading-relaxed">
        {meta.bodyTruncated.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    )
  }

  if (meta.type === "MATCHUP") {
    return (
      <div className="space-y-3">
        {meta.tips.map((tip, i) => (
          <div key={i} className="flex gap-3 text-white/80">
            <span className="text-[#e3001b] font-black mt-0.5">·</span>
            <p>{tip}</p>
          </div>
        ))}
      </div>
    )
  }

  if (meta.type === "VIDEO") {
    return (
      <div className="bg-[#161616] border border-white/5 rounded-xl p-6 text-center text-white/50">
        <p className="text-sm">Preview de vídeo disponível após o acesso.</p>
        {meta.duration && <p className="text-xs mt-1">Duração: {meta.duration}</p>}
      </div>
    )
  }

  return null
}
