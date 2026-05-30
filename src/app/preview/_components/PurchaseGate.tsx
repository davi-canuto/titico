"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Product = {
  id: string
  name: string
  price: string
}

type Props = {
  product: Product | null
  contentId: string
  isAuthenticated: boolean
}

export function PurchaseGate({ product, contentId, isAuthenticated }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    if (!product) return
    if (!isAuthenticated) {
      router.push(`/login?redirect=/preview/${contentId}`)
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      })
      const data = await res.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#161616] border border-white/10 rounded-xl p-8 text-center">
      {product ? (
        <>
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-white/50 mb-2">
            Acesso necessário
          </p>
          <h3 className="text-white font-black uppercase tracking-tight text-xl mb-1">
            {product.name}
          </h3>
          <p className="text-[#e3001b] font-black text-3xl mb-6">{product.price}</p>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="bg-[#e3001b] hover:bg-[#b50015] active:bg-[#900010] text-white font-black uppercase tracking-wider rounded-lg px-8 py-3 transition-colors disabled:opacity-60"
          >
            {loading ? "Aguarde..." : "Garantir acesso"}
          </button>
        </>
      ) : (
        <>
          <p className="text-white/60 mb-4">
            Este conteúdo requer acesso à plataforma.
          </p>
          <a
            href="/planos"
            className="inline-block bg-[#e3001b] hover:bg-[#b50015] active:bg-[#900010] text-white font-black uppercase tracking-wider rounded-lg px-8 py-3 transition-colors"
          >
            Ver planos
          </a>
        </>
      )}
    </div>
  )
}
