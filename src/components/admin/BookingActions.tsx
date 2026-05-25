'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { BookingStatus } from '@prisma/client'

interface Props {
  bookingId: string
  status: BookingStatus
}

export default function BookingActions({ bookingId, status }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirmRefund, setConfirmRefund] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function updateStatus(newStatus: 'COMPLETED' | 'POSTPONED') {
    setLoading(true)
    setError(null)
    try {
      await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      router.refresh()
    } catch {
      setError('Erro ao atualizar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRefund() {
    setLoading(true)
    setError(null)
    setConfirmRefund(false)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/refund`, { method: 'POST' })
      if (!res.ok) {
        const data = (await res.json()) as { message?: string }
        setError(data.message ?? 'Erro ao processar estorno.')
        return
      }
      router.refresh()
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'REFUNDED') {
    return <span className="text-xs text-white/30">Estornado</span>
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {status !== 'COMPLETED' && (
          <button
            onClick={() => updateStatus('COMPLETED')}
            disabled={loading}
            className="text-xs font-semibold text-[#4ade80] hover:text-[#4ade80]/70 disabled:opacity-40 transition-colors"
          >
            Concluído
          </button>
        )}
        {status !== 'POSTPONED' && (
          <button
            onClick={() => updateStatus('POSTPONED')}
            disabled={loading}
            className="text-xs font-semibold text-[#60a5fa] hover:text-[#60a5fa]/70 disabled:opacity-40 transition-colors"
          >
            Adiado
          </button>
        )}
        <button
          onClick={() => setConfirmRefund(true)}
          disabled={loading}
          className="text-xs font-semibold text-[#ef4444] hover:text-[#ef4444]/70 disabled:opacity-40 transition-colors"
        >
          Estornar
        </button>
      </div>

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

      {confirmRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#161616] border border-white/10 rounded-xl w-full max-w-sm p-7">
            <h2 className="text-lg font-black uppercase text-white mb-3">Confirmar Estorno</h2>
            <p className="text-white/60 text-sm mb-6">
              Tem certeza que deseja estornar este pagamento? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleRefund}
                disabled={loading}
                className="flex-1 bg-[#e3001b] hover:bg-[#b50015] active:bg-[#900010] disabled:opacity-50 text-white font-black uppercase tracking-wider text-sm py-3 rounded-lg transition-colors"
              >
                {loading ? 'Processando...' : 'Sim, estornar'}
              </button>
              <button
                onClick={() => setConfirmRefund(false)}
                disabled={loading}
                className="flex-1 border border-white/25 hover:border-white text-white font-black uppercase tracking-wider text-sm py-3 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
