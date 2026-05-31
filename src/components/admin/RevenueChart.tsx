"use client"

import { useState } from "react"

type Purchase = { createdAt: Date | string; price: number }
type Bar = { label: string; total: number }

function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function groupByWeek(purchases: Purchase[]): Bar[] {
  const now = new Date()
  const bars: Bar[] = []
  for (let i = 7; i >= 0; i--) {
    const weekStart = startOfWeek(new Date(now.getTime() - i * 7 * 86400000))
    const weekEnd = new Date(weekStart.getTime() + 7 * 86400000)
    const label = weekStart.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    const total = purchases
      .filter((p) => {
        const d = new Date(p.createdAt)
        return d >= weekStart && d < weekEnd
      })
      .reduce((sum, p) => sum + p.price, 0)
    bars.push({ label, total })
  }
  return bars
}

function groupByMonth(purchases: Purchase[]): Bar[] {
  const now = new Date()
  const bars: Bar[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1)
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    const label = monthStart.toLocaleDateString("pt-BR", { month: "short" })
    const total = purchases
      .filter((p) => {
        const pd = new Date(p.createdAt)
        return pd >= monthStart && pd < monthEnd
      })
      .reduce((sum, p) => sum + p.price, 0)
    bars.push({ label, total })
  }
  return bars
}

function formatBRL(centavos: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(centavos / 100)
}

export default function RevenueChart({ purchases }: { purchases: Purchase[] }) {
  const [view, setView] = useState<"week" | "month">("week")
  const bars = view === "week" ? groupByWeek(purchases) : groupByMonth(purchases)
  const maxValue = Math.max(...bars.map((b) => b.total), 1)

  const barWidth = 28
  const gap = 12
  const chartH = 120
  const totalW = bars.length * (barWidth + gap) - gap

  return (
    <div className="rounded-xl border border-white/5 bg-[#161616] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">Receita por período</p>
        <div className="flex gap-1">
          <button
            onClick={() => setView("week")}
            className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${view === "week" ? "bg-[#e3001b] text-white" : "text-white/40 hover:text-white"}`}
          >
            Semanas
          </button>
          <button
            onClick={() => setView("month")}
            className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${view === "month" ? "bg-[#e3001b] text-white" : "text-white/40 hover:text-white"}`}
          >
            Meses
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          width={totalW}
          height={chartH + 24}
          viewBox={`0 0 ${totalW} ${chartH + 24}`}
          className="min-w-full"
          style={{ minWidth: totalW }}
        >
          {bars.map((bar, i) => {
            const height = Math.max((bar.total / maxValue) * chartH, bar.total > 0 ? 2 : 0)
            const x = i * (barWidth + gap)
            const y = chartH - height
            return (
              <g key={i}>
                <rect x={x} y={y} width={barWidth} height={height} fill="#e3001b" rx={3} opacity={0.9}>
                  <title>{formatBRL(bar.total)}</title>
                </rect>
                <text
                  x={x + barWidth / 2}
                  y={chartH + 16}
                  textAnchor="middle"
                  fontSize={9}
                  fill="rgba(255,255,255,0.35)"
                >
                  {bar.label}
                </text>
              </g>
            )
          })}
          {/* baseline */}
          <line x1={0} y1={chartH} x2={totalW} y2={chartH} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
        </svg>
      </div>
    </div>
  )
}
