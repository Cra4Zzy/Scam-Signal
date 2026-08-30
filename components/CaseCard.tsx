import Link from 'next/link'
import type { FeedCase } from '@/lib/types'
import { categoryClass, formatRelativeTime, publicCaseId, statusClass, statusLabel } from '@/lib/utils'
import VoteControl from '@/components/VoteControl'
import SaveButton from '@/components/SaveButton'
import ReportButton from '@/components/ReportButton'

const indicatorIcon: Record<string, string> = {
  domain: '◎', url: '↗', wallet: '◇', phone: '◖', email: '@', social_account: '#', username: '@', other: '•'
}

export default function CaseCard({ item, loggedIn }: { item: FeedCase; loggedIn: boolean }) {
  const preview = item.indicators.slice(0, 3)
  return (
    <article className="post-card premium-post-card">
      <VoteControl caseId={item.id} initialScore={item.score} initialVote={item.userVote} loggedIn={loggedIn} />
      <div className="post-body">
        <div className="post-meta">
          <span className={`community-badge ${categoryClass(item.category)}`}>{item.categoryLabel}</span>
          <span>{formatRelativeTime(item.created_at)}</span>
          <span className={`status-inline ${statusClass(item.status)}`}>{statusLabel(item.status)}</span>
          <span className="case-code">{publicCaseId(item.id)}</span>
        </div>

        <div className={`post-content-grid ${item.evidencePreviewUrl ? 'has-preview' : ''}`}>
          <div className="post-copy">
            <h2><Link href={`/fall/${item.id}`}>{item.title}</Link></h2>
            <p>{item.summary || item.body.slice(0, 340)}{!item.summary && item.body.length > 340 ? '…' : ''}</p>
            {preview.length > 0 && <div className="indicator-inline-list">{preview.map((i) => <span className="indicator-inline" key={i.id}><i>{indicatorIcon[i.indicator_type] || '•'}</i><b>{i.value}</b></span>)}</div>}
            <div className="risk-line"><span className={`risk-pill ${item.status === 'confirmed' ? 'confirmed' : item.status === 'corroborated' ? 'corroborated' : ''}`}>{item.status === 'confirmed' ? 'BESTÄTIGT' : item.status === 'corroborated' ? 'GESTÜTZT' : 'GEMELDET'}</span><span><b>{item.indicators.length}</b> Indikatoren</span><span><b>{item.evidenceCount}</b> Beweise</span></div>
          </div>
          {item.evidencePreviewUrl && <Link className="case-evidence-thumb" href={`/fall/${item.id}`}><img src={item.evidencePreviewUrl} alt="Beweis-Vorschau" /><span>+{Math.max(0, item.evidenceCount - 1)}</span></Link>}
        </div>

        <div className="post-footer-row">
          <div className="post-author"> <span className="author-avatar">{item.author?.username.slice(0,2).toUpperCase() || 'SS'}</span><span>{item.author ? <>Von <Link href={`/u/${item.author.username}`}><b>{item.author.display_name || item.author.username}</b></Link><small>@{item.author.username}</small></> : <>Unbekannter Nutzer</>}</span></div>
          <div className="post-actions"><Link className="action-link" href={`/fall/${item.id}#diskussion`}>◯ <b>{item.commentCount}</b> Kommentare</Link><SaveButton caseId={item.id} initialSaved={item.saved} loggedIn={loggedIn} /><Link className="action-link" href={`/fall/${item.id}`}>↗ Teilen</Link><ReportButton caseId={item.id} loggedIn={loggedIn} /></div>
        </div>
      </div>
    </article>
  )
}
