import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import { createTrail } from "@/lib/admin-actions"
import TitleSlugFields from "@/components/admin/TitleSlugFields"

const inputCls =
  "w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50"

interface NovaTrillhaPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function NovaTrilhaPage({ searchParams }: NovaTrillhaPageProps) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== UserRole.ADMIN) redirect("/dashboard")

  const { error } = await searchParams

  return (
    <main className="mx-auto max-w-xl px-4 py-8 md:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/dashboard/admin?tab=trilhas"
          className="text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          ← Admin
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-sm text-white/60">Nova trilha</span>
      </div>

      <h1 className="mb-8 border-l-2 border-[#e3001b] pl-3 text-2xl font-black uppercase tracking-tight text-white">
        Nova trilha
      </h1>

      {error === "slug" && (
        <div className="mb-6 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-sm text-[#ef4444]">
          Slug já em uso — escolha outro.
        </div>
      )}

      <form action={createTrail} className="flex flex-col gap-5">
        <TitleSlugFields />

        <div>
          <label className={labelCls}>Descrição</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Descrição opcional da trilha..."
            className={`${inputCls} resize-none`}
          />
        </div>

        <div>
          <label className={labelCls}>Thumbnail URL</label>
          <input
            name="thumbnail"
            type="url"
            placeholder="https://..."
            className={inputCls}
          />
        </div>

        <p className="text-xs text-white/30">
          A trilha será criada como <strong className="text-white/50">inativa</strong>. Ative-a no painel após adicionar conteúdos.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-[#e3001b] px-6 py-3 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015] active:bg-[#900010]"
          >
            Criar trilha
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
