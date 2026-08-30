'use client'

import { FormEvent, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { normalizeIndicator } from '@/lib/utils'
import type { Category } from '@/lib/types'

type IndicatorDraft = { type: string; value: string }
const MAX_FILES = 8
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])

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

  function selectFiles(nextFiles: File[]) {
    const sliced = nextFiles.slice(0, MAX_FILES)
    setFiles(sliced)
    if (nextFiles.length > MAX_FILES) setMessage(`Maximal ${MAX_FILES} Beweisdateien pro Fall.`)
    else if (sliced.some((f) => !ACCEPTED.has(f.type))) setMessage('Erlaubt sind JPG, PNG, WebP und PDF.')
    else if (sliced.some((f) => f.size > MAX_FILE_SIZE)) setMessage('Jede Beweisdatei darf maximal 10 MB groß sein.')
    else setMessage('')
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index))
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
    if (files.length > MAX_FILES) {
      setBusy(false)
      setMessage(`Maximal ${MAX_FILES} Beweisdateien pro Veröffentlichung.`)
      return
    }
    if (files.some((f) => !ACCEPTED.has(f.type))) {
      setBusy(false)
      setMessage('Erlaubt sind JPG, PNG, WebP und PDF.')
      return
    }
    if (files.some((f) => f.size > MAX_FILE_SIZE)) {
      setBusy(false)
      setMessage('Jede Beweisdatei darf maximal 10 MB groß sein.')
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

      <section className="upload-box evidence-upload-box">
        <div className="evidence-upload-head">
          <div><b>Beweise & Dokumente</b><span>Screenshots, Bilder oder PDF-Berichte. Dateien werden privat gespeichert und nur über kurzlebige, signierte Links ausgeliefert.</span></div>
          <span className="evidence-file-limit">JPG · PNG · WEBP · PDF</span>
        </div>
        <label className="evidence-dropzone">
          <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf,.pdf" multiple onChange={(e) => selectFiles(Array.from(e.target.files || []))} />
          <strong>＋ Dateien auswählen</strong>
          <small>Max. {MAX_FILES} Dateien · max. 10 MB je Datei</small>
        </label>
        {files.length > 0 && <div className="evidence-file-list">{files.map((file, index) => <div className="evidence-file-row" key={`${file.name}-${file.lastModified}-${index}`}><span className={`evidence-file-icon ${file.type === 'application/pdf' ? 'pdf' : 'image'}`}>{file.type === 'application/pdf' ? 'PDF' : 'IMG'}</span><div><b>{file.name}</b><small>{(file.size / 1024 / 1024).toFixed(2)} MB · {file.type === 'application/pdf' ? 'Dokument' : 'Bild'}</small></div><button type="button" onClick={() => removeFile(index)} aria-label={`${file.name} entfernen`}>×</button></div>)}</div>}
        {files.length > 0 && <small className="evidence-total">{files.length} Datei(en) · {(totalSize / 1024 / 1024).toFixed(1)} MB gesamt</small>}
        <p className="evidence-security-note"><b>Datenschutz:</b> Bilder werden serverseitig neu encodiert und EXIF-Metadaten entfernt. PDFs werden auf eine gültige PDF-Signatur geprüft. Bitte schwärze trotzdem unnötige personenbezogene Daten vor dem Upload.</p>
      </section>

      <label className="check-row"><input type="checkbox" required /><span>Ich bestätige, dass ich keine privaten Adressen, Zugangsdaten oder unnötigen personenbezogenen Daten veröffentliche und meine Aussagen sachlich formuliere.</span></label>
      {message && <div className="form-message error">{message}</div>}
      <button className="solid submit-case" disabled={busy} type="submit">{busy ? 'Fall & Beweise werden gespeichert …' : 'Fall veröffentlichen'}</button>
    </form>
  )
}
