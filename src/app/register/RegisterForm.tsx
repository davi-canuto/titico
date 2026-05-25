"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const nameError = name.length > 0 && name.trim().length === 0 ? "Nome inválido" : null
  const emailError = email.length > 0 && !EMAIL_REGEX.test(email) ? "Email inválido" : null
  const passwordError = password.length > 0 && password.length < 8 ? "Mínimo 8 caracteres" : null
  const confirmError = confirm.length > 0 && confirm !== password ? "Senhas não coincidem" : null

  const isValid =
    name.trim().length > 0 &&
    EMAIL_REGEX.test(email) &&
    password.length >= 8 &&
    confirm === password

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return

    setLoading(true)
    setServerError(null)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email, password }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        if (res.status === 409) {
          setServerError("Email já em uso")
        } else {
          setServerError(data.error ?? "Erro ao criar conta")
        }
        return
      }

      const result = await signIn("credentials", { email, password, redirect: false })
      if (result?.error) {
        setServerError("Conta criada, mas não foi possível entrar automaticamente. Tente fazer login.")
        return
      }

      router.push("/dashboard")
    } catch {
      setServerError("Erro de rede. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen bg-[#0d0d0d]">
      {/* Painel esquerdo */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_71.jpg"
          alt="Shaco Pandemônio de Prestígio"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0d0d]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/40 to-transparent" />
        <div className="absolute bottom-12 left-10 right-10">
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#e3001b] mb-3">
            Acesse o
          </p>
          <h1 className="text-6xl font-black uppercase tracking-tight text-white leading-none mb-2">
            Lobby
          </h1>
          <h1 className="text-4xl font-black uppercase tracking-tight text-[#e3001b] leading-none">
            do Titiltei
          </h1>
        </div>
      </div>

      {/* Painel direito */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="lg:hidden text-center mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">Titiltei</h1>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#e3001b]">
              Lobby do Titiltei
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
              Criar conta
            </h2>
            <p className="text-white/50 text-sm mt-2">Junte-se ao Lobby e suba de elo</p>
          </div>

          {serverError && (
            <div className="mb-4 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-sm text-[#ef4444]">
              {serverError}
            </div>
          )}

          <div className="bg-[#161616] border border-white/5 rounded-xl p-6">
            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#0d0d0d] border border-white/10 focus:border-white/30 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none transition-colors"
                />
                {nameError && (
                  <p className="mt-1 text-xs text-[#ef4444]">{nameError}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0d0d0d] border border-white/10 focus:border-white/30 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none transition-colors"
                />
                {emailError && (
                  <p className="mt-1 text-xs text-[#ef4444]">{emailError}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0d0d0d] border border-white/10 focus:border-white/30 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none transition-colors"
                />
                {passwordError && (
                  <p className="mt-1 text-xs text-[#ef4444]">{passwordError}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Confirmar senha"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="w-full bg-[#0d0d0d] border border-white/10 focus:border-white/30 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none transition-colors"
                />
                {confirmError && (
                  <p className="mt-1 text-xs text-[#ef4444]">{confirmError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValid || loading}
                className="w-full bg-[#e3001b] hover:bg-[#b50015] active:bg-[#900010] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black uppercase tracking-wider rounded-lg px-4 py-3 transition-colors mt-1"
              >
                {loading ? "Criando conta..." : "Criar conta"}
              </button>
            </form>
          </div>

          <p className="text-center text-white/40 text-sm mt-6">
            Já tenho conta{" "}
            <Link href="/login" className="text-white hover:text-[#e3001b] transition-colors font-semibold">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
