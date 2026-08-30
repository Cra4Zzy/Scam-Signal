'use client'

import { FormEvent, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { normalizeIndicator } from '@/lib/utils'
import type { Category } from '@/lib/types'

type IndicatorDraft = { type: string; value: string }

export default function NewCaseForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [indicators, setIndicators] = useState<IndicatorDraft[]>([{ type: 'url', value: '' }])
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const totalSize = useMemo(() => files.reduce((sum, f) => sum + f.size, 0), [files])

  function addIndicator() {
    if (indicators.length >= 10) return
    setIndicators((x) => [...x, { type: 'domain', value: '' }])
  }

  function setIndicator(index: number, patch: Partial<IndicatorDraft>) {
    setIndicators((current) => current.map((item, i) => i === index ? { ...item, ...patch } : item))
  }

  function removeIndicator(index: number) {
    setIndicators((current) => current.filter((_, i) => i !== index))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setMessage('')

    const form = new FormData(event.currentTarget)
    const title = String(form.get('title') || '').trim()
    const summary = String(form.get('summary') || '').trim()
    const body = String(form.get('body') || '').trim()
    const category = String(form.get('category') || 'other')

    if (title.length < 8 || body.length < 20) {
      setBusy(false)
      setMessage('Titel und Fallbeschreibung sind noch zu kurz.')
      return
    }
    if (files.length > 8) {
      setBusy(false)
      setMessage('Maximal 8 Bilder pro Veröffentlichung.')
      return
    }
    if (files.some((f) => f.size > 4 * 1024 * 1024)) {
      setBusy(false)
      setMessage('Jedes Bild darf maximal 4 MB groß sein.')
      return
    }

    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) {
      setBusy(false)
      router.push('/login?next=/fall/neu')
      return
    }

    const { data: caseRow, error: caseError } = await supabase
      .from('cases')
      .insert({ author_id: auth.user.id, title, summary: summary || null, body, category })
      .select('id')
      .single()

    if (caseError || !caseRow) {
      setBusy(false)
      setMessage(caseError?.message || 'Fall konnte nicht gespeichert werden.')
      return
    }

    const cleanIndicators = indicators
      .map((i) => ({ ...i, value: i.value.trim() }))
      .filter((i) => i.value)
      .map((i) => ({
        case_id: caseRow.id,
        added_by: auth.user!.id,
        indicator_type: i.type,
        value: i.value,
        normalized_value: normalizeIndicator(i.type, i.value)
      }))

    if (cleanIndicators.length) {
      const { error } = await supabase.from('case_indicators').insert(cleanIndicators)
      if (error) setMessage(`Fall gespeichert, aber ein Indikator konnte nicht gespeichert werden: ${error.message}`)
    }

    let uploadFailed = false
    for (const file of files) {
      const payload = new FormData()
      payload.set('caseId', caseRow.id)
      payload.set('file', file)
      const response = await fetch('/api/evidence/upload', { method: 'POST', body: payload })
      if (!response.ok) uploadFailed = true
    }

    router.push(`/fall/${caseRow.id}${uploadFailed ? '?upload=failed' : ''}`)
    router.refresh()
  }

  return (
    <form className="case-form" onSubmit={submit}>
      <div className="form-grid">
        <label>Kategorie<select name="category" required>{categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
        <label>Titel<input name="title" required minLength={8} maxLength={180} placeholder="Kurz und sachlich: Was ist passiert?" /></label>
      </div>
      <label>Kurzfassung<input name="summary" maxLength={500} placeholder="Optional: die wichtigsten Punkte in 1–2 Sätzen" /></label>
      <label>Fallbeschreibung<textarea name="body" required minLength={20} maxLength={20000} rows={10} placeholder="Chronologisch erklären. Trenne eigene Beobachtungen, Aussagen Dritter und Vermutungen voneinander." /></label>

      <section className="form-section">
        <div className="form-section-head"><div><b>Indikatoren</b><span>Verdächtige Domains, Links, Wallets, Telefonnummern oder Accounts.</span></div><button type="button" className="ghost" onClick={addIndicator}>+ Indikator</button></div>
        {indicators.map((indicator, index) => <div className="indicator-row" key={index}><select value={indicator.type} onChange={(e) => setIndicator(index, { type: e.target.value })}><option value="url">URL</option><option value="domain">Domain</option><option value="wallet">Wallet</option><option value="phone">Telefon</option><option value="email">E-Mail</option><option value="social_account">Social Account</option><option value="username">Nutzername</option><option value="other">Sonstiges</option></select><input value={indicator.value} maxLength={2048} onChange={(e) => setIndicator(index, { value: e.target.value })} placeholder="Wert eingeben" /><button type="button" onClick={() => removeIndicator(index)} aria-label="Entfernen">×</button></div>)}
      </section>

      <section className="upload-box">
        <b>Beweisbilder / Screenshots</b>
        <span>JPEG, PNG oder WebP · max. 8 Dateien · max. 4 MB pro Datei. Bilder werden serverseitig neu encodiert und ohne EXIF-Metadaten gespeichert.</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 8))} />
        {files.length > 0 && <small>{files.length} Datei(en) · {(totalSize / 1024 / 1024).toFixed(1)} MB gesamt</small>}
      </section>

      <label className="check-row"><input type="checkbox" required /><span>Ich bestätige, dass ich keine privaten Adressen, Zugangsdaten oder unnötigen personenbezogenen Daten veröffentliche und meine Aussagen sachlich formuliere.</span></label>
      {message && <div className="form-message error">{message}</div>}
      <button className="solid submit-case" disabled={busy} type="submit">{busy ? 'Fall wird gespeichert …' : 'Fall veröffentlichen'}</button>
    </form>
  )
}
