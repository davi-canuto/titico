import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import * as userService from '@/services/user.service'
import { prisma } from '@/lib/prisma'
import ContentCard from '@/components/platform/ContentCard'
import RefundButton from '@/components/platform/RefundButton'

export const dynamic = "force-dynamic"
export default async function PerfilPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const [user, { hasAccess }, bookmarks] = await Promise.all([
    userService.getUserProfile(session.user.id),
    userService.getUserAccessStatus(session.user.id),
    prisma.bookmark.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: { content: { include: { video: true } } },
    }),
  ])
  const initial = user?.name?.[0]?.toUpperCase() ?? '?'

  async function logoutAction() {
    'use server'
    await signOut({ redirectTo: '/' })
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">

        {/* Back */}
        <Link href="/lobby" className="self-start text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Dashboard
        </Link>

        {/* Identity */}
        <section className="flex items-center gap-5">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name ?? 'avatar'}
              width={80}
              height={80}
              className="rounded-full object-cover ring-2 ring-white/10"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#161616] text-2xl font-black text-white">
              {initial}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black uppercase tracking-tight text-white">
                {user?.name ?? 'Usuário'}
              </h1>
              {user?.role === UserRole.ADMIN && (
                <span className="rounded-full bg-[#e3001b] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white">
                  Admin
                </span>
              )}
            </div>
            <p className="text-sm text-white/40">{user?.email}</p>
          </div>
        </section>

        {/* Access status */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs uppercase tracking-[0.2em] text-white/30 font-semibold">Status de acesso</h2>
          <div className="bg-[#111111] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
            {hasAccess ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 rounded-full border border-[#4ade80]/20 bg-[#4ade80]/10 px-3 py-1 text-xs font-semibold text-[#4ade80]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
                    Acesso ativo
                  </span>
                  <span className="text-xs text-white/25 uppercase tracking-widest">Pagamento único</span>
                </div>

                {user?.purchases[0] && (
                  <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/30 uppercase tracking-widest">Plano</span>
                      <span className="text-sm font-semibold text-white">{user.purchases[0].product.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/30 uppercase tracking-widest">Adquirido em</span>
                      <span className="text-sm text-white/70">
                        {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(user.purchases[0].createdAt))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/30 uppercase tracking-widest">Tipo</span>
                      <span className="text-xs text-white/50">Pagamento único — sem renovação automática</span>
                    </div>
                  </div>
                )}

                {user?.purchases[0] && (() => {
                  const REFUND_DAYS = 7
                  const purchasedAt = new Date(user.purchases[0].createdAt)
                  const deadlineAt = new Date(purchasedAt.getTime() + REFUND_DAYS * 24 * 60 * 60 * 1000)
                  const now = new Date()
                  const daysLeft = Math.ceil((deadlineAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                  const withinWindow = daysLeft > 0

                  return (
                    <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
                      <p className="text-xs text-white/30">
                        Não é uma assinatura recorrente — seu acesso não expira.
                        Reembolso disponível em até 7 dias após a compra.
                      </p>
                      {withinWindow ? (
                        <RefundButton purchaseId={user.purchases[0].id} daysLeft={daysLeft} />
                      ) : (
                        <span className="self-start inline-flex items-center gap-2 rounded-lg border border-white/5 bg-white/3 px-4 py-2 text-xs text-white/20 cursor-not-allowed">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" />
                          </svg>
                          Prazo de reembolso encerrado (7 dias)
                        </span>
                      )}
                    </div>
                  )
                })()}
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/40">
                    Sem acesso ao Lobby
                  </span>
                </div>
                <p className="text-sm text-white/40 leading-relaxed">
                  Você ainda não tem acesso ao conteúdo completo. Adquira um plano para entrar no Lobby.
                </p>
                <Link
                  href="/#pricing"
                  className="self-start rounded-lg bg-[#e3001b] px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015]"
                >
                  Entrar no Lobby
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Salvos */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs uppercase tracking-[0.2em] text-white/30 font-semibold">Salvos</h2>
          {bookmarks.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {bookmarks.map((b) => (
                <ContentCard key={b.id} content={b.content} locked={!hasAccess} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/5 bg-[#111111] p-8 text-center">
              <p className="text-sm text-white/30">Nenhum conteúdo salvo ainda.</p>
            </div>
          )}
        </section>

        {/* Logout */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs uppercase tracking-[0.2em] text-white/30 font-semibold">Conta</h2>
          <div className="bg-[#111111] border border-white/5 rounded-xl p-5">
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/50 transition-colors hover:border-white/30 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sair da conta
              </button>
            </form>
          </div>
        </section>

      </div>
    </main>
  )
}
