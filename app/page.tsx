import Link from 'next/link'
import CaseCard from '@/components/CaseCard'
import { getCategories, getCategoryCounts, getFeedCases, getSiteStats, getViewer, getViewerCommunityStats } from '@/lib/data'

export const dynamic = 'force-dynamic'

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
    .slice(0, 4)

  const hrefFor = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams()
    const merged = { category: sp.category, q: sp.q, sort: sp.sort, page: String(page), ...patch }
    Object.entries(merged).forEach(([k, v]) => { if (v && v !== 'all' && !(k === 'page' && v === '1')) p.set(k, v) })
    const qs = p.toString()
    return qs ? `/?${qs}` : '/'
  }

  return (
    <main className="community-app clean-community" id="top">
      <section className="community-hero">
        <div className="community-hero-grid">
          <div>
            <p className="eyebrow"><span className="signal-dot"/> Community Scam Intelligence</p>
            <h1>Betrug wird leiser.<br/><em>Wir nicht.</em></h1>
            <p className="hero-lead">Eine öffentliche Community für dokumentierte Scam-Verdachtsfälle: Hinweise sammeln, Belege einordnen, Widerspruch ermöglichen und andere frühzeitig warnen.</p>
            <div className="hero-actions"><Link className="solid" href={viewer ? '/fall/neu' : '/registrieren'}>{viewer ? 'Fall melden' : 'Account erstellen'}</Link><Link className="ghost" href="#feed">Aktuelle Meldungen ansehen</Link><span className="hero-note">Keine anonyme Vorverurteilung. Belege vor Behauptungen.</span></div>
          </div>
          <div className="hero-side">
            <div className="hero-principle"><small>UNSER PRINZIP</small><p>Ein Hinweis ist ein Hinweis — bis Belege ihn tragen.</p></div>
            <div className="hero-stats"><div><b>{stats.cases.toLocaleString('de-DE')}</b><span>öffentliche Fälle</span></div><div><b>{stats.comments.toLocaleString('de-DE')}</b><span>Kommentare</span></div><div><b>{stats.indicators.toLocaleString('de-DE')}</b><span>Indikatoren</span></div><div><b>{stats.todayCases.toLocaleString('de-DE')}</b><span>heute gemeldet</span></div></div>
          </div>
        </div>
      </section>

      <section className="community-shell clean-community-shell" id="feed">
        <aside className="left-rail clean-filter-rail">
          <section className="rail-section">
            <p className="rail-label">Feed</p>
            <Link className={`rail-link ${!sp.sort || sp.sort === 'new' ? 'active' : ''}`} href={hrefFor({ sort: 'new', page: '1' })}>Neu & relevant</Link>
            <Link className={`rail-link ${sp.sort === 'top' ? 'active' : ''}`} href={hrefFor({ sort: 'top', page: '1' })}>Top Signale</Link>
            <Link className={`rail-link ${sp.sort === 'discussed' ? 'active' : ''}`} href={hrefFor({ sort: 'discussed', page: '1' })}>Diskutiert</Link>
            {viewer && <><Link className="rail-link" href="/gespeichert">Gespeichert</Link><Link className="rail-link" href="/profil">Mein Profil</Link></>}
          </section>

          <section className="rail-section" id="categories">
            <p className="rail-label">Kategorien</p>
            <Link className={`category ${!sp.category ? 'active' : ''}`} href={hrefFor({ category: undefined, page: '1' })}><span className="category-mark"/><span>Alle Fälle</span><b>{stats.cases}</b></Link>
            {categories.map((c) => <Link key={c.id} className={`category ${sp.category === c.id ? 'active' : ''}`} href={hrefFor({ category: c.id, page: '1' })}><span className="category-mark"/><span>{c.label}</span><b>{categoryCounts[c.id] || 0}</b></Link>)}
          </section>

          <div className="rail-tip"><p className="rail-label">Hinweis</p><b>Private Schlüssel, Seed Phrases und vollständige Zahlungsdaten gehören nie in einen Beitrag.</b><p>Schwärze unnötige personenbezogene Daten in Screenshots vor dem Upload.</p></div>
          <div className="rail-legal-links"><Link href="/datenschutz">Datenschutz</Link><Link href="/impressum">Impressum</Link><Link href="/nutzungsbedingungen">Nutzung</Link></div>
        </aside>

        <section className="feed-column clean-feed-column">
          <div className="feed-toolbar">
            <div><h2>Community Feed</h2><p>Öffentliche Meldungen, sortiert nach deinem aktuellen Filter.</p></div>
            <nav className="feed-tabs clean-feed-tabs" aria-label="Feed sortieren"><Link className={!sp.sort || sp.sort === 'new' ? 'active' : ''} href={hrefFor({ sort: 'new', page: '1' })}>Neu</Link><Link className={sp.sort === 'top' ? 'active' : ''} href={hrefFor({ sort: 'top', page: '1' })}>Top</Link><Link className={sp.sort === 'discussed' ? 'active' : ''} href={hrefFor({ sort: 'discussed', page: '1' })}>Diskutiert</Link></nav>
          </div>

          <Link className="composer clean-composer" href={viewer ? '/fall/neu' : '/registrieren'}><div className="avatar">{viewer ? viewer.username.slice(0, 2).toUpperCase() : 'SS'}</div><span className="composer-input">Einen verdächtigen Fall dokumentieren …</span><span className="composer-hint">Belege · Links · Indikatoren</span></Link>
          {sp.q && <div className="search-result-head"><span>SUCHERGEBNIS</span><b>„{sp.q}“</b><Link href="/">Suche löschen ×</Link></div>}
          {feed.items.length ? feed.items.map((item) => <CaseCard key={item.id} item={item} loggedIn={Boolean(viewer)} />) : <div className="empty-state clean-empty-state"><span>NO SIGNALS YET</span><h2>Noch keine Fälle in diesem Feed.</h2><p>{sp.q || sp.category ? 'Ändere Suche oder Filter – oder veröffentliche den ersten passenden Fall.' : 'Hier erscheinen echte Community-Meldungen. Du kannst den ersten Fall nachvollziehbar dokumentieren und mit Belegen ergänzen.'}</p><Link className="solid" href={viewer ? '/fall/neu' : '/registrieren'}>Ersten Fall veröffentlichen</Link></div>}
          <div className="pagination">{page > 1 && <Link className="ghost" href={hrefFor({ page: String(page - 1) })}>← Zurück</Link>}{feed.hasMore && <Link className="solid" href={hrefFor({ page: String(page + 1) })}>Weitere Fälle →</Link>}</div>
        </section>

        <aside className="right-rail clean-right-rail" id="discover">
          {viewer ? <section className="side-card clean-side-card"><div className="side-card-head">Dein Profil</div><div className="clean-profile"><div className="clean-profile-user"><div className="clean-profile-avatar">{viewer.username.slice(0,2).toUpperCase()}</div><div><h3>{viewer.username}</h3><p>{viewer.role === 'admin' ? 'Administrator' : viewer.role === 'moderator' ? 'Moderator' : 'Mitglied'}</p></div></div><div className="clean-profile-meta"><div><b>{viewer.reputation.toLocaleString('de-DE')}</b><span>Reputation</span></div><div><b>{viewerStats?.cases || 0}</b><span>Meldungen</span></div><div><b>{viewerStats?.comments || 0}</b><span>Kommentare</span></div></div><Link className="clean-profile-link" href="/profil">Profil öffnen →</Link></div></section> : <section className="side-card clean-side-card"><div className="side-card-head">Community</div><div className="guest-card-inner clean-guest"><h3>Wissen teilen.<br/>Andere warnen.</h3><p>Mit einem Account kannst du Fälle veröffentlichen, kommentieren, abstimmen und Hinweise speichern.</p><Link className="solid wide" href="/registrieren">Kostenlos registrieren</Link><Link className="ghost wide" href="/login">Einloggen</Link></div></section>}

          <section className="side-card clean-side-card"><div className="side-card-head">Aktuell häufig gemeldet</div>{trending.length ? <ol className="trend-list clean-trends">{trending.map((t, index) => <li key={t.id}><span className="trend-rank">{index + 1}</span><div><b>{t.label}</b><small>{t.count} öffentliche Fälle</small></div></li>)}</ol> : <p className="side-empty">Noch keine belastbaren Trends vorhanden.</p>}</section>
          <section className="side-card clean-side-card"><div className="side-card-head">Plattformstatus</div><div className="metric clean-metric"><span>Öffentliche Fälle</span><b>{stats.cases.toLocaleString('de-DE')}</b></div><div className="metric clean-metric"><span>Indikatoren</span><b>{stats.indicators.toLocaleString('de-DE')}</b></div><div className="metric clean-metric"><span>Kommentare</span><b>{stats.comments.toLocaleString('de-DE')}</b></div></section>
          <section className="trust-card clean-trust-card"><b>MODERATION & WIDERSPRUCH</b><p>Nutzerbeiträge sind Meldungen. Betroffene und andere Nutzer können widersprechen, Gegenbelege liefern und Inhalte melden.</p><Link href="/community-richtlinien">Wie wir moderieren →</Link></section>
        </aside>
      </section>

      <section className="mission clean-mission" id="about"><div><span>WARUM SCAMSIGNAL?</span><h2>Erfahrungen werden wertvoll, wenn sie strukturiert und überprüfbar sind.</h2></div><p>ScamSignal verbindet Community-Erfahrungen mit Indikatoren wie Domains, Wallets, Accounts und Belegen. Beiträge können ergänzt, bestritten und moderiert werden. Unser Ziel ist nicht maximale Empörung, sondern bessere Orientierung durch nachvollziehbare Informationen.</p></section>
    </main>
  )
}
