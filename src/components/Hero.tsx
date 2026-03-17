const WA_URL =
  'https://api.whatsapp.com/send/?phone=5512982700714&text=Ol%C3%A1%2C+tudo+bem+%3F%21+Vim+do+site+e+gostaria+de+fazer+um+or%C3%A7amento+%21&type=phone_number&app_absent=0'

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_0.jpg"
          alt="Shaco"
          className="w-full h-full object-cover object-[70%_top] sm:object-center opacity-25 sm:opacity-30"
        />
        {/* Mobile: escurece mais em baixo para texto legível */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/75 to-[#0d0d0d]/30 sm:via-[#0d0d0d]/60 sm:to-[#0d0d0d]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/40 to-transparent sm:via-transparent" />
      </div>

      {/* Accent bar esquerda — oculta em mobile */}
      <div className="hidden sm:block absolute left-0 top-1/3 w-1.5 h-28 bg-[#e3001b]" />
      <div className="hidden sm:block absolute left-0 top-1/3 mt-36 w-1.5 h-14 bg-[#e3001b]" />

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-24 pb-16 flex flex-col items-center text-center gap-0">

        {/* Tag */}
        <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-3 font-semibold">
          Guia Definitivo — Shaco AD Jungle
        </p>

        {/* Título principal */}
        <h1 className="font-black uppercase leading-[0.9] tracking-tight">
          <span className="block text-[clamp(3rem,14vw,7rem)] text-white">GUIA DO</span>
          <span className="block text-[clamp(3rem,14vw,7rem)]">
            <span className="text-[#e3001b]">SHACO</span>
            <span className="text-white"> AD</span>
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="mt-4 sm:mt-5 text-[clamp(0.8rem,3.5vw,1.25rem)] text-white/55 uppercase tracking-[0.15em] sm:tracking-widest font-light max-w-sm sm:max-w-none">
          Se torne um deus jogando de Shaco
        </p>

        {/* CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center bg-[#e3001b] hover:bg-[#b50015] active:bg-[#900010] text-white font-black uppercase tracking-wider text-sm sm:text-base px-7 py-4 rounded-lg transition-colors shadow-lg shadow-red-900/40"
          >
            Comprar Guia Completo
          </a>
          <a
            href="#matchups"
            className="w-full sm:w-auto text-center border border-white/25 hover:border-white active:bg-white/10 text-white font-bold uppercase tracking-wider text-sm sm:text-base px-7 py-4 rounded-lg transition-colors"
          >
            Ver Matchups Grátis
          </a>
        </div>

        {/* Stats */}
        <div className="mt-10 sm:mt-14 flex items-center gap-6 sm:gap-10">
          <Stat value="#1" label="Challenger BR" highlight />
          <div className="w-px h-10 bg-white/10" />
          <Stat value="Shaco" label="AD Jungle" />
          <div className="w-px h-10 bg-white/10" />
          <Stat value="BR" label="Server" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce">
        <span className="text-white/25 text-[10px] uppercase tracking-widest">Rolar</span>
        <div className="w-px h-6 bg-[#e3001b]" />
      </div>
    </section>
  )
}

function Stat({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <p className={`text-2xl sm:text-4xl font-black leading-none ${highlight ? 'text-[#e3001b]' : 'text-white'}`}>
        {value}
      </p>
      <p className="text-[10px] sm:text-xs text-white/45 uppercase tracking-wider">{label}</p>
    </div>
  )
}
