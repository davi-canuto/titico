"use client"

import { useEffect, useRef, useState } from "react"

interface VideoPlayerProps {
  youtubeId: string
  slug: string
  initialSeconds?: number
  totalDuration?: number
  onCompleted?: () => void
}

const SAVE_INTERVAL_MS = 15_000
const COMPLETION_THRESHOLD = 0.9

export default function VideoPlayer({
  youtubeId,
  slug,
  initialSeconds = 0,
  totalDuration,
  onCompleted,
}: VideoPlayerProps) {
  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const completedSentRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)

  function elapsed(): number {
    if (startTimeRef.current === null) return 0
    return Math.round((Date.now() - startTimeRef.current) / 1000)
  }

  async function saveProgress(watchedSeconds: number, completedAt?: string) {
    try {
      await fetch(`/api/contents/${slug}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watchedSeconds, ...(completedAt ? { completedAt } : {}) }),
        keepalive: true,
      })
    } catch {
      // fire-and-forget
    }
  }

  function checkCompletion(watchedSeconds: number) {
    if (completedSentRef.current) return
    if (!totalDuration || totalDuration <= 0) return
    if (watchedSeconds >= COMPLETION_THRESHOLD * totalDuration) {
      completedSentRef.current = true
      const completedAt = new Date().toISOString()
      saveProgress(watchedSeconds, completedAt)
      onCompleted?.()
    }
  }

  function startInterval() {
    if (intervalRef.current) return
    intervalRef.current = setInterval(() => {
      const secs = elapsed()
      checkCompletion(secs)
      if (!completedSentRef.current) {
        saveProgress(secs)
      }
    }, SAVE_INTERVAL_MS)
  }

  function stopInterval() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data
        if (data?.event !== "onStateChange") return

        if (data.info === 1) {
          // PLAYING
          if (startTimeRef.current === null) {
            startTimeRef.current = Date.now()
            saveProgress(0)
          }
          setIsPlaying(true)
          startInterval()
        } else if (data.info === 0 || data.info === 2) {
          // ENDED or PAUSED
          stopInterval()
          setIsPlaying(false)
          if (startTimeRef.current !== null) {
            const secs = elapsed()
            checkCompletion(secs)
            if (!completedSentRef.current) {
              saveProgress(secs)
            }
          }
        }
      } catch {
        // ignore non-JSON messages
      }
    }

    function handleUnload() {
      stopInterval()
      if (startTimeRef.current !== null) {
        const secs = elapsed()
        if (!completedSentRef.current) {
          saveProgress(secs)
        }
      }
    }

    window.addEventListener("message", handleMessage)
    window.addEventListener("beforeunload", handleUnload)

    return () => {
      window.removeEventListener("message", handleMessage)
      window.removeEventListener("beforeunload", handleUnload)
      stopInterval()
      handleUnload()
    }
  }, [slug])

  const src = `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1${initialSeconds > 0 ? `&start=${initialSeconds}` : ""}`

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
      <iframe
        src={src}
        title="Video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  )
}
