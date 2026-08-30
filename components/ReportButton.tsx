'use client'

import { useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = { caseId?: string; commentId?: string; profileId?: string; loggedIn: boolean }

export default function ReportButton({ caseId, commentId, profileId, loggedIn }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  function open() {
    if (!loggedIn) return router.push(`/login?next=${encodeURIComponent(pathname)}`)
    setMessage('')
    dialog.current?.showModal()
  }

  async function submit(formData: FormData) {
    setBusy(true)
    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) { setBusy(false); return router.push('/login') }
    const reason = String(formData.get('reason') || 'other')
    const details = String(formData.get('details') || '').trim() || null
    const { error } = await supabase.from('reports').insert({
      reporter_id: auth.user.id,
      case_id: caseId ?? null,
      comment_id: commentId ?? null,
      profile_id: profileId ?? null,
      reason,
      details
    })
    setBusy(false)
    if (error) setMessage('Meldung konnte nicht gespeichert werden.')
    else {
      setMessage('Meldung wurde gespeichert und kann von der Moderation geprüft werden.')
      setTimeout(() => dialog.current?.close(), 1200)
    }
  }

  return (
    <>
      <button className="danger" onClick={open}>⚑ Melden</button>
      <dialog ref={dialog} className="native-dialog">
        <button className="dialog-close" onClick={() => dialog.current?.close()}>×</button>
        <p className="modal-label">CONTENT REPORT</p>
        <h2>Inhalt melden</h2>
        <p>Nutze dieses Formular für Regelverstöße oder möglicherweise rechtswidrige Inhalte. Keine Diskussion über den Fall selbst.</p>
        <form action={submit} className="dialog-form">
          <label>Grund<select name="reason" required><option value="illegal_content">Möglicherweise rechtswidriger Inhalt</option><option value="personal_data">Private / personenbezogene Daten</option><option value="harassment">Belästigung / Drohung</option><option value="defamation">Mögliche falsche Tatsachenbehauptung</option><option value="spam">Spam</option><option value="misinformation">Irreführende Information</option><option value="impersonation">Identitätsvortäuschung</option><option value="other">Sonstiges</option></select></label>
          <label>Details<textarea name="details" rows={4} maxLength={2000} placeholder="Warum sollte die Moderation diesen Inhalt prüfen?" /></label>
          {message && <div className="form-message success">{message}</div>}
          <button className="solid" disabled={busy}>{busy ? 'Wird gesendet …' : 'Meldung senden'}</button>
        </form>
      </dialog>
    </>
  )
}
