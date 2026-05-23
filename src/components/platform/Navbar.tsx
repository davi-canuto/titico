"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { UserRole } from "@prisma/client"

interface NavbarProps {
  userName?: string | null
  userImage?: string | null
  userRole?: UserRole | null
}

const navLinks = [
  { href: "/dashboard", label: "Início" },
  { href: "/dashboard/explorar", label: "Explorar" },
  { href: "/dashboard/comunidade", label: "Comunidade" },
]

export default function Navbar({ userName, userImage, userRole }: NavbarProps) {
  const pathname = usePathname()
  const initial = userName?.[0]?.toUpperCase() ?? "?"
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [menuOpen])

  return (
    <nav className="sticky top-0 z-50 flex h-14 items-center justify-between gap-4 border-b border-white/5 bg-[#0d0d0d]/95 px-4 backdrop-blur-sm md:px-8">

      {/* Logo */}
      <Link href="/dashboard" className="shrink-0 text-lg font-black uppercase tracking-tight text-white">
        Titiltei
      </Link>

      {/* Nav links */}
      <div className="hidden items-center gap-1 md:flex">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1 text-sm font-semibold transition-colors ${
                isActive
                  ? "rounded-full border border-white/20 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Search link */}
        <Link href="/dashboard/buscar" className="hidden items-center gap-2 rounded-full border border-white/10 bg-[#161616] px-3 py-1.5 transition-colors hover:border-white/20 md:flex">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <span className="text-xs text-white/40">Buscar...</span>
        </Link>

        {/* Admin badge */}
        {userRole === UserRole.ADMIN && (
          <Link
            href="/dashboard/admin"
            className="hidden items-center gap-1.5 rounded-full bg-[#e3001b] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-[#b50015] md:flex"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            Admin
          </Link>
        )}

        {/* Avatar + dropdown */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-full p-0.5 ring-2 ring-transparent transition-all hover:ring-white/20 focus:outline-none"
          >
            {userImage ? (
              <Image
                src={userImage}
                alt={userName ?? "avatar"}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#161616] text-sm font-black text-white">
                {initial}
              </div>
            )}
            {/* Chevron */}
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className={`hidden text-white/40 transition-transform duration-200 md:block ${menuOpen ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#161616] shadow-xl shadow-black/40">

              {/* User info header */}
              <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
                {userImage ? (
                  <Image src={userImage} alt={userName ?? ""} width={36} height={36} className="rounded-full object-cover shrink-0" />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0d0d0d] text-sm font-black text-white">
                    {initial}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white truncate">{userName ?? "Usuário"}</span>
                  {userRole === UserRole.ADMIN && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#e3001b]">Admin</span>
                  )}
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <Link
                  href="/dashboard/perfil"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  Meu perfil
                </Link>

                <Link
                  href="/planos"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
                  </svg>
                  Planos
                </Link>

                {userRole === UserRole.ADMIN && (
                  <Link
                    href="/dashboard/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                    </svg>
                    Painel admin
                  </Link>
                )}
              </div>

              {/* Logout */}
              <div className="border-t border-white/5 py-1">
                <button
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }) }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/40 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
                  </svg>
                  Sair da conta
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </nav>
  )
}
