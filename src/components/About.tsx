export default function About() {
  return (
    <section id="sobre" className="py-24 bg-[#111]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Photo placeholder */}
          <div className="shrink-0">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-2 border-[#e3001b] bg-[#1a1a1a]">
              {/* Substituir pela foto real do Tiago */}
              <div className="w-full h-full flex items-center justify-center text-white/20 text-sm uppercase tracking-wider">
                Foto
              </div>
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

            {/* Rank table */}
            <div className="mt-8 border border-[#e3001b]/40 rounded overflow-hidden max-w-md">
              <div className="grid grid-cols-4 bg-[#1a1a1a] text-white/50 text-xs uppercase tracking-wider font-semibold">
                <div className="px-4 py-3 border-b border-white/5">Rank</div>
                <div className="px-4 py-3 border-b border-white/5">Tier</div>
                <div className="px-4 py-3 border-b border-white/5">Name</div>
                <div className="px-4 py-3 border-b border-white/5">Region</div>
              </div>
              <div className="grid grid-cols-4 bg-[#111] items-center">
                <div className="px-4 py-4 text-white font-black text-lg">1</div>
                <div className="px-4 py-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">🏆</span>
                    <span className="text-white/60 text-xs font-bold">CH</span>
                  </div>
                </div>
                <div className="px-4 py-4 text-white font-semibold text-sm">TiTiltei#Amor</div>
                <div className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇧🇷</span>
                    <span className="text-white/60 text-xs font-bold">BR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
