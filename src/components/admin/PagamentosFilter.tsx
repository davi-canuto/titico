"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useRef } from "react"

interface PagamentosFilterProps {
  products: { id: string; name: string }[]
}

export default function PagamentosFilter({ products }: PagamentosFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const params = new URLSearchParams()
    const email = data.get("email") as string
    const productId = data.get("productId") as string
    if (email) params.set("email", email)
    if (productId) params.set("productId", productId)
    router.push(`/admin/pagamentos?${params.toString()}`)
  }

  function handleClear() {
    formRef.current?.reset()
    router.push("/admin/pagamentos")
  }

  const currentEmail = searchParams.get("email") ?? ""
  const currentProductId = searchParams.get("productId") ?? ""
  const hasFilters = currentEmail || currentProductId

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Email
        </label>
        <input
          name="email"
          type="text"
          defaultValue={currentEmail}
          placeholder="usuario@email.com"
          className="rounded-lg border border-white/10 bg-[#161616] px-3 py-2 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-white/30 w-56"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Produto
        </label>
        <select
          name="productId"
          defaultValue={currentProductId}
          className="rounded-lg border border-white/10 bg-[#161616] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-white/30 w-48"
        >
          <option value="">Todos os produtos</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-[#e3001b] px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015] active:bg-[#900010]"
      >
        Filtrar
      </button>

      {hasFilters && (
        <button
          type="button"
          onClick={handleClear}
          className="rounded-lg border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-white/50 transition-colors hover:border-white/30 hover:text-white"
        >
          Limpar
        </button>
      )}
    </form>
  )
}
