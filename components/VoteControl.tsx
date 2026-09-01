'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function VoteControl({ caseId, initialScore, initialVote, loggedIn, mode = 'rail' }: { caseId: string; initialScore: number; initialVote: -1 | 0 | 1; loggedIn: boolean; mode?: 'rail' | 'inline' }) {
  const [score, setScore] = useState(initialScore)
  const [vote, setVote] = useState<-1 | 0 | 1>(initialVote)
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  async function apply(nextVote: -1 | 1) {
    if (!loggedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`)
      return
    }
    if (busy) return
    setBusy(true)
    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) {
      setBusy(false)
      router.push(`/login?next=${encodeURIComponent(pathname)}`)
      return
    }

    const oldVote = vote
    const target: -1 | 0 | 1 = oldVote === nextVote ? 0 : nextVote
    setVote(target)
    setScore((s) => s + target - oldVote)

    let error = null
    if (target === 0) {
      const res = await supabase.from('case_votes').delete().eq('case_id', caseId).eq('user_id', auth.user.id)
      error = res.error
    } else {
      const res = await supabase.from('case_votes').upsert({ case_id: caseId, user_id: auth.user.id, value: target }, { onConflict: 'case_id,user_id' })
      error = res.error
    }

    if (error) {
      setVote(oldVote)
      setScore((s) => s - target + oldVote)
    }
    setBusy(false)
  }

  if (mode === 'inline') {
    return (
      <div className="vote-inline" aria-label="Beitrag bewerten">
        <button className={vote === 1 ? 'voted' : ''} disabled={busy} onClick={() => apply(1)} aria-label="Hilfreich"><span aria-hidden>♡</span><span>{vote === 1 ? 'Hilfreich' : 'Hilfreich'}</span></button>
        <b>{score}</b>
        <button className={vote === -1 ? 'voted down-voted' : ''} disabled={busy} onClick={() => apply(-1)} aria-label="Nicht hilfreich">−</button>
      </div>
    )
  }

  return (
    <aside className="vote-box vote-rail" aria-label="Abstimmung">
      <button className={vote === 1 ? 'voted' : ''} disabled={busy} onClick={() => apply(1)} aria-label="Upvote">▲</button>
      <b>{score}</b>
      <button className={vote === -1 ? 'voted down-voted' : ''} disabled={busy} onClick={() => apply(-1)} aria-label="Downvote">▼</button>
    </aside>
  )
}
