'use client'

import { useState } from 'react'
import { matchups, lockedMatchups } from '@/data/matchups'
import { Difficulty, Matchup } from '@/lib/types'
import MatchupPanel from './MatchupPanel'

const DDRAGON = 'https://ddragon.leagueoflegends.com/cdn/15.5.1'

const WA_URL = 'https://api.whatsapp.com/send/?phone=5512982700714&text=Ol%C3%A1%2C+tudo+bem+%3F%21+Vim+do+site+e+gostaria+de+fazer+um+or%C3%A7amento+%21&type=phone_number&app_absent=0'

const difficultyConfig: Record<Difficulty, { color: string; ring: string }> = {
  'Fácil':   { color: '#4ade80', ring: 'ring-green-400' },
  'Médio':   { color: '#fbbf24', ring: 'ring-yellow-400' },
  'Difícil': { color: '#ef4444', ring: 'ring-red-500' },
}

export default function MatchupGrid() {
  const [selected, setSelected] = useState<Matchup | null>(null)
  const [lockedAlert, setLockedAlert] = useState(false)

  function handleSelect(m: Matchup) {
    if (selected?.champion === m.champion) {
      setSelected(null)
    } else {
      setSelected(m)
      setTimeout(() => {
        document.getElementById('matchup-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 100)
    }
  }

  function handleLocked() {
    setLockedAlert(true)
    setTimeout(() => setLockedAlert(false), 3000)
  }

  return (
    <section id="matchups" className="py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-[#e3001b] text-xs uppercase tracking-[0.3em] font-semibold mb-2">Guia do Shaco AD</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase">MATCHUPS</h2>
          <div className="w-16 h-1 bg-[#e3001b] mx-auto mt-4" />
          <p className="text-white/50 mt-4 text-sm">
            Clique em um campeão para ver a análise completa do matchup
          </p>
        </div>

        {/* Champion grid */}
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">

          {/* Desbloqueados */}
          {matchups.map((m) => {
            const diff = difficultyConfig[m.difficulty]
            const isActive = selected?.champion === m.champion
            return (
              <button
                key={m.champion}
                onClick={() => handleSelect(m)}
                title={m.displayName}
                className={`group flex flex-col items-center gap-1.5 transition-transform hover:scale-110 ${isActive ? 'scale-110' : ''}`}
              >
                <div className={`relative w-[62px] h-[62px] sm:w-[74px] sm:h-[74px] rounded-full overflow-hidden ring-2 transition-all ${
                  isActive ? diff.ring + ' ring-offset-2 ring-offset-[#0d0d0d]' : 'ring-transparent group-hover:' + diff.ring
                }`}>
                  <img
                    src={`${DDRAGON}/img/champion/${m.champion}.png`}
                    alt={m.displayName}
                    className="w-full h-full object-cover scale-110"
                  />
                  <div className="absolute bottom-0 inset-x-0 h-1" style={{ backgroundColor: diff.color }} />
                </div>
                <span className="text-[10px] sm:text-xs text-white/60 group-hover:text-white transition-colors font-medium max-w-[70px] sm:max-w-[80px] text-center leading-tight">
                  {m.displayName}
                </span>
              </button>
            )
          })}

          {/* Bloqueados */}
          {lockedMatchups.map((m) => (
            <button
              key={m.champion}
              onClick={handleLocked}
              title={`${m.displayName} — Disponível no guia completo`}
              className="group flex flex-col items-center gap-1.5 transition-transform hover:scale-105"
            >
              <div className="relative w-[62px] h-[62px] sm:w-[74px] sm:h-[74px] rounded-full overflow-hidden ring-2 ring-white/10">
                <img
                  src={`${DDRAGON}/img/champion/${m.champion}.png`}
                  alt={m.displayName}
                  className="w-full h-full object-cover scale-110 grayscale opacity-35"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <LockIcon />
                </div>
              </div>
              <span className="text-[10px] sm:text-xs text-white/25 font-medium max-w-[70px] sm:max-w-[80px] text-center leading-tight">
                {m.displayName}
              </span>
            </button>
          ))}
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap justify-center gap-5 mt-8 text-xs text-white/40">
          {(['Fácil', 'Médio', 'Difícil'] as Difficulty[]).map((d) => (
            <div key={d} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: difficultyConfig[d].color }} />
              <span>{d}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <LockIcon small />
            <span>Somente no guia completo</span>
          </div>
        </div>

        {/* Alert bloqueado */}
        {lockedAlert && (
          <div className="mt-6 mx-auto max-w-sm bg-[#1a1a1a] border border-[#e3001b]/40 rounded-xl p-4 text-center animate-in fade-in slide-in-from-bottom-2">
            <p className="text-white font-bold text-sm mb-1">🔒 Matchup Bloqueada</p>
            <p className="text-white/50 text-xs mb-3">Esta matchup está disponível apenas no guia completo.</p>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#e3001b] hover:bg-[#b50015] text-white font-black uppercase tracking-wider text-xs px-5 py-2.5 rounded-lg transition-colors"
            >
              Comprar Guia Completo
            </a>
          </div>
        )}

        {/* Panel */}
        {selected && (
          <div id="matchup-panel">
            <MatchupPanel matchup={selected} onClose={() => setSelected(null)} />
          </div>
        )}

        {/* Ver mais */}
        <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/5 pt-10">
          <p className="text-white/40 text-xs sm:text-sm uppercase tracking-wider text-center">
            Estas são apenas algumas matchups da amostra grátis
          </p>
          <p className="text-white font-bold text-base sm:text-lg text-center max-w-xl">
            O GUIA COMPLETO TEM TODAS AS INFORMAÇÕES E DETALHES DE CADA{' '}
            <span className="text-[#e3001b]">MATCHUP DA JUNGLE</span>{' '}
            INCLUINDO BUILD E RUNA
          </p>
          <a
            href="#guia"
            className="inline-flex items-center gap-2 bg-[#e3001b] hover:bg-[#b50015] text-white font-black uppercase tracking-wider text-sm px-7 py-4 rounded-xl transition-colors shadow-lg shadow-red-900/30"
          >
            Ver Guia Completo
          </a>
        </div>
      </div>
    </section>
  )
}

function LockIcon({ small }: { small?: boolean }) {
  const size = small ? 10 : 14
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white" opacity="0.6">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
    </svg>
  )
}
