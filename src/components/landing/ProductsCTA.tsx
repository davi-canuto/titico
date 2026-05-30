'use client'

import { useState } from 'react'
import PdfPaymentModal from './PdfPaymentModal'
import BookingPaymentModal from './BookingPaymentModal'


const CoachingIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    <path d="M17 11l1.5 1.5L21 10" />
  </svg>
)

const AnaliseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M7 8l3 3 2-2 3 4" />
  </svg>
)

const PdfIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="13" y2="17" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

interface Props {
  isAuthenticated: boolean
  productsBySlug: Record<string, { id: string; calSlug: string }>
  pdfProductId: string | null
}

export default function ProductsCTA({ isAuthenticated, productsBySlug, pdfProductId }: Props) {
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [bookingModal, setBookingModal] = useState<{ productId: string; calSlug: string; productName: string } | null>(null)

  const coaching = productsBySlug['coaching-1x1']
  const analise = productsBySlug['analise-partida']

  return (
    <section className="py-20 bg-[#111111]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="mb-10">
          <p className="text-[#e3001b] text-xs uppercase tracking-[0.3em] font-semibold mb-2">Produtos</p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase leading-none">
            O QUE VOCÊ <span className="text-[#e3001b]">PRECISA?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Coaching 1:1 */}
          <div className="group bg-[#161616] border border-white/5 rounded-xl p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
            <div className="text-white/50 group-hover:text-[#e3001b] transition-colors">
              <CoachingIcon />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-white/40 mb-1">Coaching 1:1</p>
              <p className="text-white/70 text-sm leading-relaxed">Sessão individual com o Titiltei. Foco total no seu jogo.</p>
            </div>
            <button
              onClick={() => coaching?.calSlug && setBookingModal({ productId: coaching.id, calSlug: coaching.calSlug, productName: 'Coaching 1:1' })}
              disabled={!coaching?.calSlug}
              className="inline-flex items-center justify-center gap-2 bg-[#e3001b] hover:bg-[#b50015] active:bg-[#900010] text-white font-black uppercase tracking-wider text-sm px-4 py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Agendar <ArrowIcon />
            </button>
          </div>

          {/* Análise de Partida */}
          <div className="group bg-[#161616] border border-white/5 rounded-xl p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
            <div className="text-white/50 group-hover:text-[#e3001b] transition-colors">
              <AnaliseIcon />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-white/40 mb-1">Análise de Partida</p>
              <p className="text-white/70 text-sm leading-relaxed">Manda sua partida, o Titiltei analisa e te diz o que melhorar.</p>
            </div>
            <button
              onClick={() => analise?.calSlug && setBookingModal({ productId: analise.id, calSlug: analise.calSlug, productName: 'Análise de Partida' })}
              disabled={!analise?.calSlug}
              className="inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white active:bg-white/10 text-white font-black uppercase tracking-wider text-sm px-4 py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Agendar <ArrowIcon />
            </button>
          </div>

          {/* PDF Guia */}
          <div className="group bg-[#161616] border border-white/5 rounded-xl p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
            <div className="text-white/50 group-hover:text-[#e3001b] transition-colors">
              <PdfIcon />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-white/40 mb-1">PDF Guia do Shaco</p>
              <p className="text-white/70 text-sm leading-relaxed">Material completo em PDF para estudar no seu ritmo.</p>
            </div>
            <button
              onClick={() => pdfProductId && setPdfModalOpen(true)}
              disabled={!pdfProductId}
              className="inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white active:bg-white/10 text-white font-black uppercase tracking-wider text-sm px-4 py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Comprar <ArrowIcon />
            </button>
          </div>

        </div>
      </div>

      <PdfPaymentModal
        open={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        productId={pdfProductId ?? ''}
        isAuthenticated={isAuthenticated}
      />

      {bookingModal && (
        <BookingPaymentModal
          open={true}
          onClose={() => setBookingModal(null)}
          productId={bookingModal.productId}
          calSlug={bookingModal.calSlug}
          productName={bookingModal.productName}
          isAuthenticated={isAuthenticated}
        />
      )}
    </section>
  )
}
