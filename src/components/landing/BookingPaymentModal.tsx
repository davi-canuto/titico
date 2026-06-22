'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCalApi } from '@calcom/embed-react'

interface Props {
  open: boolean
  onClose: () => void
  productId: string
  calSlug: string
  productName: string
  isAuthenticated: boolean
  pixEnabled: boolean
}

interface PixData {
  correlationID: string
  qrCodeImage: string
  brCode: string
}

type View = 'buttons' | 'qr' | 'expired'

const POLL_INTERVAL_MS = 3000
const POLL_TIMEOUT_MS = 10 * 60 * 1000

export default function BookingPaymentModal({ open, onClose, productId, calSlug, productName, isAuthenticated, pixEnabled }: Props) {
  const router = useRouter()
  const [view, setView] = useState<View>('buttons')
  const [loadingCard, setLoadingCard] = useState(false)
  const [loadingPix, setLoadingPix] = useState(false)
  const [pixData, setPixData] = useState<PixData | null>(null)
  const [guestEmail, setGuestEmail] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  function clearPolling() {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      setView('buttons')
      setLoadingCard(false)
      setLoadingPix(false)
      setPixData(null)
      setGuestEmail('')
      setCopied(false)
      setError(null)
      clearPolling()
    }
  }, [open])

  useEffect(() => {
    if (!pixData) return

    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/checkout/pix/status?correlationID=${pixData.correlationID}`)
        if (!res.ok) return
        const data = (await res.json()) as { status: string }
        if (data.status === 'COMPLETED') {
          clearPolling()
          onClose()
          const cal = await getCalApi()
          cal('modal', { calLink: calSlug })
        } else if (data.status === 'EXPIRED') {
          clearPolling()
          setView('expired')
        }
      } catch { /* ignore transient errors */ }
    }, POLL_INTERVAL_MS)

    timeoutRef.current = setTimeout(() => {
      clearPolling()
      setView('expired')
    }, POLL_TIMEOUT_MS)

    return clearPolling
  }, [pixData, calSlug, onClose])

  if (!open) return null

  async function handleCard() {
    setLoadingCard(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, calSlug }),
      })
      const data = (await res.json()) as { checkoutUrl?: string; issues?: { message: string }[] }
      if (!res.ok) {
        setError(data?.issues?.[0]?.message ?? 'Erro ao iniciar pagamento. Tente novamente.')
        setLoadingCard(false)
        return
      }
      window.location.href = data.checkoutUrl!
    } catch (e) {
      console.error('[BookingPaymentModal/handleCard]', e)
      setError(e instanceof Error ? e.message : 'Erro de conexão. Tente novamente.')
      setLoadingCard(false)
    }
  }

  async function handlePix() {
    if (!isAuthenticated && !guestEmail) {
      setError('Informe seu email para continuar.')
      return
    }
    setLoadingPix(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, ...(!isAuthenticated && { guestEmail }) }),
      })
      if (!res.ok) {
        let msg = 'Erro ao gerar cobrança PIX.'
        try {
          const json = (await res.json()) as { error?: string }
          if (res.status === 409) msg = 'Você já adquiriu este produto.'
          else msg = json.error ?? msg
        } catch { /* non-JSON error */ }
        setError(msg)
        setLoadingPix(false)
        return
      }
      const data = (await res.json()) as PixData
      setPixData(data)
      setView('qr')
    } catch (e) {
      console.error('[BookingPaymentModal/handlePix]', e)
      setError(e instanceof Error ? e.message : 'Erro de conexão. Tente novamente.')
    } finally {
      setLoadingPix(false)
    }
  }

  async function handleCopy() {
    if (!pixData) return
    try {
      await navigator.clipboard.writeText(pixData.brCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard blocked */ }
  }

  function handleRetry() {
    setPixData(null)
    setView('buttons')
    setError(null)
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="bg-[#161616] border border-white/10 rounded-xl w-full max-w-sm p-7 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <p className="text-[#e3001b] text-xs uppercase tracking-[0.3em] font-semibold mb-1">{productName}</p>

        {view === 'buttons' && (
          <>
            <h2 className="text-xl font-black uppercase text-white mb-5">COMO VOCÊ QUER PAGAR?</h2>

            {!isAuthenticated && (
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Seu email (para recibo e suporte)"
                className="w-full bg-[#0d0d0d] border border-white/10 focus:border-white/30 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none transition-colors mb-3"
              />
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleCard}
                disabled={loadingCard || loadingPix}
                className="flex items-center gap-3 bg-[#e3001b] hover:bg-[#b50015] active:bg-[#900010] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-wider text-sm px-5 py-3.5 rounded-lg transition-colors w-full"
              >
                {loadingCard ? <Spinner /> : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                )}
                Cartão de Crédito
              </button>

              {pixEnabled && (
                <button
                  onClick={handlePix}
                  disabled={loadingCard || loadingPix}
                  className="flex items-center gap-3 border border-white/25 hover:border-white active:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-wider text-sm px-5 py-3.5 rounded-lg transition-colors w-full"
                >
                  {loadingPix ? <Spinner /> : <PixIcon />}
                  PIX
                </button>
              )}
            </div>

            {error && <p className="mt-4 text-xs text-red-400 text-center">{error}</p>}
            <p className="mt-5 text-xs text-white/30 text-center">
              Pagamento seguro via Stripe{pixEnabled ? ' e Woovi' : ''}
            </p>
          </>
        )}

        {view === 'qr' && pixData && (
          <>
            <h2 className="text-xl font-black uppercase text-white mb-2">PAGUE VIA PIX</h2>
            <p className="text-white/50 text-sm mb-5">Escaneie o QR code ou copie o código no seu app do banco.</p>

            <div className="flex justify-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pixData.qrCodeImage}
                alt="QR Code PIX"
                width={200}
                height={200}
                className="rounded-lg border border-white/10"
              />
            </div>

            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white text-sm font-semibold rounded-lg px-4 py-3 transition-colors mb-4"
            >
              {copied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[#4ade80]">Código copiado!</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copiar código PIX
                </>
              )}
            </button>

            <div className="flex items-center gap-2 text-white/30 text-xs justify-center">
              <Spinner />
              Aguardando pagamento...
            </div>
          </>
        )}

        {view === 'expired' && (
          <>
            <h2 className="text-xl font-black uppercase text-white mb-2">QR CODE EXPIRADO</h2>
            <p className="text-white/50 text-sm mb-6">O tempo limite para pagamento foi atingido. Gere um novo QR code para continuar.</p>
            <button
              onClick={handleRetry}
              className="w-full bg-[#e3001b] hover:bg-[#b50015] active:bg-[#900010] text-white font-black uppercase tracking-wider text-sm px-5 py-3.5 rounded-lg transition-colors"
            >
              Gerar novo QR code
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
    </svg>
  )
}

function PixIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor">
      <path d="M242.4 292.5C247.8 287.1 255.1 284.1 262.5 284.1C269.9 284.1 277.2 287.1 282.5 292.5L358.5 368.5C367.1 377.1 377.1 381.5 388.6 381.5C400 381.5 410.6 377.1 419.1 368.5C419.1 368.5 419.1 368.5 419.1 368.5L487.6 300C496.2 291.5 500.5 280.9 500.5 269.5C500.5 258.1 496.2 247.5 487.6 239L419.1 170.5C419.1 170.5 419.1 170.5 419.1 170.5C410.6 161.1 400 157.5 388.6 157.5C377.1 157.5 367.1 161.1 358.5 170.5L282.5 246.5C277.2 251.9 269.9 254.9 262.5 254.9C255.1 254.9 247.8 251.9 242.4 246.5L166.4 170.5C157.9 161.1 147.3 157.5 135.9 157.5C124.4 157.5 113.9 161.1 105.3 170.5L36.8 239C28.3 247.5 24 258.1 24 269.5C24 280.9 28.3 291.5 36.8 300L105.3 368.5C113.9 377.1 124.4 381.5 135.9 381.5C147.3 381.5 157.9 377.1 166.4 368.5L242.4 292.5Z" />
    </svg>
  )
}
