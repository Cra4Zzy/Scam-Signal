import type { Metadata } from 'next'
import './globals.css'
import './redesign.css'
import './evidence.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { getViewer } from '@/lib/data'

export const metadata: Metadata = {
  title: { default: 'ScamSignal — Community Scam Intelligence', template: '%s — ScamSignal' },
  description: 'ScamSignal ist eine öffentliche Community zur Dokumentation, Diskussion und Prüfung von Scam-Verdachtsfällen.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  robots: { index: true, follow: true }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const viewer = await getViewer()
  return (
    <html lang="de">
      <body>
        <Header viewer={viewer} />
        {children}
        <Footer />
        <MobileBottomNav viewer={viewer} />
      </body>
    </html>
  )
}
