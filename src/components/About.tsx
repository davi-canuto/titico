export default function About() {
  return (
    <section id="sobre" className="py-24 bg-[#111]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Photo placeholder */}
          <div className="shrink-0">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-2 border-[#e3001b]">
              <img
                src="/titico.jpeg"
                alt="Titiltei"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-5xl md:text-6xl font-black uppercase mb-2">
              <span className="text-[#e3001b]">SOBRE</span> MIM
            </h2>
            <div className="w-16 h-1 bg-[#e3001b] mb-6" />

            <div className="space-y-4 text-white/70 text-sm md:text-base leading-relaxed uppercase font-medium">
              <p>
                Tiago <strong className="text-white">&quot;Titiltei&quot;</strong> Nunes, conhecido também por &quot;Titi&quot;, sou um criador de
                conteúdo do YouTube/@titiltei e da Twitch.tv/titiltei.
              </p>
              <p>
                Consegui me diferenciar graças ao meu quadro &quot;Titiltando os Streamers&quot;, que envolve
                diversos nomes relevantes no cenário de League of Legends: Yoda, Jukes, Pijack, Minerva, Yetz,
                Pimpimenta, Ayel e entre outros.
              </p>
              <p>
                Me especializei na classe de bonecos &quot;Assassinos&quot; na Jungle, e sei que posso somar bastante
                com a comunidade passando minha visão de jogo para quem estiver disposto a aprender a jogar na
                Jungle e absorver minha estratégia para subir de elo de uma forma diferente e criativa.
              </p>
            </div>

            {/* Rank badges */}
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="bg-[#e3001b]/15 border border-[#e3001b]/40 rounded-xl px-5 py-3 flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="text-[#e3001b] font-black uppercase text-xs tracking-wider">Top 1 Shaco do Mundo</p>
                  <p className="text-white/50 text-xs">TiTiltei#Amor</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 flex items-center gap-3">
                <span className="text-2xl">🇧🇷</span>
                <div>
                  <p className="text-white font-black uppercase text-xs tracking-wider">Top 1 Shaco BR</p>
                  <p className="text-white/50 text-xs">Server BR</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
