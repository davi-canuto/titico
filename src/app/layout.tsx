import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Titiltei — Guia do Shaco AD',
  description: 'Se torne um deus jogando de Shaco. Guia completo com matchups, builds e runas por Titiltei, Rank 1 Challenger BR.',
  openGraph: {
    title: 'Titiltei — Guia do Shaco AD',
    description: 'Se torne um deus jogando de Shaco.',
    siteName: 'Titiltei',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  )
}
