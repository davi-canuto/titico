"use client"

import { useState } from "react"
import VideoPlayer from "./VideoPlayer"
import CompleteButton from "./CompleteButton"

interface VideoSectionProps {
  youtubeId: string
  slug: string
  initialSeconds: number
  totalDuration: number
  initialCompleted: boolean
  progressPercent: number
}

export default function VideoSection({
  youtubeId,
  slug,
  initialSeconds,
  totalDuration,
  initialCompleted,
  progressPercent,
}: VideoSectionProps) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [pct, setPct] = useState(progressPercent)

  function handleCompleted() {
    setCompleted(true)
    setPct(100)
  }

  return (
    <div className="flex flex-col gap-4">
      <VideoPlayer
        youtubeId={youtubeId}
        slug={slug}
        initialSeconds={initialSeconds}
        totalDuration={totalDuration}
        onCompleted={handleCompleted}
      />

      {/* Progress bar — shown when partially watched and not yet completed */}
      {pct > 0 && !completed && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#e3001b] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* Completed badge or manual button */}
      {completed ? (
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-[#4ade80]/20 bg-[#4ade80]/10 px-3 py-1 text-xs font-semibold text-[#4ade80]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
            Concluído
          </span>
        </div>
      ) : (
        <CompleteButton slug={slug} onCompleted={handleCompleted} />
      )}
    </div>
  )
}
