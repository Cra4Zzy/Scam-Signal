'use client'

import { FormEvent, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { CommentData } from '@/lib/types'
import { formatRelativeTime } from '@/lib/utils'
import ReportButton from '@/components/ReportButton'

function CommentVote({ comment, loggedIn }: { comment: CommentData; loggedIn: boolean }) {
  const [score, setScore] = useState(comment.score)
  const [vote, setVote] = useState<-1 | 0 | 1>(comment.userVote)
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  async function apply(next: -1 | 1) {
    if (!loggedIn) return router.push(`/login?next=${encodeURIComponent(pathname)}`)
    if (busy) return
    setBusy(true)

    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) {
      setBusy(false)
      return router.push('/login')
    }

    const old = vote
    const target: -1 | 0 | 1 = old === next ? 0 : next
    setVote(target)
    setScore((current) => current + target - old)

    const result = target === 0
      ? await supabase.from('comment_votes').delete().eq('comment_id', comment.id).eq('user_id', auth.user.id)
      : await supabase.from('comment_votes').upsert(
          { comment_id: comment.id, user_id: auth.user.id, value: target },
          { onConflict: 'comment_id,user_id' }
        )

    if (result.error) {
      setVote(old)
      setScore((current) => current - target + old)
    }
    setBusy(false)
  }

  return (
    <span className="comment-votes">
      <button type="button" disabled={busy} className={vote === 1 ? 'active' : ''} onClick={() => apply(1)} aria-label="Kommentar hochstimmen">▲</button>
      <b>{score}</b>
      <button type="button" disabled={busy} className={vote === -1 ? 'active' : ''} onClick={() => apply(-1)} aria-label="Kommentar herunterstimmen">▼</button>
    </span>
  )
}

function CommentComposer({ caseId, parentId, onDone }: { caseId: string; parentId?: string; onDone?: () => void }) {
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || !body.trim()) return
    setBusy(true)
    setError('')

    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) {
      setBusy(false)
      return router.push(`/login?next=/fall/${caseId}`)
    }

    const { error: insertError } = await supabase.from('comments').insert({
      case_id: caseId,
      author_id: auth.user.id,
      parent_id: parentId ?? null,
      body: body.trim()
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      setBody('')
      onDone?.()
      router.refresh()
    }
    setBusy(false)
  }

  return (
    <form onSubmit={submit} className={parentId ? 'reply-composer' : 'comment-composer-live'}>
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        required
        maxLength={10000}
        rows={parentId ? 3 : 4}
        placeholder={parentId ? 'Sachlich antworten …' : 'Sachlich kommentieren oder neue Hinweise ergänzen …'}
      />
      {error && <span className="inline-error">{error}</span>}
      <button className="solid" disabled={busy}>{busy ? 'Wird gespeichert …' : parentId ? 'Antworten' : 'Kommentieren'}</button>
    </form>
  )
}

type ReplyMap = Map<string, CommentData[]>

function CommentItem({
  comment,
  replyMap,
  caseId,
  loggedIn,
  depth = 0
}: {
  comment: CommentData
  replyMap: ReplyMap
  caseId: string
  loggedIn: boolean
  depth?: number
}) {
  const [replyOpen, setReplyOpen] = useState(false)
  const children = replyMap.get(comment.id) ?? []

  return (
    <div className={`comment-item ${depth ? 'nested' : ''}`}>
      <div className={`avatar ${comment.author?.role === 'moderator' || comment.author?.role === 'admin' ? 'mod' : ''}`}>
        {comment.author?.username.slice(0, 2).toUpperCase() || '??'}
      </div>
      <div className="comment-main">
        <div className="comment-meta">
          {comment.author ? <Link href={`/u/${comment.author.username}`}><b>@{comment.author.username}</b></Link> : <b>Unbekannt</b>}
          {comment.author?.role === 'moderator' || comment.author?.role === 'admin' ? <span className="mod-pill">MOD</span> : null}
          <span>{formatRelativeTime(comment.created_at)}</span>
        </div>
        <p>{comment.body}</p>
        <div className="comment-actions">
          <CommentVote comment={comment} loggedIn={loggedIn} />
          <button type="button" onClick={() => setReplyOpen((value) => !value)}>Antworten</button>
          <ReportButton commentId={comment.id} loggedIn={loggedIn} />
        </div>
        {replyOpen && (loggedIn
          ? <CommentComposer caseId={caseId} parentId={comment.id} onDone={() => setReplyOpen(false)} />
          : <Link className="inline-login" href={`/login?next=/fall/${caseId}`}>Zum Antworten einloggen</Link>)}
        {children.length > 0 && (
          <div className="reply-list">
            {children.map((child) => (
              <CommentItem
                key={child.id}
                comment={child}
                replyMap={replyMap}
                caseId={caseId}
                loggedIn={loggedIn}
                depth={Math.min(depth + 1, 6)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CommentSection({
  caseId,
  comments,
  loggedIn,
  locked
}: {
  caseId: string
  comments: CommentData[]
  loggedIn: boolean
  locked: boolean
}) {
  const topLevel = useMemo(() => comments.filter((comment) => !comment.parent_id), [comments])
  const replyMap = useMemo(() => {
    const map: ReplyMap = new Map()
    for (const comment of comments) {
      if (!comment.parent_id) continue
      const list = map.get(comment.parent_id) ?? []
      list.push(comment)
      map.set(comment.parent_id, list)
    }
    return map
  }, [comments])

  return (
    <section className="discussion" id="diskussion">
      <div className="section-heading">
        <div><span>COMMUNITY DISCUSSION</span><h2>{comments.length} Kommentar{comments.length === 1 ? '' : 'e'}</h2></div>
      </div>

      {locked
        ? <div className="form-message error">Dieser Fall ist für neue Kommentare gesperrt.</div>
        : loggedIn
          ? <CommentComposer caseId={caseId} />
          : <div className="login-callout"><p>Du musst eingeloggt sein, um zu kommentieren.</p><Link className="solid" href={`/login?next=/fall/${caseId}`}>Einloggen</Link></div>}

      {topLevel.length
        ? <div className="comments-live">{topLevel.map((comment) => <CommentItem key={comment.id} comment={comment} replyMap={replyMap} caseId={caseId} loggedIn={loggedIn} />)}</div>
        : <div className="comment-empty">Noch keine Kommentare. Starte die sachliche Diskussion.</div>}
    </section>
  )
}
