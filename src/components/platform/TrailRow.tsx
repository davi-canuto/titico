"use client"

import { useRef, useState } from "react"
import ContentCard from "./ContentCard"
import type { Content, VideoMeta } from "@prisma/client"

type ContentWithVideo = Content & { video?: Pick<VideoMeta, "duration"> | null }

interface TrailRowItem {
  id: string
  content: ContentWithVideo
}

interface TrailRowProps {
  title: string
  items: TrailRowItem[]
  progressMap?: Record<string, { watchedSeconds?: number | null }>
  locked?: boolean
}

export default function TrailRow({ title, items, progressMap = {}, locked }: TrailRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === "left" ? -560 : 560, behavior: "smooth" })
  }

  return (
    <section className="flex flex-col gap-3">
      {/* Row title */}
      <h2 className="px-6 text-base font-black uppercase tracking-tight text-white md:px-12">
        {title}
      </h2>

      {/* Scroll container */}
      <div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Left fade + arrow */}
        <div className={`pointer-events-none absolute left-0 top-0 z-10 flex h-full w-16 items-center justify-start bg-gradient-to-r from-[#0d0d0d] to-transparent transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <button
            onClick={() => scroll("left")}
            aria-label="Anterior"
            className="pointer-events-auto ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/10 transition-colors hover:bg-white/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth px-6 pb-2 md:px-12"
        >
          {items.map((item) => (
            <div key={item.id} className="w-[220px] shrink-0 md:w-[260px]">
              <ContentCard
                content={item.content}
                userProgress={progressMap[item.content.id]}
                locked={locked}
              />
            </div>
          ))}
        </div>

        {/* Right fade + arrow */}
        <div className={`pointer-events-none absolute right-0 top-0 z-10 flex h-full w-16 items-center justify-end bg-gradient-to-l from-[#0d0d0d] to-transparent transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <button
            onClick={() => scroll("right")}
            aria-label="Próximo"
            className="pointer-events-auto mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/10 transition-colors hover:bg-white/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
