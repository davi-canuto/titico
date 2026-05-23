import { redirect } from "next/navigation"
import { auth, signIn } from "@/lib/auth"

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth()
  if (session) redirect("/dashboard")

  const { error } = await searchParams

  async function googleSignIn() {
    "use server"
    await signIn("google", { redirectTo: "/dashboard" })
  }

  async function credentialSignIn(formData: FormData) {
    "use server"
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/dashboard",
      })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ""
      if (msg.includes("NEXT_REDIRECT")) throw e
      redirect("/login?error=credentials")
    }
  }

  return (
    <main className="flex min-h-screen bg-[#0d0d0d]">
      {/* Painel esquerdo — splash Shaco Bobo da Corte */}
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

      {/* Painel direito — login */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        {/* Cabeçalho mobile */}
        <div className="lg:hidden text-center mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">Titiltei</h1>
        </div>

        <div className="w-full max-w-sm">
          {/* Texto acima do card */}
          <div className="mb-6">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#e3001b]">
              Lobby do Titiltei
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
              Acesse sua conta
            </h2>
            <p className="text-white/50 text-sm mt-2">Entre para acessar o Lobby</p>
          </div>

          {/* Error banner */}
          {error === "credentials" && (
            <div className="mb-4 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-sm text-[#ef4444]">
              Email ou senha incorretos.
            </div>
          )}

          {/* Benefícios */}
          <ul className="mb-6 space-y-2">
            {[
              "Módulos exclusivos de Shaco",
              "Todos os matchups do jungle",
              "Coaching e análises de gameplay",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e3001b] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          {/* Card de login */}
          <div className="bg-[#161616] border border-white/5 rounded-xl p-6 space-y-4">
            {/* Credencial */}
            <form action={credentialSignIn} className="space-y-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full bg-[#0d0d0d] border border-white/10 focus:border-white/30 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none transition-colors"
              />
              <input
                type="password"
                name="password"
                placeholder="Senha"
                required
                className="w-full bg-[#0d0d0d] border border-white/10 focus:border-white/30 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-[#e3001b] hover:bg-[#b50015] active:bg-[#900010] text-white font-black uppercase tracking-wider rounded-lg px-4 py-3 transition-colors"
              >
                Entrar
              </button>
            </form>

            {/* Divisor */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs uppercase tracking-widest">ou</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Google */}
            <form action={googleSignIn}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 border border-white/20 hover:border-white/40 active:bg-white/5 text-white font-semibold rounded-lg px-4 py-3 transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
                    fill="#EA4335"
                  />
                </svg>
                Entrar com Google
              </button>
            </form>
          </div>

          <p className="text-center text-white/30 text-xs mt-6">
            Ao entrar, você concorda com os termos de uso
          </p>
        </div>
      </div>
    </main>
  )
}
