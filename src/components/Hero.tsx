export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_0.jpg"
          alt="Shaco"
          className="w-full h-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-[#0d0d0d]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-transparent to-[#0d0d0d]/60" />
      </div>

      {/* Red accent bars left */}
      <div className="absolute left-0 top-1/4 w-2 h-32 bg-[#e3001b]" />
      <div className="absolute left-0 top-1/4 mt-40 w-2 h-16 bg-[#e3001b]" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center md:text-left pt-16">
        <p className="text-white/50 text-sm uppercase tracking-[0.3em] mb-4 font-semibold">
          Guia Definitivo
        </p>
        <h1 className="text-6xl md:text-8xl font-black uppercase leading-none mb-2">
          GUIA DO
        </h1>
        <h1 className="text-6xl md:text-8xl font-black uppercase leading-none mb-6">
          <span className="text-[#e3001b]">SHACO</span>{' '}
          <span className="text-white">AD</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/60 uppercase tracking-widest font-light mb-10">
          Se torne um deus jogando de Shaco
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <a
            href="https://api.whatsapp.com/send/?phone=5512982700714&text=Ol%C3%A1%2C+tudo+bem+%3F%21+Vim+do+site+e+gostaria+de+fazer+um+or%C3%A7amento+%21&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#e3001b] hover:bg-[#b50015] text-white font-black uppercase tracking-wider text-lg px-8 py-4 rounded transition-colors"
          >
            Comprar Guia Completo
          </a>
          <a
            href="#matchups"
            className="border border-white/30 hover:border-white text-white font-bold uppercase tracking-wider text-lg px-8 py-4 rounded transition-colors"
          >
            Ver Matchups Grátis
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 flex gap-12 justify-center md:justify-start">
          <div>
            <p className="text-4xl font-black text-[#e3001b]">#1</p>
            <p className="text-sm text-white/50 uppercase tracking-wider">Challenger BR</p>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <p className="text-4xl font-black text-white">Shaco</p>
            <p className="text-sm text-white/50 uppercase tracking-wider">AD Jungle</p>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <p className="text-4xl font-black text-white">BR</p>
            <p className="text-sm text-white/50 uppercase tracking-wider">Server</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/30 text-xs uppercase tracking-widest">Rolar</span>
        <div className="w-px h-8 bg-[#e3001b]" />
      </div>
    </section>
  )
}
