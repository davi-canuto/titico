import Link from "next/link"

export default function CheckoutCanceladoPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-8 text-center">

        {/* Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/30">
            Pagamento cancelado
          </p>
          <h1 className="text-4xl font-black uppercase leading-tight tracking-tight text-white">
            Tudo bem,<br />sem pressa
          </h1>
          <p className="text-sm text-white/50 leading-relaxed">
            O pagamento foi cancelado e nada foi cobrado. Você pode voltar aos planos e tentar novamente quando quiser.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/planos"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e3001b] px-8 py-3 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015] active:bg-[#900010]"
          >
            Ver planos
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg border border-white/10 px-8 py-3 text-sm font-semibold text-white/50 transition-colors hover:border-white/25 hover:text-white"
          >
            Voltar ao dashboard
          </Link>
        </div>

      </div>
    </main>
  )
}
