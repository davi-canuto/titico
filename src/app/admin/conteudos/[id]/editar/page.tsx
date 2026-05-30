import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateContent } from "@/lib/admin-actions"
import { ContentType } from "@prisma/client"
import TitleSlugFields from "@/components/admin/TitleSlugFields"

const inputCls =
  "w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50"
const textareaCls = `${inputCls} resize-none`

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}

export default async function EditarConteudoPage({ params, searchParams }: PageProps) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { id } = await params
  const { error } = await searchParams

  const [content, allProducts, contentProducts, creators] = await Promise.all([
    prisma.content.findUnique({
      where: { id },
      include: { video: true, matchup: true, build: true, article: true, file: true },
    }),
    prisma.product.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.contentProduct.findMany({ where: { contentId: id }, select: { productId: true } }),
    prisma.creator.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ])

  if (!content) notFound()
  const contentProductIds = new Set(contentProducts.map((cp) => cp.productId))

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-white/40">
        <Link href="/admin" className="hover:text-white/70 transition-colors">Admin</Link>
        <span>/</span>
        <Link href="/admin" className="hover:text-white/70 transition-colors">Conteúdos</Link>
        <span>/</span>
        <span className="text-white/70">{content.title}</span>
        <span>/</span>
        <span className="text-white/70">Editar</span>
      </div>

      <h1 className="mb-8 border-l-2 border-[#e3001b] pl-3 text-2xl font-black uppercase tracking-tight text-white">
        Editar conteúdo
      </h1>

      {error === "slug" && (
        <div className="mb-6 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-sm text-[#ef4444]">
          Slug já em uso — escolha outro.
        </div>
      )}

      <form action={updateContent.bind(null, content.id)} className="flex flex-col gap-5">
        {/* Creator */}
        <div>
          <label className={labelCls}>Criador *</label>
          <select name="creatorId" required defaultValue={content.creatorId} className={inputCls}>
            {creators.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.champion})</option>
            ))}
          </select>
        </div>

        <TitleSlugFields defaultTitle={content.title} defaultSlug={content.slug} />

        <div>
          <label className={labelCls}>Thumbnail URL</label>
          <input
            name="thumbnail"
            type="url"
            defaultValue={content.thumbnail ?? ""}
            placeholder="https://..."
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Produtos (deixe vazio para conteúdo gratuito)</label>
          {allProducts.length === 0 ? (
            <p className="text-xs text-white/30">Nenhum produto ativo cadastrado.</p>
          ) : (
            <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-[#0d0d0d] p-3">
              {allProducts.map((product) => (
                <label key={product.id} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="productIds"
                    value={product.id}
                    defaultChecked={contentProductIds.has(product.id)}
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

        {/* VIDEO */}
        {content.type === ContentType.VIDEO && content.video && (
          <>
            <div>
              <label className={labelCls}>YouTube ID *</label>
              <input name="youtubeId" required defaultValue={content.video.youtubeId} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Duração</label>
              <input name="duration" defaultValue={content.video.duration ?? ""} placeholder="00:15:30" className={inputCls} />
            </div>
          </>
        )}

        {/* MATCHUP */}
        {content.type === ContentType.MATCHUP && content.matchup && (
          <>
            <div>
              <label className={labelCls}>Campeão *</label>
              <input name="champion" required defaultValue={content.matchup.champion} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Dificuldade *</label>
              <select name="difficulty" required defaultValue={content.matchup.difficulty} className={inputCls}>
                <option value="EASY">Fácil</option>
                <option value="MEDIUM">Médio</option>
                <option value="HARD">Difícil</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Estratégia *</label>
              <textarea name="strategy" required rows={4} defaultValue={content.matchup.strategy} className={textareaCls} />
            </div>
            <div>
              <label className={labelCls}>Dicas (uma por linha) *</label>
              <textarea name="tips" required rows={4} defaultValue={content.matchup.tips.join("\n")} className={textareaCls} />
            </div>
            <div>
              <label className={labelCls}>Itens sugeridos</label>
              <input name="itemSuggestion" defaultValue={content.matchup.itemSuggestion ?? ""} className={inputCls} />
            </div>
          </>
        )}

        {/* BUILD */}
        {content.type === ContentType.BUILD && content.build && (
          <>
            <div>
              <label className={labelCls}>Campeão *</label>
              <input name="champion" required defaultValue={content.build.champion} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Itens (um por linha) *</label>
              <textarea name="items" required rows={5} defaultValue={content.build.items.join("\n")} className={textareaCls} />
            </div>
            <div>
              <label className={labelCls}>Runas (uma por linha) *</label>
              <textarea name="runes" required rows={4} defaultValue={content.build.runes.join("\n")} className={textareaCls} />
            </div>
            <div>
              <label className={labelCls}>Notas</label>
              <textarea name="notes" rows={3} defaultValue={content.build.notes ?? ""} className={textareaCls} />
            </div>
          </>
        )}

        {/* ARTICLE */}
        {content.type === ContentType.ARTICLE && content.article && (
          <div>
            <label className={labelCls}>Corpo do artigo *</label>
            <textarea name="body" required rows={14} defaultValue={content.article.body} className={textareaCls} />
          </div>
        )}

        {/* PDF */}
        {content.type === ContentType.PDF && content.file && (
          <>
            <div>
              <label className={labelCls}>URL do arquivo *</label>
              <input name="url" type="url" required defaultValue={content.file.url} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tamanho (bytes)</label>
              <input name="sizeBytes" type="number" min="0" defaultValue={content.file.sizeBytes ?? ""} className={inputCls} />
            </div>
          </>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-[#e3001b] px-6 py-3 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015] active:bg-[#900010]"
          >
            Salvar alterações
          </button>
          <Link href="/admin" className="text-sm text-white/40 hover:text-white/70 transition-colors">
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  )
}
