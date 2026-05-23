import { prisma } from '@/lib/prisma'
import PlanCarousel from '@/components/platform/PlanCarousel'

export const dynamic = 'force-dynamic'

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: { creator: { select: { slug: true, name: true, champion: true } } },
    })
    return {
      data: products.map((product) => {
        const amount = Number(product.price)
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          features: product.features,
          creator: product.creator,
          price: {
            amount,
            currency: 'BRL',
            formatted: (amount / 100).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }),
          },
        }
      }),
      error: false,
    }
  } catch {
    return { data: null, error: true }
  }
}

type ProductItem = NonNullable<Awaited<ReturnType<typeof getProducts>>['data']>[number]

const FAQ = [
  { q: 'É pagamento único?', a: 'Sim. Você paga uma vez e tem acesso vitalício — sem mensalidade ou renovação automática.' },
  { q: 'O conteúdo é atualizado?', a: 'Sim. Novos matchups, builds e vídeos são incluídos automaticamente no seu acesso.' },
  { q: 'Para qual elo serve?', a: 'O guia cobre do bronze ao diamante. O foco é macro decisão e matchups específicos.' },
  { q: 'Como acesso após comprar?', a: 'Faça login com o mesmo Google usado na compra. O acesso é liberado imediatamente.' },
]

export default async function PlanosPage() {
  const { data: products, error } = await getProducts()

  const creatorGroups: { slug: string; name: string; champion: string; products: ProductItem[] }[] = []
  if (products) {
    for (const p of products) {
      const slug = p.creator?.slug ?? 'unknown'
      let group = creatorGroups.find((g) => g.slug === slug)
      if (!group) {
        group = { slug, name: p.creator?.name ?? slug, champion: p.creator?.champion ?? '', products: [] }
        creatorGroups.push(group)
      }
      group.products.push(p)
    }
  }
  const multiCreator = creatorGroups.length > 1

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-xl mx-auto text-center flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e3001b]">
            Lobby do Titiltei
          </p>
          <h1 className="text-5xl font-black uppercase leading-[1.05] tracking-tight">
            Suba de elo.<br />Método Titiltei.
          </h1>
          <p className="text-white/50 text-base leading-relaxed">
            Módulos de vídeo, análises de gameplay, coaching e acesso completo ao Lobby. Escolha o plano certo para você.
          </p>
        </div>
      </section>

      {/* ── Plans ────────────────────────────────────────────────────── */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto flex flex-col gap-8 px-6">

          {error ? (
            <p className="text-center text-sm text-white/30 py-20">
              Não foi possível carregar os planos. Tente novamente mais tarde.
            </p>
          ) : !products || products.length === 0 ? (
            <p className="text-center text-sm text-white/30 py-20">
              Nenhum plano disponível no momento.
            </p>
          ) : multiCreator ? (
            creatorGroups.map((group) => (
              <div key={group.slug} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${group.champion}.png`}
                    alt={group.champion}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                  />
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/40 font-semibold">{group.champion}</p>
                    <h2 className="text-lg font-black uppercase tracking-tight text-white">{group.name}</h2>
                  </div>
                </div>
                <PlanCarousel products={group.products} />
              </div>
            ))
          ) : (
            <PlanCarousel products={products} />
          )}

          {/* trust bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
            <span className="flex items-center gap-2 text-xs text-white/30">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Pagamento seguro via Stripe
            </span>
            <span className="text-white/10 hidden sm:block">·</span>
            <span className="text-xs text-white/30">Pagamento único</span>
            <span className="text-white/10 hidden sm:block">·</span>
            <span className="text-xs text-white/30">Sem renovação automática</span>
            <span className="text-white/10 hidden sm:block">·</span>
            <span className="text-xs text-white/30">Acesso vitalício</span>
          </div>

        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 px-6 py-20">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">

          <div className="flex flex-col gap-1 text-center">
            <h2 className="text-xl font-black uppercase tracking-tight">Dúvidas frequentes</h2>
            <p className="text-sm text-white/40">Tudo que você precisa saber antes de comprar.</p>
          </div>

          <dl className="flex flex-col gap-0 border border-white/5 rounded-2xl overflow-hidden">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="flex flex-col gap-2 px-6 py-5 border-b border-white/5 last:border-0 bg-[#111111]">
                <dt className="text-sm font-black uppercase tracking-tight text-white">{q}</dt>
                <dd className="text-sm text-white/45 leading-relaxed">{a}</dd>
              </div>
            ))}
          </dl>

        </div>
      </section>

    </main>
  )
}
