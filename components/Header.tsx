import Image from 'next/image'
import Link from 'next/link'
import type { ViewerProfile } from '@/lib/types'
import { signOutAction } from '@/app/actions/auth'

function SearchIcon(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden><path d="m21 21-4.35-4.35m1.35-5.15A6.5 6.5 0 1 1 5 11.5a6.5 6.5 0 0 1 13 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}

export default function Header({ viewer }: { viewer: ViewerProfile | null }) {
  return <header className="app-header site-header">
    <div className="site-header-inner">
      <Link className="brand brand-lockup" href="/" aria-label="ScamSignal Startseite"><Image src="/scam-signal-logo.svg" alt="ScamSignal" width={190} height={50} priority /></Link>
      <nav className="desktop-nav" aria-label="Hauptnavigation"><Link href="/">Feed</Link><Link href="/#categories">Kategorien</Link><Link href="/#discover">Community</Link><Link href="/#about">Über ScamSignal</Link></nav>
      <form className="header-search site-search" action="/" method="get"><SearchIcon/><input name="q" aria-label="ScamSignal durchsuchen" placeholder="Fälle, Domains, Wallets, Nutzer …" /></form>
      <div className="header-actions site-actions">{viewer ? <><Link className="solid" href="/fall/neu">Fall melden</Link><Link className="user-chip clean-user-chip" href="/profil"><span className="mini-avatar">{viewer.username.slice(0,2).toUpperCase()}</span><span><b>{viewer.username}</b><small>{viewer.role === 'admin' ? 'Administrator' : viewer.role === 'moderator' ? 'Moderator' : 'Mitglied'}</small></span></Link><form action={signOutAction}><button className="ghost">Logout</button></form></> : <><Link className="ghost" href="/login">Einloggen</Link><Link className="solid" href="/registrieren">Registrieren</Link></>}</div>
      <details className="mobile-menu"><summary aria-label="Menü öffnen">☰</summary><div className="mobile-menu-panel"><Link href="/">Feed</Link><Link href="/#categories">Kategorien</Link><Link href="/#discover">Community</Link><Link href="/#about">Über ScamSignal</Link>{viewer ? <><Link href="/fall/neu">Fall melden</Link><Link href="/profil">Mein Profil</Link><form action={signOutAction}><button>Logout</button></form></> : <><Link href="/login">Einloggen</Link><Link href="/registrieren">Registrieren</Link></>}</div></details>
    </div>
  </header>
}
