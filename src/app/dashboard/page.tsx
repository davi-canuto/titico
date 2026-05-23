import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/lib/auth"
import TrailRow from "@/components/platform/TrailRow"
import SkinPicker from "@/components/platform/SkinPicker"
import { splashUrl } from "@/lib/shaco-skins"
import * as userService from "@/services/user.service"
import * as contentService from "@/services/content.service"
import * as trailService from "@/services/trail.service"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const userId = session.user.id

  const [user, continueWatching, trails] = await Promise.all([
    userService.getUserProfile(userId),
    contentService.getContinueWatching(userId),
    trailService.getActiveTrails(),
  ])

  const { hasAccess } = await userService.getUserAccessStatus(userId)

  const progressMap = Object.fromEntries(
    continueWatching.map((p) => [p.contentId, { watchedSeconds: p.watchedSeconds }])
  )

  const continueItems = continueWatching.map((p) => ({ id: p.id, content: p.content }))
  const activeTrails = trails.filter((t) => t.items.length > 0)

  return (
    <main className="min-h-screen bg-[#0d0d0d]">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[56vw] max-h-[620px] min-h-[380px] overflow-hidden">
        <Image
          src={splashUrl(user?.heroSkin ?? '0')}
          alt="Shaco"
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/10 to-transparent" />

        <SkinPicker currentSkin={user?.heroSkin ?? '0'} />

        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-14 md:px-12">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e3001b]">
            Guia definitivo
          </p>
          <h1 className="mb-3 text-4xl font-black uppercase leading-none tracking-tight text-white md:text-6xl">
            Lobby do<br />Titiltei
          </h1>
          <p className="mb-6 max-w-sm text-sm text-white/55 leading-relaxed hidden md:block">
            Módulos, matchups, builds e análises para você subir de elo com Shaco.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/explorar"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-black uppercase tracking-wider text-black transition-colors hover:bg-white/90"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="black">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Explorar
            </Link>
            {!hasAccess && (
              <Link
                href="/planos"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Ver planos
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Content rows ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-10 py-10">
        {continueItems.length > 0 && (
          <TrailRow
            title="Continue assistindo"
            items={continueItems}
            progressMap={progressMap}
            locked={!hasAccess}
          />
        )}

        {activeTrails.map((trail) => (
          <TrailRow
            key={trail.id}
            title={trail.title}
            items={trail.items.map((i) => ({ id: i.id, content: i.content }))}
            progressMap={progressMap}
            locked={!hasAccess}
          />
        ))}

        {activeTrails.length === 0 && continueItems.length === 0 && (
          <div className="mx-6 flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#111111] py-24 md:mx-12">
            <p className="text-sm font-semibold text-white/30">Conteúdos em breve</p>
          </div>
        )}
      </div>

    </main>
  )
}
