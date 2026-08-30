'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteCaseButton({ caseId }: { caseId: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function removeCase() {
    const confirmed = window.confirm(
      'Diesen Fall wirklich endgültig löschen?\n\nDer Beitrag, Kommentare, Votes, Indikatoren und alle hochgeladenen Beweisdateien werden entfernt. Diese Aktion kann nicht rückgängig gemacht werden.'
    )
    if (!confirmed || busy) return

    setBusy(true)
    setError('')

    try {
      const response = await fetch(`/api/cases/${encodeURIComponent(caseId)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.error || 'Fall konnte nicht gelöscht werden.')

      router.replace('/')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fall konnte nicht gelöscht werden.')
      setBusy(false)
    }
  }

  return (
    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--ss-line)' }}>
      <button className="danger" type="button" onClick={removeCase} disabled={busy}>
        {busy ? 'Wird gelöscht …' : 'Fall löschen'}
      </button>
      {error && <p style={{ margin: '8px 0 0', color: '#b4232e', fontSize: 11, lineHeight: 1.45 }}>{error}</p>}
    </div>
  )
}
