'use client'

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { SHACO_SKINS, splashUrl } from '@/lib/shaco-skins'
import { updateHeroSkin as updateSkin } from '@/lib/actions/skin'

interface SkinPickerProps {
  currentSkin: string
}

export default function SkinPicker({ currentSkin }: SkinPickerProps) {
  const [open, setOpen] = useState(false)
  const [activeSkin, setActiveSkin] = useState(currentSkin)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  async function handleSelect(num: string) {
    setActiveSkin(num)
    setOpen(false)
    updateSkin(num)
      .then(() => queryClient.invalidateQueries({ queryKey: ["user-skin"] }))
      .catch(console.error)
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-xs text-white/70 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white md:bottom-8 md:right-8"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r="1.5" /><circle cx="17.5" cy="10.5" r="1.5" /><circle cx="8.5" cy="7.5" r="1.5" /><circle cx="6.5" cy="12.5" r="1.5" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
        Mudar skin
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[65vh] overflow-y-auto rounded-t-2xl border-t border-white/10 bg-[#0d0d0d]/96 backdrop-blur-md transition-transform duration-300 ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h2 className="text-sm font-black uppercase tracking-tight text-white">Escolha a skin</h2>
            <p className="text-xs text-white/30 mt-0.5">{SHACO_SKINS.length} skins disponíveis</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-white/30 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3 p-5 sm:grid-cols-4 md:grid-cols-5">
          {SHACO_SKINS.map((skin) => {
            const isActive = activeSkin === skin.num
            return (
              <button
                key={skin.num}
                onClick={() => handleSelect(skin.num)}
                className="group flex flex-col gap-1.5 text-left"
              >
                <div className={`relative overflow-hidden rounded-lg aspect-video transition-all duration-200 ${
                  isActive
                    ? 'ring-2 ring-[#e3001b] ring-offset-2 ring-offset-[#0d0d0d]'
                    : 'ring-1 ring-white/5 hover:ring-white/20'
                }`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={splashUrl(skin.num)}
                    alt={skin.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-[#e3001b]/10 flex items-center justify-center">
                      <div className="rounded-full bg-[#e3001b] p-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <span className={`text-[10px] leading-tight truncate transition-colors ${
                  isActive ? 'text-white font-semibold' : 'text-white/40 group-hover:text-white/70'
                }`}>
                  {skin.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
