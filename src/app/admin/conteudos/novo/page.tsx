import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { createContent } from "@/lib/admin-actions"
import { ContentType } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import TitleSlugFields from "@/components/admin/TitleSlugFields"

export const dynamic = "force-dynamic"
const TYPE_INFO: Record<ContentType, { label: string; desc: string; icon: React.ReactNode }> = {
  VIDEO: {
    label: "Vídeo",
    desc: "Embed do YouTube com rastreamento de progresso",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  MATCHUP: {
    label: "Matchup",
    desc: "Análise de dificuldade e dicas contra um campeão",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" /><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" /><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" /><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" /><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" /><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z" /><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z" />
      </svg>
    ),
  },
  BUILD: {
    label: "Build",
    desc: "Itens, runas e notas para uma situação específica",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  ARTICLE: {
    label: "Artigo",
    desc: "Texto longo com análise ou teoria",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  PDF: {
    label: "PDF",
    desc: "Arquivo para download (cheatsheet, guia impresso)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50"
const textareaCls = `${inputCls} resize-none`

interface NovoConteudoPageProps {
  searchParams: Promise<{ tipo?: string; error?: string }>
}

export default async function NovoConteudoPage({ searchParams }: NovoConteudoPageProps) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { tipo, error } = await searchParams
  const typeFilter = Object.values(ContentType).includes(tipo as ContentType)
    ? (tipo as ContentType)
    : null

  const [products, creators] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.creator.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ])

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin" className="text-sm text-white/40 hover:text-white/70 transition-colors">
          ← Admin
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-sm text-white/60">Novo conteúdo</span>
      </div>

      <h1 className="mb-8 border-l-2 border-[#e3001b] pl-3 text-2xl font-black uppercase tracking-tight text-white">
        {typeFilter ? `Novo ${TYPE_INFO[typeFilter].label}` : "Novo conteúdo"}
      </h1>

      {/* Error banner */}
      {error === "slug" && (
        <div className="mb-6 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-sm text-[#ef4444]">
          Slug já em uso — escolha outro.
        </div>
      )}

      {/* Type picker */}
      {!typeFilter && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.values(ContentType).map((type) => (
            <Link
              key={type}
              href={`/admin/conteudos/novo?tipo=${type}`}
              className="flex items-start gap-4 rounded-xl border border-white/10 bg-[#161616] p-5 transition-colors hover:border-white/25"
            >
              <span className="mt-0.5 text-white/50">{TYPE_INFO[type].icon}</span>
              <div>
                <p className="font-black uppercase tracking-wide text-white">{TYPE_INFO[type].label}</p>
                <p className="mt-1 text-xs text-white/50">{TYPE_INFO[type].desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Form */}
      {typeFilter && (
        <form action={createContent} className="flex flex-col gap-5">
          <input type="hidden" name="tipo" value={typeFilter} />

          {/* Creator */}
          <div>
            <label className={labelCls}>Criador *</label>
            <select name="creatorId" required className={inputCls}>
              {creators.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.champion})</option>
              ))}
            </select>
          </div>

          {/* Common fields */}
          <TitleSlugFields />

          <div>
            <label className={labelCls}>Thumbnail URL</label>
            <input
              name="thumbnail"
              type="url"
              placeholder="https://..."
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Produtos (deixe vazio para conteúdo gratuito)</label>
            {products.length === 0 ? (
              <p className="text-xs text-white/30">Nenhum produto ativo cadastrado.</p>
            ) : (
              <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-[#0d0d0d] p-3">
                {products.map((product) => (
                  <label key={product.id} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name="productIds"
                      value={product.id}
                      className="accent-[#e3001b]"
                    />
                    <span className="text-sm text-white/80">{product.name}</span>
                    <span className="ml-auto text-xs text-white/30">
                      {(product.price / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* VIDEO fields */}
          {typeFilter === ContentType.VIDEO && (
            <>
              <div>
                <label className={labelCls}>YouTube ID *</label>
                <input name="youtubeId" required placeholder="dQw4w9WgXcQ" className={inputCls} />
                <p className="mt-1 text-xs text-white/30">O código após youtube.com/watch?v=</p>
              </div>
              <div>
                <label className={labelCls}>Duração</label>
                <input name="duration" placeholder="00:15:30" className={inputCls} />
              </div>
            </>
          )}

          {/* MATCHUP fields */}
          {typeFilter === ContentType.MATCHUP && (
            <>
              <div>
                <label className={labelCls}>Campeão *</label>
                <input name="champion" required placeholder="Graves" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Dificuldade *</label>
                <select name="difficulty" required className={inputCls}>
                  <option value="EASY">Fácil</option>
                  <option value="MEDIUM">Médio</option>
                  <option value="HARD">Difícil</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Estratégia *</label>
                <textarea name="strategy" required rows={4} className={textareaCls} placeholder="Descreva a estratégia geral..." />
              </div>
              <div>
                <label className={labelCls}>Dicas (uma por linha) *</label>
                <textarea name="tips" required rows={4} className={textareaCls} placeholder={"Use W antes de pular com Q\nEvite trocar cedo"} />
              </div>
              <div>
                <label className={labelCls}>Itens sugeridos</label>
                <input name="itemSuggestion" placeholder="Serpente de Rabadon, Lenço de Zhonya" className={inputCls} />
              </div>
            </>
          )}

          {/* BUILD fields */}
          {typeFilter === ContentType.BUILD && (
            <>
              <div>
                <label className={labelCls}>Campeão *</label>
                <input name="champion" required placeholder="Shaco" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Itens (um por linha) *</label>
                <textarea name="items" required rows={5} className={textareaCls} placeholder={"Adaga de Longa Espada\nFaca de Caça"} />
              </div>
              <div>
                <label className={labelCls}>Runas (uma por linha) *</label>
                <textarea name="runes" required rows={4} className={textareaCls} placeholder={"Eletrocutar\nRuína Repentina"} />
              </div>
              <div>
                <label className={labelCls}>Notas</label>
                <textarea name="notes" rows={3} className={textareaCls} placeholder="Contexto adicional..." />
              </div>
            </>
          )}

          {/* ARTICLE fields */}
          {typeFilter === ContentType.ARTICLE && (
            <div>
              <label className={labelCls}>Corpo do artigo *</label>
              <textarea name="body" required rows={12} className={textareaCls} placeholder="Escreva o conteúdo completo aqui..." />
            </div>
          )}

          {/* PDF fields */}
          {typeFilter === ContentType.PDF && (
            <>
              <div>
                <label className={labelCls}>URL do arquivo *</label>
                <input name="url" type="url" required placeholder="https://..." className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Tamanho (bytes)</label>
                <input name="sizeBytes" type="number" min="0" placeholder="1048576" className={inputCls} />
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-[#e3001b] px-6 py-3 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015] active:bg-[#900010]"
            >
              Criar conteúdo
            </button>
            <Link
              href="/admin"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      )}
    </main>
  )
}
