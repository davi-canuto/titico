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
  const [lockedModal, setLockedModal] = useState(false)
  const [exploding, setExploding] = useState(false)

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
    setLockedModal(true)
    setExploding(false)
  }

  function handleExplode() {
    setExploding(true)
    setTimeout(() => {
      window.open(WA_URL, '_blank')
      setLockedModal(false)
      setExploding(false)
    }, 500)
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
          {lockedMatchups.map((m) => {
            const diff = difficultyConfig[m.difficulty]
            return (
              <button
                key={m.champion}
                onClick={handleLocked}
                title={`${m.displayName} — Disponível no guia completo`}
                className="group flex flex-col items-center gap-1.5 transition-transform hover:scale-105"
              >
                <div className="relative w-[62px] h-[62px] sm:w-[74px] sm:h-[74px] rounded-full overflow-hidden ring-2 ring-white/10 transition-all">
                  <img
                    src={`${DDRAGON}/img/champion/${m.champion}.png`}
                    alt={m.displayName}
                    style={{ filter: 'saturate(0.3) brightness(0.55)' }}
                    className="w-full h-full object-cover scale-110 transition-all group-hover:brightness-75"
                  />
                  <div className="absolute bottom-0 inset-x-0 h-1 opacity-40" style={{ backgroundColor: diff.color }} />
                </div>
                <span className="text-[10px] sm:text-xs text-white/30 group-hover:text-white/60 transition-colors font-medium max-w-[70px] sm:max-w-[80px] text-center leading-tight">
                  {m.displayName}
                </span>
              </button>
            )
          })}
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap justify-center gap-5 mt-8 text-xs text-white/40">
          {(['Fácil', 'Médio', 'Difícil'] as Difficulty[]).map((d) => (
            <div key={d} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: difficultyConfig[d].color }} />
              <span>{d}</span>
            </div>
          ))}
        </div>

        {/* Modal — caixinha do Shaco */}
        {lockedModal && (
          <>
            <style>{`
              @keyframes box-drop {
                0%   { opacity: 0; transform: translateY(-60px) rotate(-8deg) scale(0.7); }
                60%  { opacity: 1; transform: translateY(6px) rotate(2deg) scale(1.05); }
                80%  { transform: translateY(-3px) rotate(-1deg) scale(0.98); }
                100% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
              }
              @keyframes box-shake {
                0%,100% { transform: rotate(0deg); }
                20%  { transform: rotate(-3deg); }
                40%  { transform: rotate(3deg); }
                60%  { transform: rotate(-2deg); }
                80%  { transform: rotate(2deg); }
              }
              @keyframes box-explode {
                0%   { opacity: 1; transform: scale(1) rotate(0deg); filter: brightness(1); }
                30%  { opacity: 1; transform: scale(1.1) rotate(-4deg); filter: brightness(3) saturate(0); }
                60%  { opacity: 0.6; transform: scale(1.4) rotate(6deg); filter: brightness(5) saturate(0); }
                100% { opacity: 0; transform: scale(2) rotate(-8deg); filter: brightness(8) saturate(0); }
              }
              @keyframes overlay-flash {
                0%   { opacity: 0; }
                40%  { opacity: 0.7; }
                100% { opacity: 0; }
              }
              .box-drop    { animation: box-drop 0.4s cubic-bezier(0.22,1,0.36,1) forwards; }
              .box-shake   { animation: box-drop 0.4s cubic-bezier(0.22,1,0.36,1) forwards, box-shake 1.2s ease-in-out 0.5s infinite; }
              .box-explode { animation: box-explode 0.5s ease-in forwards; }
              .overlay-flash { animation: overlay-flash 0.5s ease-out forwards; }
            `}</style>

            {/* Flash overlay */}
            {exploding && (
              <div className="overlay-flash fixed inset-0 z-[60] bg-white pointer-events-none" />
            )}

            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
              onClick={(e) => { if (e.target === e.currentTarget && !exploding) setLockedModal(false) }}
            >
              <div className="relative">
                {/* X */}
                <button
                  onClick={() => setLockedModal(false)}
                  className="absolute -top-3 -right-3 z-10 w-7 h-7 bg-black/80 hover:bg-[#e3001b] rounded-full flex items-center justify-center text-white transition-colors text-base font-bold"
                >
                  ×
                </button>

                {/* A caixinha clicável */}
                <button
                  onClick={handleExplode}
                  className={`relative block cursor-pointer ${exploding ? 'box-explode' : 'box-shake'}`}
                  style={{ width: 200, height: 200 }}
                  disabled={exploding}
                >
                  {/* Sombra/glow roxa embaixo (cor da skill W) */}
                  <div style={{
                    position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)',
                    width: 120, height: 20, borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(160,80,255,0.6) 0%, transparent 70%)',
                    filter: 'blur(4px)',
                  }} />

                  {/* Tile quadrado do Shaco */}
                  <img
                    src="https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/Shaco.png"
                    alt="Shaco"
                    style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 16 }}
                  />

                  {/* Brilho pulsante nas bordas */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 16,
                    boxShadow: '0 0 24px 6px rgba(160,80,255,0.5), inset 0 0 12px rgba(160,80,255,0.2)',
                  }} />

                  {/* Texto abaixo */}
                  <div style={{ position: 'absolute', bottom: -48, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', textAlign: 'center' }}>
                    <p style={{ color: 'white', fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Clique para desbloquear
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </>
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
