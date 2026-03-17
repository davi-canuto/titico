export default function VideoSection() {
  return (
    <section className="py-16 sm:py-20 bg-[#0d0d0d]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-8">
          <p className="text-[#e3001b] text-xs uppercase tracking-[0.3em] font-semibold mb-2">Conheça o guia</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase">
            VEJA O QUE VOCÊ VAI APRENDER
          </h2>
          <div className="w-12 h-1 bg-[#e3001b] mx-auto mt-3" />
        </div>

        <div className="relative w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
          style={{ aspectRatio: '16/9' }}>
          <iframe
            src="https://www.youtube.com/embed/36wA2v1vXWQ"
            title="Guia do Shaco AD — Titiltei"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </section>
  )
}
