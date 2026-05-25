'use client'

import { useState } from 'react'
import Link from 'next/link'

const navLinks = [
  { label: 'Matchups', href: '#matchups' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Produtos', href: '#pricing' },
]

interface Props {
  isAuthenticated: boolean
}

export default function LandingHeader({ isAuthenticated }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/90 backdrop-blur border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" className="flex-1 text-2xl font-black tracking-widest text-white uppercase">
          TITIL<span className="text-[#e3001b]">TEI</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold uppercase tracking-wider text-white/70 hover:text-[#e3001b] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex flex-1 items-center justify-end gap-4">
          <SocialLinks />
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="bg-[#e3001b] hover:bg-[#b50015] active:bg-[#900010] text-white font-black uppercase tracking-wider text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Entrar no Lobby
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-[#e3001b] hover:bg-[#b50015] active:bg-[#900010] text-white font-black uppercase tracking-wider text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <div className="w-6 h-0.5 bg-white mb-1.5" />
          <div className="w-6 h-0.5 bg-white mb-1.5" />
          <div className="w-6 h-0.5 bg-white" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#111] border-t border-white/5 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-semibold uppercase tracking-wider text-white/70"
            >
              {l.label}
            </a>
          ))}
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="bg-[#e3001b] text-white text-sm font-black uppercase tracking-wider px-4 py-2 rounded-lg text-center"
            >
              Entrar no Lobby
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="bg-[#e3001b] text-white text-sm font-black uppercase tracking-wider px-4 py-2 rounded-lg text-center"
            >
              Entrar
            </Link>
          )}
          <div className="flex gap-3">
            <SocialLinks />
          </div>
        </div>
      )}
    </header>
  )
}

function SocialLinks() {
  return (
    <>
      <a href="https://instagram.com/titiltei" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#e3001b] transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </a>
      <a href="https://youtube.com/@titiltei" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#e3001b] transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </a>
      <a href="https://tiktok.com/@titiltei" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#e3001b] transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      </a>
      <a href="https://www.twitch.tv/titiltei" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#9146ff] transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
        </svg>
      </a>
      <a href="https://kick.com/titiltei" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#53fc18] transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 2h4v6l4-6h5l-5 7 5 7h-5l-4-6v6H2zm13 0h4v20h-4z" />
        </svg>
      </a>
    </>
  )
}
