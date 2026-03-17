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

const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=5512982700714&text=Ol%C3%A1%2C+tudo+bem+%3F%21+Vim+do+site+e+gostaria+de+fazer+um+or%C3%A7amento+%21&type=phone_number&app_absent=0'

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
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#e3001b] hover:bg-[#b50015] text-white font-black uppercase tracking-wider text-base px-8 py-4 rounded-xl transition-colors shadow-lg shadow-red-900/30"
          >
            <WhatsAppIcon />
            Ver Guia Completo
          </a>
        </div>
      </div>
    </section>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
