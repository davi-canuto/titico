import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ContentStatus, ContentType, PurchaseStatus, UserRole } from "@prisma/client"
import {
  publishContent,
  unpublishContent,
  deleteContent,
  toggleTrail,
  deleteTrail,
  toggleProduct,
  createCreator,
  toggleCreatorActive,
} from "@/lib/admin-actions"
import ConfirmButton from "@/components/admin/ConfirmButton"

const TYPE_LABELS: Record<string, string> = {
  VIDEO: "Vídeo",
  MATCHUP: "Matchup",
  BUILD: "Build",
  ARTICLE: "Artigo",
  PDF: "PDF",
}

interface AdminPageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== UserRole.ADMIN) redirect("/dashboard")

  const { tab } = await searchParams
  const activeTab =
    tab === "trilhas" ? "trilhas" :
    tab === "analytics" ? "analytics" :
    tab === "produtos" ? "produtos" :
    tab === "usuarios" ? "usuarios" :
    tab === "criadores" ? "criadores" :
    "conteudos"

  const [contents, trails, products] = await Promise.all([
    prisma.content.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.trail.findMany({
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({ orderBy: { createdAt: "asc" } }),
  ])

  const creators = activeTab === "criadores"
    ? await prisma.creator.findMany({
        include: {
          _count: { select: { products: true, contents: true } },
        },
        orderBy: { createdAt: "asc" },
      })
    : []

  const users = activeTab === "usuarios"
    ? await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      })
    : []

  let analytics: {
    revenueTotal: number
    revenueLastMonth: number
    purchasesByStatus: Record<string, number>
    totalUsers: number
    newUsers: number
    usersWithAccess: number
    topContent: Array<{ contentId: string; viewers: number; title: string; type: ContentType }>
  } | null = null

  if (activeTab === "analytics") {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [
      completedPurchases,
      completedPurchasesLastMonth,
      purchaseGroups,
      totalUsers,
      newUsers,
      usersWithAccess,
      topProgressRaw,
    ] = await Promise.all([
      prisma.purchase.findMany({ where: { status: PurchaseStatus.COMPLETED }, include: { product: true } }),
      prisma.purchase.findMany({
        where: { status: PurchaseStatus.COMPLETED, createdAt: { gte: thirtyDaysAgo } },
        include: { product: true },
      }),
      prisma.purchase.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.purchase.count({ where: { status: PurchaseStatus.COMPLETED } }),
      prisma.userProgress.groupBy({
        by: ["contentId"],
        _count: { userId: true },
        orderBy: { _count: { userId: "desc" } },
        take: 10,
      }),
    ])

    const contentIds = topProgressRaw.map((r) => r.contentId)
    const topContents = await prisma.content.findMany({
      where: { id: { in: contentIds } },
      select: { id: true, title: true, type: true },
    })
    const contentMap = new Map(topContents.map((c) => [c.id, c]))

    analytics = {
      revenueTotal: completedPurchases.reduce((sum, p) => sum + p.product.price, 0),
      revenueLastMonth: completedPurchasesLastMonth.reduce((sum, p) => sum + p.product.price, 0),
      purchasesByStatus: Object.fromEntries(purchaseGroups.map((g) => [g.status, g._count._all])),
      totalUsers,
      newUsers,
      usersWithAccess,
      topContent: topProgressRaw
        .filter((r) => contentMap.has(r.contentId))
        .map((r) => ({
          contentId: r.contentId,
          viewers: r._count.userId,
          title: contentMap.get(r.contentId)!.title,
          type: contentMap.get(r.contentId)!.type,
        })),
    }
  }

  const tabCls = (t: string) =>
    `pb-3 text-sm font-black uppercase tracking-widest transition-colors ${
      activeTab === t
        ? "border-b-2 border-[#e3001b] text-white"
        : "text-white/40 hover:text-white/70"
    }`

  const cellCls = "px-4 py-3 text-sm text-white/70"
  const thCls = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-white/30"

  const formatBRL = (centavos: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(centavos / 100)

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">Painel Admin</h1>
            <span className="rounded-full bg-[#e3001b] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white">
              ADMIN
            </span>
          </div>
          <Link href="/dashboard" className="text-xs text-white/40 hover:text-white/70 transition-colors">
            ← Voltar ao Dashboard
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-6 border-b border-white/5">
        <Link href="/dashboard/admin?tab=conteudos" className={tabCls("conteudos")}>
          Conteúdos ({contents.length})
        </Link>
        <Link href="/dashboard/admin?tab=trilhas" className={tabCls("trilhas")}>
          Trilhas ({trails.length})
        </Link>
        <Link href="/dashboard/admin?tab=analytics" className={tabCls("analytics")}>
          Analytics
        </Link>
        <Link href="/dashboard/admin?tab=produtos" className={tabCls("produtos")}>
          Produtos ({products.length})
        </Link>
        <Link href="/dashboard/admin?tab=usuarios" className={tabCls("usuarios")}>
          Usuários
        </Link>
        <Link href="/dashboard/admin?tab=criadores" className={tabCls("criadores")}>
          Criadores
        </Link>
      </div>

      {/* Conteúdos tab */}
      {activeTab === "conteudos" && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Link
              href="/dashboard/admin/conteudos/novo"
              className="rounded-lg bg-[#e3001b] px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015]"
            >
              + Novo conteúdo
            </Link>
          </div>

          {contents.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-[#161616] py-16 text-center">
              <p className="text-sm text-white/30">Nenhum conteúdo ainda</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/5">
              <table className="w-full">
                <thead className="bg-[#161616]">
                  <tr>
                    <th className={thCls}>Título</th>
                    <th className={thCls}>Tipo</th>
                    <th className={thCls}>Status</th>
                    <th className={thCls}>Publicado em</th>
                    <th className={thCls}>Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {contents.map((c) => (
                    <tr key={c.id} className="bg-[#0d0d0d] hover:bg-[#111] transition-colors">
                      <td className={cellCls}>
                        <span className="font-semibold text-white">{c.title}</span>
                        <span className="ml-2 text-xs text-white/30">{c.slug}</span>
                      </td>
                      <td className={cellCls}>{TYPE_LABELS[c.type] ?? c.type}</td>
                      <td className={cellCls}>
                        {c.status === ContentStatus.PUBLISHED ? (
                          <span className="rounded-full bg-[#4ade80]/20 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-[#4ade80]">
                            Publicado
                          </span>
                        ) : (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-white/40">
                            Rascunho
                          </span>
                        )}
                      </td>
                      <td className={cellCls}>
                        {c.publishedAt
                          ? new Date(c.publishedAt).toLocaleDateString("pt-BR")
                          : "—"}
                      </td>
                      <td className={cellCls}>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/admin/conteudos/${c.id}/editar`}
                            className="text-xs text-white/50 hover:text-white transition-colors"
                          >
                            Editar
                          </Link>
                          <span className="text-white/20">·</span>
                          {c.status === ContentStatus.DRAFT ? (
                            <form action={publishContent.bind(null, c.id)}>
                              <button
                                type="submit"
                                className="text-xs text-[#4ade80] hover:underline"
                              >
                                Publicar
                              </button>
                            </form>
                          ) : (
                            <form action={unpublishContent.bind(null, c.id)}>
                              <button
                                type="submit"
                                className="text-xs text-[#fbbf24] hover:underline"
                              >
                                Despublicar
                              </button>
                            </form>
                          )}
                          <span className="text-white/20">·</span>
                          <form action={deleteContent.bind(null, c.id)}>
                            <ConfirmButton
                              message={`Deletar "${c.title}"? Esta ação não pode ser desfeita.`}
                              className="text-xs text-[#ef4444] hover:underline"
                            >
                              Deletar
                            </ConfirmButton>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Trilhas tab */}
      {activeTab === "trilhas" && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Link
              href="/dashboard/admin/trilhas/novo"
              className="rounded-lg bg-[#e3001b] px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015]"
            >
              + Nova trilha
            </Link>
          </div>

          {trails.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-[#161616] py-16 text-center">
              <p className="text-sm text-white/30">Nenhuma trilha ainda</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/5">
              <table className="w-full">
                <thead className="bg-[#161616]">
                  <tr>
                    <th className={thCls}>Título</th>
                    <th className={thCls}>Slug</th>
                    <th className={thCls}>Status</th>
                    <th className={thCls}>Itens</th>
                    <th className={thCls}>Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {trails.map((t) => (
                    <tr key={t.id} className="bg-[#0d0d0d] hover:bg-[#111] transition-colors">
                      <td className={cellCls}>
                        <span className="font-semibold text-white">{t.title}</span>
                      </td>
                      <td className={cellCls}>{t.slug}</td>
                      <td className={cellCls}>
                        {t.active ? (
                          <span className="rounded-full bg-[#4ade80]/20 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-[#4ade80]">
                            Ativo
                          </span>
                        ) : (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-white/40">
                            Inativo
                          </span>
                        )}
                      </td>
                      <td className={cellCls}>{t._count.items}</td>
                      <td className={cellCls}>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/admin/trilhas/${t.id}/editar`}
                            className="text-xs text-white/50 hover:text-white transition-colors"
                          >
                            Editar
                          </Link>
                          <span className="text-white/20">·</span>
                          <Link
                            href={`/dashboard/admin/trilhas/${t.id}/itens`}
                            className="text-xs text-white/50 hover:text-white transition-colors"
                          >
                            Gerenciar itens
                          </Link>
                          <span className="text-white/20">·</span>
                          <form action={toggleTrail.bind(null, t.id, !t.active)}>
                            <button
                              type="submit"
                              className={`text-xs hover:underline ${t.active ? "text-[#fbbf24]" : "text-[#4ade80]"}`}
                            >
                              {t.active ? "Desativar" : "Ativar"}
                            </button>
                          </form>
                          <span className="text-white/20">·</span>
                          <form action={deleteTrail.bind(null, t.id)}>
                            <ConfirmButton
                              message={`Deletar trilha "${t.title}"? Todos os itens da trilha serão removidos.`}
                              className="text-xs text-[#ef4444] hover:underline"
                            >
                              Deletar
                            </ConfirmButton>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Produtos tab */}
      {activeTab === "produtos" && (
        <div className="flex flex-col gap-4">
          {products.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-[#161616] py-16 text-center">
              <p className="text-sm text-white/30">Nenhum produto cadastrado</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/5">
              <table className="w-full">
                <thead className="bg-[#161616]">
                  <tr>
                    <th className={thCls}>Nome</th>
                    <th className={thCls}>Descrição</th>
                    <th className={thCls}>Preço</th>
                    <th className={thCls}>Status</th>
                    <th className={thCls}>Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => (
                    <tr key={p.id} className="bg-[#0d0d0d] hover:bg-[#111] transition-colors">
                      <td className={cellCls}>
                        <span className="font-semibold text-white">{p.name}</span>
                      </td>
                      <td className={cellCls}>
                        <span className="text-white/50 line-clamp-1 max-w-[200px]">{p.description}</span>
                      </td>
                      <td className={cellCls}>
                        {formatBRL(p.price)}
                      </td>
                      <td className={cellCls}>
                        {p.active ? (
                          <span className="rounded-full bg-[#4ade80]/20 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-[#4ade80]">
                            Ativo
                          </span>
                        ) : (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-white/40">
                            Inativo
                          </span>
                        )}
                      </td>
                      <td className={cellCls}>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/admin/produtos/${p.id}/editar`}
                            className="text-xs text-white/50 hover:text-white transition-colors"
                          >
                            Editar
                          </Link>
                          <span className="text-white/20">·</span>
                          <form action={toggleProduct.bind(null, p.id, !p.active)}>
                            <button
                              type="submit"
                              className={`text-xs hover:underline ${p.active ? "text-[#fbbf24]" : "text-[#4ade80]"}`}
                            >
                              {p.active ? "Desativar" : "Ativar"}
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Analytics tab */}
      {activeTab === "analytics" && analytics && (
        <div className="flex flex-col gap-8">
          {/* Revenue section */}
          <div>
            <h2 className="mb-4 border-l-2 border-[#e3001b] pl-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Receita
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-white/5 bg-[#161616] p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">Receita Total</p>
                <p className="text-2xl font-black text-white">{formatBRL(analytics.revenueTotal)}</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-[#161616] p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">Último Mês</p>
                <p className="text-2xl font-black text-white">{formatBRL(analytics.revenueLastMonth)}</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-[#161616] p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">Compras</p>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#4ade80]">
                    {analytics.purchasesByStatus[PurchaseStatus.COMPLETED] ?? 0} completadas
                  </span>
                  <span className="text-sm text-[#fbbf24]">
                    {analytics.purchasesByStatus[PurchaseStatus.PENDING] ?? 0} pendentes
                  </span>
                  <span className="text-sm text-[#ef4444]">
                    {analytics.purchasesByStatus[PurchaseStatus.REFUNDED] ?? 0} reembolsadas
                  </span>
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-[#161616] p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                  Taxa de Conversão
                </p>
                <p className="text-2xl font-black text-white">
                  {analytics.totalUsers > 0
                    ? ((analytics.usersWithAccess / analytics.totalUsers) * 100).toFixed(1)
                    : "0.0"}
                  %
                </p>
              </div>
            </div>
          </div>

          {/* Users section */}
          <div>
            <h2 className="mb-4 border-l-2 border-[#e3001b] pl-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Usuários
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-white/5 bg-[#161616] p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">Total</p>
                <p className="text-2xl font-black text-white">
                  {analytics.totalUsers.toLocaleString("pt-BR")}
                </p>
                <p className="mt-1 text-xs text-white/40">+{analytics.newUsers} nos últimos 30d</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-[#161616] p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">Novos (30d)</p>
                <p className="text-2xl font-black text-white">
                  {analytics.newUsers.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </div>

          {/* Top content ranking */}
          <div>
            <h2 className="mb-4 border-l-2 border-[#e3001b] pl-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Top Conteúdos
            </h2>
            {analytics.topContent.length === 0 ? (
              <div className="rounded-xl border border-white/5 bg-[#161616] py-16 text-center">
                <p className="text-sm text-white/30">Nenhum progresso registrado ainda</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-white/5">
                <table className="w-full">
                  <thead className="bg-[#161616]">
                    <tr>
                      <th className={thCls}>#</th>
                      <th className={thCls}>Conteúdo</th>
                      <th className={thCls}>Tipo</th>
                      <th className={thCls}>Viewers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {analytics.topContent.map((item, i) => {
                      const maxViewers = analytics!.topContent[0].viewers
                      const pct = maxViewers > 0 ? (item.viewers / maxViewers) * 100 : 0
                      return (
                        <tr key={item.contentId} className="bg-[#0d0d0d] hover:bg-[#111] transition-colors">
                          <td className={cellCls}>
                            <span className="font-black text-white/40">{i + 1}</span>
                          </td>
                          <td className={cellCls}>
                            <div className="flex flex-col gap-1.5">
                              <span className="font-semibold text-white">{item.title}</span>
                              <div className="h-1.5 w-full max-w-xs rounded-full bg-white/5">
                                <div
                                  className="h-full rounded-full bg-[#e3001b]"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className={cellCls}>
                            <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-white/40">
                              {TYPE_LABELS[item.type] ?? item.type}
                            </span>
                          </td>
                          <td className={cellCls}>
                            <span className="font-semibold text-white">{item.viewers}</span>
                            <span className="ml-1 text-xs text-white/40">únicos</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Usuários tab */}
      {activeTab === "usuarios" && (
        <div className="flex flex-col gap-4">
          {users.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-[#161616] py-16 text-center">
              <p className="text-sm text-white/30">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/5">
              <table className="w-full">
                <thead className="bg-[#161616]">
                  <tr>
                    <th className={thCls}>Usuário</th>
                    <th className={thCls}>Email</th>
                    <th className={thCls}>Role</th>
                    <th className={thCls}>Cadastro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="bg-[#0d0d0d] hover:bg-[#111] transition-colors">
                      <td className={cellCls}>
                        <span className="font-semibold text-white">{user.name ?? "—"}</span>
                      </td>
                      <td className={cellCls}>{user.email}</td>
                      <td className={cellCls}>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                          user.role === UserRole.ADMIN
                            ? "bg-[#e3001b] text-white"
                            : "bg-white/5 text-white/40"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className={cellCls}>
                        {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* Criadores tab */}
      {activeTab === "criadores" && (
        <div className="flex flex-col gap-8">
          {/* Create form */}
          <div className="rounded-xl border border-white/5 bg-[#161616] p-6">
            <h2 className="mb-4 border-l-2 border-[#e3001b] pl-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Novo criador
            </h2>
            <form action={createCreator} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50">Slug *</label>
                <input name="slug" required placeholder="titiltei" className="w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50">Nome *</label>
                <input name="name" required placeholder="Titiltei" className="w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50">Campeão *</label>
                <input name="champion" required placeholder="Shaco" className="w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50">Descrição</label>
                <input name="description" placeholder="Rank 1 Shaco BR..." className="w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30" />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button type="submit" className="rounded-lg bg-[#e3001b] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015]">
                  Criar criador
                </button>
              </div>
            </form>
          </div>

          {/* Listing */}
          {creators.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-[#161616] py-16 text-center">
              <p className="text-sm text-white/30">Nenhum criador cadastrado</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/5">
              <table className="w-full">
                <thead className="bg-[#161616]">
                  <tr>
                    <th className={thCls}>Nome</th>
                    <th className={thCls}>Slug</th>
                    <th className={thCls}>Campeão</th>
                    <th className={thCls}>Produtos</th>
                    <th className={thCls}>Conteúdos</th>
                    <th className={thCls}>Status</th>
                    <th className={thCls}>Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {creators.map((c) => (
                    <tr key={c.id} className="bg-[#0d0d0d] hover:bg-[#111] transition-colors">
                      <td className={cellCls}><span className="font-semibold text-white">{c.name}</span></td>
                      <td className={cellCls}>{c.slug}</td>
                      <td className={cellCls}>{c.champion}</td>
                      <td className={cellCls}>{c._count.products}</td>
                      <td className={cellCls}>{c._count.contents}</td>
                      <td className={cellCls}>
                        {c.active ? (
                          <span className="rounded-full bg-[#4ade80]/20 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-[#4ade80]">Ativo</span>
                        ) : (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-white/40">Inativo</span>
                        )}
                      </td>
                      <td className={cellCls}>
                        <form action={toggleCreatorActive.bind(null, c.id)}>
                          <button type="submit" className={`text-xs hover:underline ${c.active ? "text-[#fbbf24]" : "text-[#4ade80]"}`}>
                            {c.active ? "Desativar" : "Ativar"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
