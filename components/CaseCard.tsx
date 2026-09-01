import Link from 'next/link'
import type { FeedCase } from '@/lib/types'
import { categoryClass, formatRelativeTime, publicCaseId, statusClass, statusLabel } from '@/lib/utils'
import VoteControl from '@/components/VoteControl'
import SaveButton from '@/components/SaveButton'
import ReportButton from '@/components/ReportButton'
import DeleteCaseButton from '@/components/DeleteCaseButton'

const indicatorIcon: Record<string, string> = {
  domain: '◎', url: '↗', wallet: '◇', phone: '◖', email: '@', social_account: '#', username: '@', other: '•'
}

export default function CaseCard({ item, loggedIn, canDelete = false }: { item: FeedCase; loggedIn: boolean; canDelete?: boolean }) {
  const preview = item.indicators.slice(0, 3)
  return (
    <article className="post-card clean-post-card">
      <VoteControl caseId={item.id} initialScore={item.score} initialVote={item.userVote} loggedIn={loggedIn} />
      <div className="post-body clean-post-body">
        <div className="post-topline">
          {item.author ? <Link className="post-author-inline" href={`/u/${encodeURIComponent(item.author.username)}`}><span className="author-avatar">{item.author.username.slice(0,2).toUpperCase()}</span><span><b>{item.author.display_name || item.author.username}</b><small>@{item.author.username}</small></span></Link> : <span className="post-author-inline"><span className="author-avatar">SS</span><span><b>Unbekannter Nutzer</b></span></span>}
          <span className="post-topline-sep"/>
          <span>{formatRelativeTime(item.created_at)}</span>
          <span className="case-code">{publicCaseId(item.id)}</span>
        </div>

        <div className="post-label-row"><Link href={`/?category=${encodeURIComponent(item.category)}`} className={`community-badge ${categoryClass(item.category)}`}>{item.categoryLabel}</Link><span className={`status-inline ${statusClass(item.status)}`}>{statusLabel(item.status)}</span></div>

        <div className={`post-content-grid ${item.evidencePreviewUrl ? 'has-preview' : ''}`}>
          <div className="post-copy">
            <h2><Link href={`/fall/${item.id}`}>{item.title}</Link></h2>
            <p>{item.summary || item.body.slice(0, 340)}{!item.summary && item.body.length > 340 ? '…' : ''}</p>
            {preview.length > 0 && <div className="indicator-inline-list">{preview.map((i) => <span className="indicator-inline" key={i.id}><i>{indicatorIcon[i.indicator_type] || '•'}</i><b>{i.value}</b></span>)}</div>}
            <div className="risk-line"><span className={`risk-pill ${item.status === 'confirmed' ? 'confirmed' : item.status === 'corroborated' ? 'corroborated' : ''}`}>{item.status === 'confirmed' ? 'Bestätigt' : item.status === 'corroborated' ? 'Gestützt' : 'Gemeldet'}</span><span><b>{item.indicators.length}</b> Indikatoren</span><span><b>{item.evidenceCount}</b> Belege</span></div>
          </div>
          {item.evidencePreviewUrl && <Link className="case-evidence-thumb" href={`/fall/${item.id}`}><img src={item.evidencePreviewUrl} alt="Beleg-Vorschau" /><span>{item.evidenceCount > 1 ? `+${item.evidenceCount - 1}` : 'Beleg'}</span></Link>}
        </div>

        <div className="mobile-social-actions"><VoteControl caseId={item.id} initialScore={item.score} initialVote={item.userVote} loggedIn={loggedIn} mode="inline"/><Link className="mobile-social-action" href={`/fall/${item.id}#diskussion`}><span>◯</span><b>{item.commentCount}</b><small>Kommentare</small></Link><div className="mobile-save-action"><SaveButton caseId={item.id} initialSaved={item.saved} loggedIn={loggedIn}/></div></div>

        <div className="post-footer-row clean-post-footer"><span className="post-footer-context">Community-Meldung · Status kann sich durch neue Belege ändern</span><div className="post-actions"><Link className="action-link" href={`/fall/${item.id}#diskussion`}>{item.commentCount} Kommentare</Link><SaveButton caseId={item.id} initialSaved={item.saved} loggedIn={loggedIn} /><Link className="action-link" href={`/fall/${item.id}`}>Öffnen</Link>{canDelete ? <DeleteCaseButton caseId={item.id} compact /> : <ReportButton caseId={item.id} loggedIn={loggedIn} />}</div></div>
      </div>
    </article>
  )
}
