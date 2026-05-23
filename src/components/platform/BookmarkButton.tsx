"use client"

import { useState, useRef } from "react"

interface BookmarkButtonProps {
  contentId: string
  initialBookmarked: boolean
  className?: string
}

export default function BookmarkButton({ contentId, initialBookmarked, className = "" }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const next = !bookmarked
    setBookmarked(next)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        if (next) {
          await fetch("/api/bookmarks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentId }),
          })
        } else {
          await fetch(`/api/bookmarks/${contentId}`, { method: "DELETE" })
        }
      } catch {
        setBookmarked(!next)
      }
    }, 300)
  }

  return (
    <button
      onClick={handleClick}
      aria-label={bookmarked ? "Remover dos salvos" : "Salvar"}
      className={`flex items-center justify-center rounded-lg transition-colors ${
        bookmarked
          ? "text-[#e3001b]"
          : "text-white/40 hover:text-white/80"
      } ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  )
}
