import Image from 'next/image'
import Link from 'next/link'
import type { ViewerProfile } from '@/lib/types'
import { signOutAction } from '@/app/actions/auth'

export default function Header({ viewer }: { viewer: ViewerProfile | null }) {
  return <header className="app-header"><Link className="brand" href="/"><Image src="/scam-signal-logo.svg" alt="ScamSignal" width={190} height={50} priority /></Link><nav className="main-nav"><Link href="/">Feed</Link><Link href="/#categories">Kategorien</Link><Link href="/#discover">Community</Link><Link href="/#about">Über uns</Link></nav><form className="header-search" action="/" method="get"><span>⌕</span><input name="q" placeholder="Fälle, Domains, Wallets, Nutzer suchen…" /></form><div className="header-actions">{viewer ? <><Link className="solid" href="/fall/neu">＋ Fall melden</Link><Link className="user-chip" href="/profil"><span className="mini-avatar">{viewer.username.slice(0,2).toUpperCase()}</span><span><b>{viewer.username}</b><small>{viewer.role === 'admin' ? 'Administrator' : 'Mitglied'}</small></span></Link><form action={signOutAction}><button className="ghost">Logout</button></form></> : <><Link className="ghost" href="/login">Einloggen</Link><Link className="solid" href="/registrieren">Registrieren</Link></>}</div></header>
}
