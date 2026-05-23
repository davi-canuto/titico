'use client'

import { useState } from 'react'

interface Product {
  id: string
  name: string
  description: string | null
  features: string[]
  price: { formatted: string }
}

interface PlanCardProps {
  product: Product
  isPopular?: boolean
  callbackUrl?: string
}

export default function PlanCard({ product, isPopular, callbackUrl = '/planos' }: PlanCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [alreadyOwned, setAlreadyOwned] = useState(false)

  async function handleBuy() {
    const sessionRes = await fetch('/api/auth/session')
    const session = await sessionRes.json()
    if (!session?.user) {
      window.location.href = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      })
      if (res.status === 409) { setAlreadyOwned(true); return }
      if (!res.ok) { setError('Erro ao iniciar o pagamento. Tente novamente.'); return }
      const { checkoutUrl } = await res.json()
      window.location.href = checkoutUrl
    } catch {
      setError('Erro ao iniciar o pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className={`flex flex-col h-full rounded-2xl border ${
      isPopular
        ? 'bg-[#1a1010] border-[#e3001b]/40'
        : 'bg-[#111111] border-white/8'
    }`}>

      {/* header — altura fixa com badge sempre reservado */}
      <header className="flex flex-col gap-2.5 p-4 pb-4 border-b border-white/5">
        <span className={`self-start inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] ${
          isPopular
            ? 'bg-[#e3001b]/10 border border-[#e3001b]/20 text-[#e3001b]'
            : 'opacity-0 pointer-events-none'
        }`}>
          <span className="w-1 h-1 rounded-full bg-[#e3001b]" />
          Popular
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-black uppercase tracking-tight text-white">{product.name}</h2>
          <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2 min-h-[2.8em]">
            {product.description ?? ''}
          </p>
        </div>
      </header>

      {/* price */}
      <div className="flex flex-col gap-0.5 px-4 py-4 border-b border-white/5">
        <span className="text-3xl font-black text-white tabular-nums">{product.price.formatted}</span>
        <span className="text-[10px] text-white/30 uppercase tracking-wide">pagamento único</span>
      </div>

      {/* cta */}
      <div className="px-4 py-4 border-b border-white/5">
        {alreadyOwned ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-[#4ade80]/20 bg-[#4ade80]/5 py-3">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7l3 3L11.5 3.5" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs font-semibold text-[#4ade80]">Você já tem acesso</span>
          </div>
        ) : (
          <>
            <button
              onClick={handleBuy}
              disabled={loading}
              className={`w-full rounded-xl py-2.5 text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isPopular
                  ? 'bg-[#e3001b] hover:bg-[#b50015] active:bg-[#900010] text-white'
                  : 'border border-white/15 hover:border-white/30 hover:bg-white/5 text-white/80 hover:text-white'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
                  </svg>
                  Processando...
                </>
              ) : 'Garantir acesso'}
            </button>
            {error && (
              <p className="mt-2 text-center text-xs text-[#ef4444]">{error}</p>
            )}
          </>
        )}
      </div>

      {/* features */}
      <ul className="flex flex-col gap-0 px-4 py-3 flex-grow">
        {(product.features ?? []).map((feature) => (
          <li key={feature} className="flex items-start gap-2 py-1.5 border-b border-white/5 last:border-0">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
              <path
                d="M2.5 7.2l3 2.8 6-6"
                stroke={isPopular ? '#e3001b' : 'rgba(255,255,255,0.25)'}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[11px] text-white/55 leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>

    </article>
  )
}
