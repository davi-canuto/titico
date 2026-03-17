import { matchups, lockedMatchups } from '@/data/matchups'

const WA_URL =
  'https://api.whatsapp.com/send/?phone=5512982700714&text=Ol%C3%A1%2C+tudo+bem+%3F%21+Vim+do+site+e+gostaria+de+fazer+um+or%C3%A7amento+%21&type=phone_number&app_absent=0'

const DDRAGON = 'https://ddragon.leagueoflegends.com/cdn/15.5.1'

const previewUnlocked = matchups.slice(0, 5)
const previewLocked = lockedMatchups.slice(0, 7)

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_0.jpg"
          alt="Shaco"
          className="w-full h-full object-cover object-center opacity-20 sm:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/80 to-[#0d0d0d]/50 sm:via-[#0d0d0d]/60 sm:to-[#0d0d0d]/30" />
      </div>

      {/* Accent bars — só desktop */}
      <div className="hidden lg:block absolute left-0 top-1/3 w-1.5 h-28 bg-[#e3001b]" />
      <div className="hidden lg:block absolute left-0 top-1/3 mt-36 w-1.5 h-14 bg-[#e3001b]" />

      {/* Conteúdo */}
      <div className="relative z-10 w-full mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-16 flex flex-col items-center text-center">

        {/* Tag */}
        <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-[0.25em] mb-3 font-semibold">
          Guia Definitivo — Shaco AD Jungle
        </p>

        {/* Título */}
        <h1 className="font-black uppercase leading-none tracking-tight">
          <span className="block text-[clamp(2.5rem,10vw,6.5rem)] text-white">GUIA DO</span>
          <span className="block text-[clamp(2.5rem,10vw,6.5rem)]">
            <span className="text-[#e3001b]">SHACO</span>
            <span className="text-white"> AD</span>
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="mt-3 sm:mt-5 text-[clamp(0.65rem,2.8vw,1.1rem)] text-white/55 uppercase tracking-[0.2em] font-light">
          Se torne um deus jogando de Shaco
        </p>

        {/* Rank badges */}
        <div className="mt-4 flex gap-2 sm:gap-3 flex-wrap justify-center">
          <span className="bg-[#e3001b]/20 border border-[#e3001b]/50 text-[#e3001b] text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
            🏆 Top 1 Shaco do Mundo
          </span>
          <span className="bg-white/5 border border-white/20 text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            🇧🇷 Top 1 Shaco BR
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-7 sm:mt-9 flex flex-col xs:flex-row gap-3 w-full max-w-xs xs:max-w-none xs:w-auto">
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#e3001b] hover:bg-[#b50015] active:bg-[#900010] text-white font-black uppercase tracking-wider text-xs sm:text-sm lg:text-base px-5 sm:px-7 py-3.5 sm:py-4 rounded-lg transition-colors shadow-lg shadow-red-900/40 whitespace-nowrap"
          >
            Comprar Guia Completo
          </a>
          <a
            href="#matchups"
            className="border border-white/25 hover:border-white active:bg-white/10 text-white font-bold uppercase tracking-wider text-xs sm:text-sm lg:text-base px-5 sm:px-7 py-3.5 sm:py-4 rounded-lg transition-colors whitespace-nowrap"
          >
            Ver Matchups Grátis
          </a>
        </div>

        {/* Mini matchup grid */}
        <div className="mt-8 sm:mt-10">
          <p className="text-white/30 text-[10px] uppercase tracking-widest mb-4">
            Matchups disponíveis no guia
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-sm sm:max-w-lg">
            {previewUnlocked.map((m) => (
              <a key={m.champion} href="#matchups" title={m.displayName}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-[#e3001b]/60 hover:ring-[#e3001b] transition-all">
                  <img
                    src={`${DDRAGON}/img/champion/${m.champion}.png`}
                    alt={m.displayName}
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
              </a>
            ))}
            {previewLocked.map((m) => (
              <a key={m.champion} href="#matchups" title={`${m.displayName} — Bloqueado`}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-white/10 relative">
                  <img
                    src={`${DDRAGON}/img/champion/${m.champion}.png`}
                    alt={m.displayName}
                    className="w-full h-full object-cover scale-110 grayscale opacity-40"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <LockIcon />
                  </div>
                </div>
              </a>
            ))}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-white/40 text-[10px] font-bold">+{lockedMatchups.length - previewLocked.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce">
        <span className="text-white/25 text-[9px] uppercase tracking-widest">Rolar</span>
        <div className="w-px h-5 sm:h-6 bg-[#e3001b]" />
      </div>
    </section>
  )
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="white" opacity="0.7">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
    </svg>
  )
}
