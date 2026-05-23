"use client"

import { useState, useTransition } from "react"
import { requestRefund } from "@/lib/actions/refund"

interface RefundButtonProps {
  purchaseId: string
  daysLeft: number
}

export default function RefundButton({ purchaseId, daysLeft }: RefundButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<boolean>(false)

  function handleRefund() {
    if (!confirming) {
      setConfirming(true)
    }
  }

  function handleConfirm() {
    setError(null)
    startTransition(async () => {
      const result = await requestRefund(purchaseId)
      if (result.error) {
        setError(result.error)
        setConfirming(false)
      }
    })
  }

  function handleCancel() {
    setConfirming(false)
  }

  return (
    <div className="flex flex-col gap-2">
      {confirming ? (
        <div className="flex items-center gap-2">
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-[#e3001b] hover:bg-[#b50015] active:bg-[#900010] px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Processando..." : "Confirmar reembolso"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg border border-white/25 hover:border-white active:bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          onClick={handleRefund}
          disabled={isPending}
          className="self-start inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-white/50 transition-colors hover:border-white/30 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.15" />
          </svg>
          Solicitar reembolso
          <span className="text-white/25">
            ({daysLeft} {daysLeft === 1 ? "dia restante" : "dias restantes"})
          </span>
        </button>
      )}
      {error && <p className="text-xs text-[#ef4444]">{error}</p>}
    </div>
  )
}
