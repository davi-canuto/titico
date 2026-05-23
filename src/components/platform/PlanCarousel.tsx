'use client'

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react'
import PlanCard from './PlanCard'

interface Product {
  id: string
  name: string
  description: string | null
  features: string[]
  creator?: { slug: string; name: string; champion: string } | null
  price: { amount: number; currency: string; formatted: string }
}

const VISIBLE = 4
const GAP = 20
const AUTO_MS = 3500

export default function PlanCarousel({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cardW, setCardW] = useState(0)
  const [index, setIndex] = useState(products.length) // start in middle set
  const [animated, setAnimated] = useState(false)
  const [paused, setPaused] = useState(false)
  const dragRef = useRef({ active: false, startX: 0, startIndex: 0 })

  // Triple items for seamless infinite loop
  const items = [...products, ...products, ...products]
  const popularIndex = Math.floor(products.length / 2)

  function measure() {
    if (!containerRef.current) return
    const w = containerRef.current.clientWidth
    setCardW((w - GAP * (VISIBLE - 1)) / VISIBLE)
  }

  useLayoutEffect(() => { measure() }, [])
  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const trackX = cardW > 0 ? -(index * (cardW + GAP)) : 0

  // After transition ends, silently jump to middle set
  function onTransitionEnd() {
    if (index < products.length) {
      setAnimated(false)
      setIndex(i => i + products.length)
    } else if (index >= products.length * 2) {
      setAnimated(false)
      setIndex(i => i - products.length)
    }
  }

  // Re-enable animation after silent jump
  useEffect(() => {
    if (!animated) {
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)))
      return () => cancelAnimationFrame(id)
    }
  }, [animated])

  const goNext = useCallback(() => {
    setAnimated(true)
    setIndex(i => i + 1)
  }, [])

  const goPrev = useCallback(() => {
    setAnimated(true)
    setIndex(i => i - 1)
  }, [])

  // Auto-play
  useEffect(() => {
    if (paused) return
    const id = setInterval(goNext, AUTO_MS)
    return () => clearInterval(id)
  }, [paused, goNext])

  // Drag
  function onMouseDown(e: React.MouseEvent) {
    dragRef.current = { active: true, startX: e.pageX, startIndex: index }
    setPaused(true)
    setAnimated(false)
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!dragRef.current.active || !containerRef.current) return
    const dx = e.pageX - dragRef.current.startX
    const threshold = (cardW + GAP) * 0.25
    if (Math.abs(dx) > threshold) {
      const delta = dx > 0 ? -1 : 1
      const newIndex = dragRef.current.startIndex + delta
      dragRef.current = { ...dragRef.current, startIndex: newIndex, startX: e.pageX }
      setAnimated(true)
      setIndex(newIndex)
    }
  }

  function onMouseUp() {
    dragRef.current.active = false
    setPaused(false)
  }

  // Touch
  const touchRef = useRef({ startX: 0 })

  function onTouchStart(e: React.TouchEvent) {
    touchRef.current.startX = e.touches[0].pageX
    setPaused(true)
  }

  function onTouchEnd(e: React.TouchEvent) {
    const dx = e.changedTouches[0].pageX - touchRef.current.startX
    if (Math.abs(dx) > 40) { dx < 0 ? goNext() : goPrev() }
    setPaused(false)
  }

  const realActive = ((index % products.length) + products.length) % products.length

  if (cardW === 0) return <div ref={containerRef} className="h-64" />

  return (
    <div
      className="flex flex-col gap-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { onMouseUp(); setPaused(false) }}
    >
      {/* Track */}
      <div
        ref={containerRef}
        className="overflow-hidden"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ cursor: dragRef.current.active ? 'grabbing' : 'grab' }}
      >
        <div
          className="flex items-stretch"
          style={{
            gap: GAP,
            transform: `translateX(${trackX}px)`,
            transition: animated ? 'transform 500ms cubic-bezier(0.25,0.1,0.25,1)' : 'none',
            willChange: 'transform',
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {items.map((product, i) => (
            <div key={`${product.id}-${i}`} style={{ flexShrink: 0, width: cardW }} className="flex flex-col">
              <PlanCard
                product={product}
                isPopular={(i % products.length) === popularIndex}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={goPrev}
          aria-label="Anterior"
          className="text-white/15 hover:text-white/40 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="flex items-center gap-1.5">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => { setAnimated(true); setIndex(products.length + i) }}
              aria-label={`Plano ${i + 1}`}
            >
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: realActive === i ? 16 : 5,
                  height: 5,
                  backgroundColor: realActive === i ? '#e3001b' : 'rgba(255,255,255,0.12)',
                }}
              />
            </button>
          ))}
        </div>

        <button
          onClick={goNext}
          aria-label="Próximo"
          className="text-white/15 hover:text-white/40 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
