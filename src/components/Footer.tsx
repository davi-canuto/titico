export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-2xl font-black tracking-widest uppercase">
            TITIL<span className="text-[#e3001b]">TEI</span>
          </p>
          <p className="text-white/30 text-xs mt-1">Guia do Shaco AD — Rank 1 Challenger BR</p>
        </div>

        <div className="flex gap-6 text-white/40 text-xs uppercase tracking-wider">
          <a href="mailto:titiltei.contatos@gmail.com" className="hover:text-white transition-colors">
            Contato
          </a>
          <a href="https://twitch.tv/titiltei" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Twitch
          </a>
          <a href="https://youtube.com/@titiltei" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            YouTube
          </a>
        </div>

        <div className="text-center md:text-right">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} Titiltei. Todos os direitos reservados.<br />
            Não afiliado à Riot Games.
          </p>
          <p className="text-white/15 text-[10px] mt-2 tracking-wide">
            feito com{" "}
            <span className="text-[#e3001b]/40">♥</span>
            {" "}por{" "}
            <a
              href="https://my-portfolio-one-kappa-vvfcztdwko.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/25 hover:text-white/60 transition-colors duration-300 underline underline-offset-2 decoration-white/10 hover:decoration-white/30"
            >
              davi-canuto
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
