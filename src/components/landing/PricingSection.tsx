import { prisma } from '@/lib/prisma'
import PlanCard from '@/components/platform/PlanCard'

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true, showOnPricing: true },
      orderBy: { price: 'asc' },
    })
    return products.map((p) => {
      const amount = Number(p.price)
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        features: p.features,
        price: {
          amount,
          currency: 'BRL',
          formatted: (amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        },
      }
    })
  } catch {
    return []
  }
}

export default async function PricingSection() {
  const products = await getProducts()
  const maxPrice = products.length > 0 ? Math.max(...products.map((p) => p.price.amount)) : 0

  return (
    <section id="pricing" className="py-24 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#e3001b] text-xs uppercase tracking-[0.3em] font-semibold mb-2">Lobby do Titiltei</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-none mb-4">
            ENTRE NO <span className="text-[#e3001b]">LOBBY</span>
          </h2>
          <div className="w-16 h-1 bg-[#e3001b] mx-auto mb-4" />
          <p className="text-white/50 text-base max-w-xl mx-auto">
            Módulos de vídeo, análises de gameplay e coaching. Garanta seu acesso ao Lobby do Titiltei.
            Pagamento único — sem mensalidade.
          </p>
        </div>

        {/* Cards */}
        {products.length === 0 ? (
          <p className="text-center text-white/30 text-sm py-16">Planos em breve</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {products.map((product) => (
              <PlanCard
                key={product.id}
                product={product}
                isPopular={product.price.amount === maxPrice}
                callbackUrl="/"
              />
            ))}
          </div>
        )}

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
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
  )
}
