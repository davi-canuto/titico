import Image from 'next/image'
import Link from 'next/link'
import { ContentType, Difficulty } from '@prisma/client'

type Sample = {
  id: string
  title: string
  type: ContentType
  thumbnail: string | null
  matchup: { difficulty: Difficulty } | null
}

const TYPE_LABELS: Record<ContentType, string> = {
  VIDEO: 'Vídeo',
  MATCHUP: 'Matchup',
  ARTICLE: 'Artigo',
  BUILD: 'Build',
  PDF: 'PDF',
}

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  EASY: '#4ade80',
  MEDIUM: '#fbbf24',
  HARD: '#ef4444',
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  EASY: 'Fácil',
  MEDIUM: 'Médio',
  HARD: 'Difícil',
}

export default function ContentSamplesSection({ samples }: { samples: Sample[] }) {
  if (samples.length === 0) return null

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-black uppercase tracking-tight text-white border-l-2 border-[#e3001b] pl-3 mb-8">
          Veja antes de assinar
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {samples.map((sample) => (
            <div
              key={sample.id}
              className="bg-[#161616] border border-white/5 rounded-xl overflow-hidden flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-white/5">
                {sample.thumbnail ? (
                  <Image
                    src={sample.thumbnail}
                    alt={sample.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-[0.25em] font-semibold text-white/50">
                    {TYPE_LABELS[sample.type]}
                  </span>
                  {sample.matchup && (
                    <span
                      className="text-xs uppercase tracking-[0.25em] font-semibold px-1.5 py-0.5 rounded"
                      style={{
                        color: DIFFICULTY_COLORS[sample.matchup.difficulty],
                        backgroundColor: DIFFICULTY_COLORS[sample.matchup.difficulty] + '20',
                      }}
                    >
                      {DIFFICULTY_LABELS[sample.matchup.difficulty]}
                    </span>
                  )}
                </div>

                <p className="text-white font-black uppercase tracking-tight text-sm leading-tight flex-1">
                  {sample.title}
                </p>

                <Link
                  href={`/preview/${sample.id}`}
                  className="text-[#e3001b] text-sm font-semibold hover:underline mt-1"
                >
                  Ver amostra gratuita →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
