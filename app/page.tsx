import Link from 'next/link'
import CaseCard from '@/components/CaseCard'
import { getCategories, getCategoryCounts, getFeedCases, getSiteStats, getViewer, getViewerCommunityStats } from '@/lib/data'

export const dynamic = 'force-dynamic'

const categoryIcon: Record<string, string> = {
  phishing: '⌁', fake_shop: '▣', crypto: '₿', investment: '↗', romance: '♥', job: '▤', banking: '▦', social_media: '◎', marketplace: '▧', other: '•••'
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string; sort?: string; page?: string }> }) {
  const sp = await searchParams
  const viewer = await getViewer()
  const categories = await getCategories()
  const page = Math.max(1, Number(sp.page || '1') || 1)
  const [feed, stats, categoryCounts, viewerStats] = await Promise.all([
    getFeedCases({ viewerId: viewer?.id, category: sp.category, q: sp.q, sort: sp.sort, page }),
    getSiteStats(),
    getCategoryCounts(categories),
    viewer ? getViewerCommunityStats(viewer.id) : Promise.resolve(null)
  ])

  const trending = [...categories]
    .map((c) => ({ ...c, count: categoryCounts[c.id] || 0 }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  const hrefFor = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams()
    const merged = { category: sp.category, q: sp.q, sort: sp.sort, page: String(page), ...patch }
    Object.entries(merged).forEach(([k, v]) => { if (v && v !== 'all' && !(k === 'page' && v === '1')) p.set(k, v) })
    const qs = p.toString()
    return qs ? `/?${qs}` : '/'
  }

  return (
    <main className="community-app" id="top">
      <div className="community-backdrop" aria-hidden />
      <section className="community-shell premium-community-shell" id="feed">
        <aside className="left-rail premium-left-rail">
          <div className="dark-rail-block">
            <p className="rail-label">NAVIGATION</p>
            <Link className={`rail-link ${!sp.sort || sp.sort === 'new' ? 'active' : ''}`} href={hrefFor({ sort: 'new', page: '1' })}><span className="rail-icon">◆</span> Für dich</Link>
            <Link className={`rail-link ${sp.sort === 'top' ? 'active' : ''}`} href={hrefFor({ sort: 'top', page: '1' })}><span className="rail-icon">◷</span> Top Signale</Link>
            <Link className={`rail-link ${sp.sort === 'discussed' ? 'active' : ''}`} href={hrefFor({ sort: 'discussed', page: '1' })}><span className="rail-icon">◯</span> Diskussionen</Link>
            {viewer && <><Link className="rail-link" href="/gespeichert"><span className="rail-icon">▱</span> Gespeicherte Fälle</Link><Link className="rail-link" href="/profil"><span className="rail-icon">◎</span> Mein Profil</Link></>}
          </div>

          <div className="dark-rail-block" id="categories">
            <p className="rail-label">KATEGORIEN</p>
            <Link className={`category ${!sp.category ? 'active' : ''}`} href={hrefFor({ category: undefined, page: '1' })}><i>⌂</i><span>Alle Fälle</span><b>{stats.cases}</b></Link>
            {categories.map((c) => <Link key={c.id} className={`category ${sp.category === c.id ? 'active' : ''}`} href={hrefFor({ category: c.id, page: '1' })}><i>{categoryIcon[c.id] || '•'}</i><span>{c.label}</span><b>{categoryCounts[c.id] || 0}</b></Link>)}
          </div>

          <div className="security-tip"><div className="tip-shield">⚡</div><div><p className="rail-label">SICHERHEITS-TIPP</p><b>Teile niemals Seed Phrases oder private Keys.</b><span>Niemand Seriöses wird diese Daten von dir verlangen.</span></div></div>
          <div className="rail-legal-links"><Link href="/datenschutz">Datenschutz</Link><Link href="/impressum">Impressum</Link><Link href="/nutzungsbedingungen">Nutzungsbedingungen</Link></div>
        </aside>

        <section className="feed-column premium-feed-column">
          <header className="feed-intro"><div><p className="feed-kicker">COMMUNITY SCAM INTELLIGENCE</p><h1>Gemeinsam Betrug erkennen.<br /><span>Andere schützen.</span></h1><p>Teile Erfahrungen, prüfe Hinweise und hilf der Community, digitale Täuschung schneller sichtbar zu machen.</p></div><Link className="solid intro-report-button" href={viewer ? '/fall/neu' : '/registrieren'}>＋ Fall melden</Link></header>

          <nav className="feed-tabs" aria-label="Feed sortieren">
            <Link className={!sp.sort || sp.sort === 'new' ? 'active' : ''} href={hrefFor({ sort: 'new', page: '1' })}>⌂ Für dich</Link>
            <Link href={hrefFor({ sort: 'new', page: '1' })}>✦ Neu</Link>
            <Link className={sp.sort === 'top' ? 'active' : ''} href={hrefFor({ sort: 'top', page: '1' })}>↗ Trending</Link>
            <Link href={hrefFor({ sort: 'top', page: '1' })}>◉ Bestätigt</Link>
            <Link className={sp.sort === 'discussed' ? 'active' : ''} href={hrefFor({ sort: 'discussed', page: '1' })}>◯ Diskussionen</Link>
          </nav>

          <Link className="composer premium-composer" href={viewer ? '/fall/neu' : '/registrieren'}><div className="avatar">{viewer ? viewer.username.slice(0, 2).toUpperCase() : 'SS'}</div><span className="composer-input">Was möchtest du der Community melden?</span><span className="composer-action">▧ Screenshot</span><span className="composer-action">↗ Link</span></Link>
          {sp.q && <div className="search-result-head"><span>SUCHERGEBNIS</span><b>„{sp.q}“</b><Link href="/">Suche löschen ×</Link></div>}
          {feed.items.length ? feed.items.map((item) => <CaseCard key={item.id} item={item} loggedIn={Boolean(viewer)} />) : <div className="empty-state premium-empty-state"><span>NO SIGNALS YET</span><h2>Noch keine Fälle in diesem Feed.</h2><p>{sp.q || sp.category ? 'Ändere Suche oder Filter – oder veröffentliche den ersten passenden Fall.' : 'ScamSignal ist bereit. Veröffentliche den ersten echten Fall und starte die Community-Datenbank.'}</p><Link className="solid" href={viewer ? '/fall/neu' : '/registrieren'}>＋ Ersten Fall veröffentlichen</Link></div>}
          <div className="pagination">{page > 1 && <Link className="ghost" href={hrefFor({ page: String(page - 1) })}>← Zurück</Link>}{feed.hasMore && <Link className="solid" href={hrefFor({ page: String(page + 1) })}>Weitere Fälle →</Link>}</div>
        </section>

        <aside className="right-rail premium-right-rail" id="discover">
          {viewer ? <section className="side-card profile-summary-card"><div className="side-card-head">DEIN PROFIL</div><div className="profile-summary-dark"><div className="profile-summary-user"><div className="profile-summary-avatar">{viewer.username.slice(0,2).toUpperCase()}</div><div><h3>{viewer.username}</h3><span>{viewer.role === 'admin' ? 'Administrator' : viewer.role === 'moderator' ? 'Moderator' : 'Mitglied'}</span></div></div><div className="reputation-row"><div><small>REPUTATION</small><b>{viewer.reputation.toLocaleString('de-DE')}</b></div><div className="trust-level"><span>SCAMSIGNAL</span><strong>{viewer.role === 'admin' ? 'ADMIN' : 'MEMBER'}</strong></div></div></div><div className="profile-mini-stats"><div><b>{viewerStats?.cases || 0}</b><span>Meldungen</span></div><div><b>{viewerStats?.confirmed || 0}</b><span>Bestätigt</span></div><div><b>{viewerStats?.comments || 0}</b><span>Kommentare</span></div></div><Link className="dark-wide-button" href="/profil">Profil bearbeiten</Link></section> : <section className="side-card profile-summary-card guest-card"><div className="side-card-head">SCAMSIGNAL COMMUNITY</div><div className="guest-card-inner"><h3>Wissen teilen.<br />Andere warnen.</h3><p>Mit einem Account kannst du Fälle veröffentlichen, kommentieren, abstimmen und Hinweise speichern.</p><Link className="solid wide" href="/registrieren">Kostenlos registrieren</Link><Link className="ghost wide" href="/login">Einloggen</Link></div></section>}
          <section className="side-card signal-card"><div className="side-card-title-row"><div className="side-card-head">TRENDING SIGNALE</div><small>AKTUELL</small></div>{trending.length ? <ol className="trend-list premium-trends">{trending.map((t, index) => <li key={t.id}><span className="trend-rank">{index + 1}</span><div><b>{t.label}</b><small>↗ {t.count} öffentliche Fälle</small></div></li>)}</ol> : <p className="side-empty">Noch keine Trends – sie entstehen automatisch aus echten Community-Fällen.</p>}</section>
          <section className="side-card signal-card"><div className="side-card-head">COMMUNITY STATUS</div><div className="metric"><span>Öffentliche Fälle</span><b>{stats.cases.toLocaleString('de-DE')}</b></div><div className="metric"><span>Indikatoren</span><b>{stats.indicators.toLocaleString('de-DE')}</b></div><div className="metric"><span>Kommentare</span><b>{stats.comments.toLocaleString('de-DE')}</b></div><div className="metric"><span>Heute gemeldet</span><b>{stats.todayCases.toLocaleString('de-DE')}</b></div></section>
          <section className="trust-card"><div className="trust-icon">✓</div><div><b>MODERATION & VERTRAUEN</b><p>Nutzerbeiträge sind Meldungen, keine behördlichen Feststellungen. Status und Moderation bleiben transparent.</p><Link href="/community-richtlinien">Prüfprozess ansehen →</Link></div></section>
        </aside>
      </section>

      <section className="mission premium-mission" id="about"><div><span>WARUM SCAMSIGNAL?</span><h2>Community-Wissen wird zu einem Frühwarnsystem.</h2></div><p>ScamSignal verbindet öffentliche Erfahrungen mit strukturierten Indikatoren wie Domains, Wallets und Accounts. Meldungen können diskutiert, ergänzt, bestritten und moderiert werden – nachvollziehbar und ohne aus einer Behauptung automatisch eine Tatsache zu machen.</p></section>
    </main>
  )
}
