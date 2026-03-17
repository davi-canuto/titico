const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=5512982700714&text=Ol%C3%A1%2C+tudo+bem+%3F%21+Vim+do+site+e+gostaria+de+fazer+um+or%C3%A7amento+%21&type=phone_number&app_absent=0'

export default function BuyGuide() {
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

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-[#e3001b] hover:bg-[#b50015] text-white font-black uppercase tracking-wider text-xl px-10 py-5 rounded-xl transition-colors shadow-lg shadow-red-900/30"
          >
            <WhatsAppIcon />
            Comprar Guia Completo
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 border border-white/20 hover:border-white text-white font-black uppercase tracking-wider text-xl px-10 py-5 rounded-xl transition-colors"
          >
            <WhatsAppIcon />
            Agendar Coach
          </a>
        </div>
        <p className="text-white/30 text-xs mt-4 uppercase tracking-wider">
          Resposta rápida via WhatsApp
        </p>
      </div>
    </section>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
