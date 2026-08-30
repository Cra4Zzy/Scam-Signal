import type { ReactNode } from 'react'
import Link from 'next/link'

export default function LegalShell({ title, children, notice }: { title: string; children: ReactNode; notice?: string }) {
  return <main className="legal-page"><div className="legal-top"><Link href="/">← Zur Plattform</Link></div><article className="legal-card"><h1>{title}</h1>{notice && <div className="legal-notice">{notice}</div>}{children}</article><nav className="legal-nav"><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><Link href="/nutzungsbedingungen">Nutzungsbedingungen</Link><Link href="/community-richtlinien">Community-Richtlinien</Link></nav></main>
}
