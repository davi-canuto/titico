export const dynamic = "force-dynamic"

import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PurchaseStatus, UserRole } from "@prisma/client"
import PagamentosFilter from "@/components/admin/PagamentosFilter"

const PAGE_SIZE = 20

const STATUS_BADGE: Record<PurchaseStatus, { label: string; className: string }> = {
  COMPLETED: { label: "Pago",       className: "bg-[#4ade80]/20 text-[#4ade80]" },
  PENDING:   { label: "Pendente",   className: "bg-[#fbbf24]/20 text-[#fbbf24]" },
  REFUNDED:  { label: "Reembolsado", className: "bg-[#ef4444]/20 text-[#ef4444]" },
}

function PurchaseStatusBadge({ status }: { status: PurchaseStatus }) {
  const { label, className } = STATUS_BADGE[status]
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-black uppercase tracking-widest ${className}`}>
      {label}
    </span>
  )
}

function stripeUrl(purchase: { stripePaymentId: string | null; stripeSessionId: string }): string {
  if (purchase.stripePaymentId) {
    return `https://dashboard.stripe.com/payments/${purchase.stripePaymentId}`
  }
  return `https://dashboard.stripe.com/checkout/sessions/${purchase.stripeSessionId}`
}

interface PagamentosPageProps {
  searchParams: Promise<{
    email?: string
    productId?: string
    lastId?: string
  }>
}

export default async function PagamentosPage({ searchParams }: PagamentosPageProps) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== UserRole.ADMIN) redirect("/dashboard")

  const { email, productId, lastId } = await searchParams

  const [purchases, products] = await Promise.all([
    prisma.purchase.findMany({
      where: {
        ...(email ? { user: { email: { contains: email, mode: "insensitive" } } } : {}),
        ...(productId ? { productId } : {}),
      },
      include: {
        user: { select: { email: true } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE + 1,
      ...(lastId ? { cursor: { id: lastId }, skip: 1 } : {}),
    }),
    prisma.product.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ])

  const hasMore = purchases.length > PAGE_SIZE
  const page = hasMore ? purchases.slice(0, PAGE_SIZE) : purchases
  const nextCursor = hasMore ? page[page.length - 1].id : null

  const thCls = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-white/30"
  const cellCls = "px-4 py-3 text-sm text-white/70"

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">Pagamentos</h1>
            <span className="rounded-full bg-[#e3001b] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white">
              ADMIN
            </span>
          </div>
          <Link href="/dashboard/admin" className="text-xs text-white/40 hover:text-white/70 transition-colors">
            ← Painel Admin
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <PagamentosFilter products={products} />
      </div>

      {/* Table */}
      {page.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-[#161616] py-16 text-center">
          <p className="text-sm text-white/30">Nenhum pagamento encontrado</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#161616]">
                <tr>
                  <th className={thCls}>Usuário</th>
                  <th className={thCls}>Produto</th>
                  <th className={thCls}>Status</th>
                  <th className={thCls}>Data</th>
                  <th className={thCls}>Stripe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {page.map((purchase) => (
                  <tr key={purchase.id} className="bg-[#0d0d0d] hover:bg-[#111] transition-colors">
                    <td className={cellCls}>
                      <span className="font-mono text-xs text-white/60">{purchase.user.email}</span>
                    </td>
                    <td className={cellCls}>{purchase.product.name}</td>
                    <td className={cellCls}>
                      <PurchaseStatusBadge status={purchase.status} />
                    </td>
                    <td className={cellCls}>
                      {new Date(purchase.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className={cellCls}>
                      <a
                        href={stripeUrl(purchase)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white"
                      >
                        Ver no Stripe
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" x2="21" y1="14" y2="3"/>
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {nextCursor && (
        <div className="mt-6 flex justify-end">
          <Link
            href={`/dashboard/admin/pagamentos?${new URLSearchParams({
              ...(email ? { email } : {}),
              ...(productId ? { productId } : {}),
              lastId: nextCursor,
            }).toString()}`}
            className="rounded-lg border border-white/10 px-5 py-2 text-xs font-black uppercase tracking-wider text-white/60 transition-colors hover:border-white/30 hover:text-white"
          >
            Próxima →
          </Link>
        </div>
      )}

    </main>
  )
}
