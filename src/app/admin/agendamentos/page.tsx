export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { BookingStatus } from "@prisma/client"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import BookingActions from "@/components/admin/BookingActions"

const STATUS_BADGE: Record<BookingStatus, { label: string; className: string }> = {
  PENDING:   { label: "Pendente",   className: "bg-[#fbbf24]/20 text-[#fbbf24]" },
  COMPLETED: { label: "Concluído",  className: "bg-[#4ade80]/20 text-[#4ade80]" },
  POSTPONED: { label: "Adiado",     className: "bg-[#60a5fa]/20 text-[#60a5fa]" },
  REFUNDED:  { label: "Estornado",  className: "bg-[#ef4444]/20 text-[#ef4444]" },
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const { label, className } = STATUS_BADGE[status]
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-black uppercase tracking-widest ${className}`}>
      {label}
    </span>
  )
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(date)
}

export default async function AgendamentosPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const bookings = await prisma.booking.findMany({
    orderBy: { scheduledAt: "desc" },
    include: {
      purchase: {
        include: { product: { select: { name: true } } },
      },
    },
  })

  return (
    <main className="min-h-screen bg-[#0d0d0d] px-4 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#e3001b] text-xs uppercase tracking-[0.3em] font-semibold mb-1">Admin</p>
            <h1 className="text-3xl font-black uppercase text-white">Agendamentos</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/pagamentos"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Pagamentos
            </Link>
            <Link
              href="/admin"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-[#161616] border border-white/5 rounded-xl p-12 text-center">
            <p className="text-white/30 text-sm">Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          <div className="bg-[#161616] border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs uppercase tracking-[0.2em] font-semibold text-white/30 px-5 py-4">Cliente</th>
                  <th className="text-left text-xs uppercase tracking-[0.2em] font-semibold text-white/30 px-5 py-4">Produto</th>
                  <th className="text-left text-xs uppercase tracking-[0.2em] font-semibold text-white/30 px-5 py-4">Data</th>
                  <th className="text-left text-xs uppercase tracking-[0.2em] font-semibold text-white/30 px-5 py-4">Status</th>
                  <th className="text-left text-xs uppercase tracking-[0.2em] font-semibold text-white/30 px-5 py-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white font-semibold">{booking.attendeeName}</p>
                      <p className="text-white/40 text-xs">{booking.attendeeEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-white/70">
                      {booking.purchase?.product?.name ?? <span className="text-white/30 italic">Sem vínculo</span>}
                    </td>
                    <td className="px-5 py-4 text-white/70 whitespace-nowrap">
                      {formatDate(booking.scheduledAt)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-5 py-4">
                      <BookingActions bookingId={booking.id} status={booking.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
