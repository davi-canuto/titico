import Link from "next/link"
import { getLatestVideos } from "@/lib/youtube"
import type { YouTubeVideo } from "@/lib/youtube"

const CHANNELS = [
  {
    id: "discord",
    name: "Discord",
    description: "Servidor principal da comunidade. Tire dúvidas, compartilhe replays, participe de lives e discuta estratégias com outros jogadores.",
    url: "https://discord.gg/G4ffQJGrF",
    icon: "discord",
    members: "1.200+ membros",
    color: "#5865F2",
    primary: true,
    cta: "Entrar no servidor",
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Vídeos de análise, replays comentados e dicas semanais publicados toda semana.",
    url: "https://www.youtube.com/@TiTiltei",
    icon: "youtube",
    members: "4.500+ inscritos",
    color: "#FF0000",
    primary: false,
    cta: "Acessar canal",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Grupo para avisos rápidos, notificações de novos conteúdos e sorteios exclusivos.",
    url: "https://chat.whatsapp.com/titico",
    icon: "whatsapp",
    members: "300+ participantes",
    color: "#25D366",
    primary: false,
    cta: "Entrar no grupo",
  },
]

function DiscordIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  )
}

function ChannelIcon({ icon, color }: { icon: string; color: string }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: color + "20", color }}>
      {icon === "discord" && <DiscordIcon />}
      {icon === "youtube" && <YouTubeIcon />}
      {icon === "whatsapp" && <WhatsAppIcon />}
    </div>
  )
}

export default async function ComunidadePage() {
  const [videos, primaryChannel] = await Promise.all([
    getLatestVideos(6),
    Promise.resolve(CHANNELS.find((c) => c.primary)!),
  ])
  const secondaryChannels = CHANNELS.filter((c) => !c.primary)

  return (
    <main className="min-h-screen bg-[#0d0d0d]">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="px-6 pt-10 pb-8 md:px-12">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#e3001b]">
          Comunidade
        </p>
        <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
          Faça parte<br />
          <span className="text-white/40">da comunidade</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm text-white/50">
          Junte-se a centenas de jogadores que já estão evoluindo juntos. Tire dúvidas, compartilhe replays e receba dicas exclusivas nos nossos canais.
        </p>
      </div>

      <div className="px-6 pb-16 md:px-12 space-y-8">

        {/* ── Discord — canal principal ─────────────────────────────── */}
        <section>
          <div className="relative overflow-hidden rounded-2xl border bg-[#161616] p-8" style={{ borderColor: primaryChannel.color + "40" }}>
            <div
              className="pointer-events-none absolute inset-0 opacity-5"
              style={{ background: `radial-gradient(ellipse at top left, ${primaryChannel.color}, transparent 60%)` }}
            />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <ChannelIcon icon={primaryChannel.icon} color={primaryChannel.color} />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black uppercase tracking-tight text-white">
                      {primaryChannel.name}
                    </h2>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
                      style={{ backgroundColor: primaryChannel.color + "20", color: primaryChannel.color }}
                    >
                      Principal
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                    {primaryChannel.members}
                  </p>
                  <p className="mt-3 max-w-md text-sm text-white/60">
                    {primaryChannel.description}
                  </p>
                </div>
              </div>
              <Link
                href={primaryChannel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-lg px-6 py-3 text-sm font-black uppercase tracking-wider text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: primaryChannel.color }}
              >
                {primaryChannel.cta}
              </Link>
            </div>
          </div>
        </section>

        {/* ── Canais secundários ────────────────────────────────────── */}
        <section>
          <h3 className="mb-4 border-l-2 border-[#e3001b] pl-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
            Outros canais
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {secondaryChannels.map((channel) => (
              <div
                key={channel.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-white/5 bg-[#161616] p-6"
              >
                <div className="flex items-start gap-4">
                  <ChannelIcon icon={channel.icon} color={channel.color} />
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-white">
                      {channel.name}
                    </h4>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                      {channel.members}
                    </p>
                    <p className="mt-2 text-sm text-white/50">
                      {channel.description}
                    </p>
                  </div>
                </div>
                <Link
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/25 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-colors hover:border-white active:bg-white/10"
                >
                  {channel.cta}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── Vídeos recentes do YouTube ───────────────────────────── */}
        {videos.length > 0 && (
          <section>
            <h3 className="mb-4 border-l-2 border-[#e3001b] pl-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
              Vídeos recentes
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video: YouTubeVideo) => (
                <a
                  key={video.id}
                  href={`https://youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#161616] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-white text-sm font-semibold leading-snug line-clamp-2 mb-2">
                      {video.title}
                    </p>
                    <p className="text-white/40 text-xs">
                      {new Date(video.publishedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                    <span className="mt-2 inline-block text-[#e3001b] text-xs font-semibold hover:underline">
                      Assistir →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── CTA final ────────────────────────────────────────────── */}
        <section className="rounded-xl border border-white/5 bg-[#111111] px-6 py-8 text-center">
          <p className="text-sm font-semibold text-white/40 uppercase tracking-[0.2em]">
            Ficou com alguma dúvida?
          </p>
          <p className="mt-2 text-xl font-black uppercase tracking-tight text-white">
            Pergunte no Discord
          </p>
          <Link
            href={primaryChannel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#e3001b] px-6 py-3 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015] active:bg-[#900010]"
          >
            Acessar o servidor
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>
            </svg>
          </Link>
        </section>

      </div>
    </main>
  )
}
