export default function BuyGuide() {
  // Substituir KIWIFY_URL pelo link real da Kiwify
  const KIWIFY_URL = '#'

  return (
    <section id="guia" className="py-24 bg-[#111] relative overflow-hidden">
      {/* Background Shaco art */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_0.jpg"
          alt=""
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-[#111]/80" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <p className="text-[#e3001b] text-sm uppercase tracking-[0.3em] font-semibold mb-2">Guia Completo</p>
        <h2 className="text-5xl md:text-7xl font-black uppercase leading-none mb-4">
          ACESSE O GUIA <span className="text-[#e3001b]">COMPLETO</span>
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
          Tenha acesso a <strong className="text-white">todas as matchups</strong>, builds e runas
          que você precisa para subir de elo.
        </p>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: '⚔️', title: 'Todos os Matchups', desc: 'Estratégias detalhadas contra cada jungler do meta' },
            { icon: '🛡️', title: 'Build Completa', desc: 'Itens, runas e feitiços otimizados para cada situação' },
            { icon: '📈', title: 'Suba de Elo', desc: 'Estratégias exclusivas do Rank 1 Challenger BR' },
          ].map((f) => (
            <div key={f.title} className="bg-[#161616] border border-white/5 rounded-xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-black uppercase text-sm tracking-wider mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        <a
          href={KIWIFY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#e3001b] hover:bg-[#b50015] text-white font-black uppercase tracking-wider text-xl px-10 py-5 rounded-xl transition-colors shadow-lg shadow-red-900/30"
        >
          <span>⬇</span>
          Comprar Guia Completo
        </a>
        <p className="text-white/30 text-xs mt-4 uppercase tracking-wider">
          Acesso imediato após a compra
        </p>
      </div>
    </section>
  )
}
