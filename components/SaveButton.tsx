'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SaveButton({ caseId, initialSaved, loggedIn }: { caseId: string; initialSaved: boolean; loggedIn: boolean }) {
  const [saved, setSaved] = useState(initialSaved)
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  async function toggle() {
    if (!loggedIn) return router.push(`/login?next=${encodeURIComponent(pathname)}`)
    if (busy) return
    setBusy(true)
    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) { setBusy(false); return router.push('/login') }
    const next = !saved
    setSaved(next)
    const result = next
      ? await supabase.from('saved_cases').insert({ case_id: caseId, user_id: auth.user.id })
      : await supabase.from('saved_cases').delete().eq('case_id', caseId).eq('user_id', auth.user.id)
    if (result.error) setSaved(!next)
    setBusy(false)
  }

  return <button disabled={busy} onClick={toggle}>{saved ? '★ Gespeichert' : '☆ Speichern'}</button>
}
