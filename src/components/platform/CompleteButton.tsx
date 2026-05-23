"use client"

import { useState } from "react"

interface CompleteButtonProps {
  slug: string
  onCompleted: () => void
}

export default function CompleteButton({ slug, onCompleted }: CompleteButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      await fetch(`/api/contents/${slug}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completedAt: new Date().toISOString() }),
      })
      onCompleted()
    } catch {
      // swallow
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/50 transition-colors hover:border-white/30 hover:text-white disabled:opacity-40"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {loading ? "Salvando..." : "Marcar como concluído"}
    </button>
  )
}
