'use client'

import { useState } from 'react'
import { matchups } from '@/data/matchups'
import { Difficulty, Matchup } from '@/lib/types'
import MatchupPanel from './MatchupPanel'

const DDRAGON = 'https://ddragon.leagueoflegends.com/cdn/15.5.1'

const difficultyConfig: Record<Difficulty, { color: string; ring: string }> = {
  'Fácil':   { color: '#4ade80', ring: 'ring-green-400' },
  'Médio':   { color: '#fbbf24', ring: 'ring-yellow-400' },
  'Difícil': { color: '#ef4444', ring: 'ring-red-500' },
}

export default function MatchupGrid() {
  const [selected, setSelected] = useState<Matchup | null>(null)

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

  return (
    <section id="matchups" className="py-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-[#e3001b] text-sm uppercase tracking-[0.3em] font-semibold mb-2">Guia do Shaco AD</p>
          <h2 className="text-5xl md:text-6xl font-black uppercase">MATCHUPS</h2>
          <div className="w-16 h-1 bg-[#e3001b] mx-auto mt-4" />
          <p className="text-white/50 mt-4 text-sm">
            Clique em um campeão para ver a análise completa do matchup
          </p>
        </div>

        {/* Champion grid */}
        <div className="flex flex-wrap gap-4 justify-center">
          {matchups.map((m) => {
            const diff = difficultyConfig[m.difficulty]
            const isActive = selected?.champion === m.champion

            return (
              <button
                key={m.champion}
                onClick={() => handleSelect(m)}
                title={m.displayName}
                className={`group relative flex flex-col items-center gap-2 transition-transform hover:scale-110 ${
                  isActive ? 'scale-110' : ''
                }`}
              >
                <div
                  className={`relative w-[74px] h-[74px] rounded-full overflow-hidden ring-2 transition-all ${
                    isActive ? diff.ring + ' ring-offset-2 ring-offset-[#0d0d0d]' : 'ring-transparent group-hover:' + diff.ring
                  }`}
                >
                  <img
                    src={`${DDRAGON}/img/champion/${m.champion}.png`}
                    alt={m.displayName}
                    className="w-full h-full object-cover scale-110"
                  />
                  <div
                    className="absolute bottom-0 inset-x-0 h-1"
                    style={{ backgroundColor: diff.color }}
                  />
                </div>
                <span className="text-xs text-white/60 group-hover:text-white transition-colors font-medium max-w-[80px] text-center leading-tight">
                  {m.displayName}
                </span>
              </button>
            )
          })}
        </div>

        {/* Difficulty legend */}
        <div className="flex justify-center gap-6 mt-8 text-xs text-white/40">
          {(['Fácil', 'Médio', 'Difícil'] as Difficulty[]).map((d) => (
            <div key={d} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: difficultyConfig[d].color }} />
              <span>{d}</span>
            </div>
          ))}
        </div>

        {/* Panel */}
        {selected && (
          <div id="matchup-panel">
            <MatchupPanel matchup={selected} onClose={() => setSelected(null)} />
          </div>
        )}

        {/* Ver mais — CTA guia completo */}
        <div className="mt-16 flex flex-col items-center gap-4 border-t border-white/5 pt-12">
          <p className="text-white/40 text-sm uppercase tracking-wider">
            Estas são apenas algumas matchups da amostra grátis
          </p>
          <p className="text-white font-bold text-lg text-center">
            O guia completo tem <span className="text-[#e3001b]">todos os matchups</span>, builds e runas
          </p>
          <a
            href="#guia"
            className="inline-flex items-center gap-3 bg-[#e3001b] hover:bg-[#b50015] text-white font-black uppercase tracking-wider text-base px-8 py-4 rounded-xl transition-colors shadow-lg shadow-red-900/30"
          >
            Ver Guia Completo
          </a>
        </div>
      </div>
    </section>
  )
}
