import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateProduct } from "@/lib/admin-actions"

const inputCls =
  "w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50"

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}

export default async function EditarProdutoPage({ params, searchParams }: PageProps) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { id } = await params
  const { error } = await searchParams

  const [product, creators] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.creator.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ])
  if (!product) redirect("/admin?tab=produtos")

  const priceInReais = (product.price / 100).toFixed(2)
  const featuresText = (product.features ?? []).join("\n")

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-white/40">
        <Link href="/admin" className="hover:text-white/70 transition-colors">Admin</Link>
        <span>/</span>
        <Link href="/admin?tab=produtos" className="hover:text-white/70 transition-colors">Produtos</Link>
        <span>/</span>
        <span className="text-white/70">{product.name}</span>
        <span>/</span>
        <span className="text-white/70">Editar</span>
      </div>

      <h1 className="mb-8 border-l-2 border-[#e3001b] pl-3 text-2xl font-black uppercase tracking-tight text-white">
        Editar produto
      </h1>

      {error === "preco" && (
        <div className="mb-6 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-sm text-[#ef4444]">
          Preço inválido — informe um valor numérico positivo (ex: 47.00).
        </div>
      )}

      {error === "nome" && (
        <div className="mb-6 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-sm text-[#ef4444]">
          Nome não pode ser vazio.
        </div>
      )}

      {error === "slug" && (
        <div className="mb-6 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-sm text-[#ef4444]">
          Slug inválido ou já em uso por outro produto.
        </div>
      )}

      <form action={updateProduct.bind(null, product.id)} className="flex flex-col gap-5">
        <div>
          <label className={labelCls} htmlFor="name">Nome</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={product.name}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="slug">Slug *</label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            defaultValue={product.slug}
            className={inputCls}
          />
          <p className="mt-1 text-xs text-white/30">Identificador único usado internamente (ex: guia-shaco-ad)</p>
        </div>

        <div>
          <label className={labelCls} htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={product.description}
            className={`${inputCls} resize-none`}
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="features">
            Itens do plano
            <span className="ml-2 normal-case font-normal text-white/30">(um por linha)</span>
          </label>
          <textarea
            id="features"
            name="features"
            rows={8}
            defaultValue={featuresText}
            placeholder={"Acesso vitalício\nTodos os matchups\nBuilds completas"}
            className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="price">Preço (R$)</label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={priceInReais}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="creatorId">Criador</label>
          <select id="creatorId" name="creatorId" defaultValue={product.creatorId ?? ""} className={inputCls}>
            {creators.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.champion})</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#161616] p-5 flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Agendamento (Cal.com)</p>
          <div>
            <label className={labelCls} htmlFor="calSlug">Cal.com Slug</label>
            <input
              id="calSlug"
              name="calSlug"
              type="text"
              defaultValue={product.calSlug ?? ""}
              placeholder="seu-usuario/nome-do-evento"
              className={inputCls}
            />
            <p className="mt-1 text-xs text-white/30">Ex: davi-alessandro-fsfg2x/coach-1-1</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#161616] p-5 flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Entrega digital (PDF)</p>
          <div>
            <label className={labelCls} htmlFor="downloadUrl">URL de download</label>
            <input
              id="downloadUrl"
              name="downloadUrl"
              type="url"
              defaultValue={product.downloadUrl ?? ""}
              placeholder="https://..."
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="downloadPassword">Senha do arquivo</label>
            <input
              id="downloadPassword"
              name="downloadPassword"
              type="text"
              defaultValue={product.downloadPassword ?? ""}
              placeholder="senha123"
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-[#e3001b] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-[#b50015] active:bg-[#900010]"
          >
            Salvar
          </button>
          <Link
            href="/admin?tab=produtos"
            className="rounded-lg border border-white/25 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-colors hover:border-white active:bg-white/10"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  )
}
