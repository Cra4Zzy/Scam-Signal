import type { ReactNode } from 'react'
import Link from 'next/link'

export default function LegalShell({
  title,
  children,
  notice,
  intro,
  eyebrow = 'SCAMSIGNAL · RECHT & VERTRAUEN',
  updated = 'Stand: 30. August 2026'
}: {
  title: string
  children: ReactNode
  notice?: string
  intro?: string
  eyebrow?: string
  updated?: string
}) {
  return <main className="legal-page">
    <header className="legal-hero">
      <Link className="legal-back" href="/">← Zur Plattform</Link>
      <p className="eyebrow"><span className="signal-dot"/>{eyebrow}</p>
      <h1>{title}</h1>
      {intro && <p>{intro}</p>}
      <div className="legal-meta"><span>{updated}</span><span>·</span><span>scam-signal.com</span></div>
    </header>
    <div className="legal-layout">
      <aside className="legal-sidebar" aria-label="Rechtliche Seiten"><p className="legal-sidebar-label">DOKUMENTE</p><Link href="/community-richtlinien">Community-Richtlinien</Link><Link href="/datenschutz">Datenschutz</Link><Link href="/nutzungsbedingungen">Nutzungsbedingungen</Link><Link href="/impressum">Impressum</Link></aside>
      <article className="legal-card"><h1>{title}</h1>{notice && <div className="legal-notice">{notice}</div>}{children}</article>
    </div>
  </main>
}
