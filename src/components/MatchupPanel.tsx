'use client'

import { Matchup, Difficulty } from '@/lib/types'

const DDRAGON = 'https://ddragon.leagueoflegends.com/cdn/15.5.1'

const difficultyConfig: Record<Difficulty, { label: string; color: string }> = {
  'Fácil':   { label: 'FÁCIL',   color: '#4ade80' },
  'Médio':   { label: 'MÉDIO',   color: '#fbbf24' },
  'Difícil': { label: 'DIFÍCIL', color: '#ef4444' },
}

interface Props {
  matchup: Matchup
  onClose: () => void
}

export default function MatchupPanel({ matchup, onClose }: Props) {
  const diff = difficultyConfig[matchup.difficulty]

  return (
    <div className="mt-6 bg-[#111] border border-white/10 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Header */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={`${DDRAGON}/img/champion/splash/${matchup.champion}_0.jpg`}
          alt={matchup.displayName}
          className="w-full h-full object-cover object-top opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
        <div className="absolute inset-0 p-6 flex items-end justify-between">
          <div>
            <h3 className="text-4xl md:text-5xl font-black uppercase italic text-[#e3001b]">
              {matchup.displayName}
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Matchup: Shaco vs {matchup.displayName}{' '}
              <span className="font-bold" style={{ color: diff.color }}>
                (Nível {diff.label})
              </span>
            </p>
          </div>
          {matchup.itemSugestao && (
            <div className="flex flex-col items-center gap-1">
              <span className="text-white/40 text-xs uppercase tracking-wider">Sugestão</span>
              <img
                src={`${DDRAGON}/img/item/${matchup.itemSugestao.id}.png`}
                alt={matchup.itemSugestao.name}
                className="w-14 h-14 rounded-lg border border-white/20"
              />
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-black/60 hover:bg-[#e3001b] rounded-full flex items-center justify-center text-white transition-colors text-lg font-bold"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-6 grid md:grid-cols-3 gap-6">
        <InfoSection title="Estratégia" items={matchup.estrategia} />
        <InfoSection title="Dicas" items={matchup.dicas} />
        {matchup.detalhes && <InfoSection title="Detalhes" items={matchup.detalhes} />}
      </div>
    </div>
  )
}

function InfoSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-[#e3001b] font-black uppercase tracking-wider text-sm mb-3 border-l-2 border-[#e3001b] pl-3">
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-white/70 text-sm leading-relaxed">
            <span className="text-[#e3001b] mt-1 shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
