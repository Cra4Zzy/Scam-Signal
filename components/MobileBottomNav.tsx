import Link from 'next/link'
import type { ViewerProfile } from '@/lib/types'

function FeedIcon(){return <svg viewBox="0 0 24 24" aria-hidden><path d="M5 5.5h14M5 12h14M5 18.5h9"/></svg>}
function CategoryIcon(){return <svg viewBox="0 0 24 24" aria-hidden><path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5zM14 14h5v5h-5z"/></svg>}
function PlusIcon(){return <svg viewBox="0 0 24 24" aria-hidden><path d="M12 5v14M5 12h14"/></svg>}
function CommunityIcon(){return <svg viewBox="0 0 24 24" aria-hidden><path d="M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.5 19c.4-3.1 2.1-5 5-5s4.6 1.9 5 5m1-4.1c2.9.1 4.6 1.5 5 4.1"/></svg>}
function ProfileIcon(){return <svg viewBox="0 0 24 24" aria-hidden><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c.6-3.7 3-5.8 7-5.8s6.4 2.1 7 5.8"/></svg>}

export default function MobileBottomNav({ viewer }: { viewer: ViewerProfile | null }) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <Link className="mobile-bottom-item" href="/#feed"><FeedIcon/><span>Feed</span></Link>
      <Link className="mobile-bottom-item" href="/#categories"><CategoryIcon/><span>Kategorien</span></Link>
      <Link className="mobile-bottom-item mobile-bottom-primary" href={viewer ? '/fall/neu' : '/registrieren'}><span className="mobile-bottom-plus"><PlusIcon/></span><span>Melden</span></Link>
      <Link className="mobile-bottom-item" href="/#discover"><CommunityIcon/><span>Community</span></Link>
      <Link className="mobile-bottom-item" href={viewer ? '/profil' : '/login'}><ProfileIcon/><span>{viewer ? 'Profil' : 'Login'}</span></Link>
    </nav>
  )
}
