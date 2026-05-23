import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { updateTrail } from "@/lib/admin-actions"
import TitleSlugFields from "@/components/admin/TitleSlugFields"

const inputCls =
  "w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50"

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}

export default async function EditarTrilhaPage({ params, searchParams }: PageProps) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== UserRole.ADMIN) redirect("/dashboard")

  const { id } = await params
  const { error } = await searchParams

  const trail = await prisma.trail.findUnique({ where: { id } })

  if (!trail) notFound()

  return (
    <main className="mx-auto max-w-xl px-4 py-8 md:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-white/40">
        <Link href="/dashboard/admin?tab=trilhas" className="hover:text-white/70 transition-colors">Admin</Link>
        <span>/</span>
        <Link href="/dashboard/admin?tab=trilhas" className="hover:text-white/70 transition-colors">Trilhas</Link>
        <span>/</span>
        <span className="text-white/70">{trail.title}</span>
        <span>/</span>
        <span className="text-white/70">Editar</span>
      </div>

      <h1 className="mb-8 border-l-2 border-[#e3001b] pl-3 text-2xl font-black uppercase tracking-tight text-white">
        Editar trilha
      </h1>

      {error === "slug" && (
        <div className="mb-6 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-sm text-[#ef4444]">
          Slug já em uso — escolha outro.
        </div>
      )}

      <form action={updateTrail.bind(null, trail.id)} className="flex flex-col gap-5">
        <TitleSlugFields defaultTitle={trail.title} defaultSlug={trail.slug} />

        <div>
          <label className={labelCls}>Descrição</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={trail.description ?? ""}
            placeholder="Descrição opcional da trilha..."
            className={`${inputCls} resize-none`}
          />
        </div>

        <div>
          <label className={labelCls}>Thumbnail URL</label>
          <input
            name="thumbnail"
            type="url"
            defaultValue={trail.thumbnail ?? ""}
            placeholder="https://..."
            className={inputCls}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-[#e3001b] px-6 py-3 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015] active:bg-[#900010]"
          >
            Salvar alterações
          </button>
          <Link
            href="/dashboard/admin?tab=trilhas"
            className="text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  )
}
