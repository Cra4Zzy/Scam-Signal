'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ProfileForm({ profile }: { profile: { username: string; display_name: string | null; bio?: string | null } }) {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true); setMessage('')
    const form = new FormData(event.currentTarget)
    const username = String(form.get('username') || '').trim()
    const displayName = String(form.get('display_name') || '').trim()
    const bio = String(form.get('bio') || '').trim()
    if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) { setBusy(false); setMessage('Nutzername: 3–24 Zeichen, nur Buchstaben, Zahlen und Unterstrich.'); return }
    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) { setBusy(false); setMessage('Session abgelaufen. Bitte neu einloggen.'); return }
    const { error } = await supabase.from('profiles').update({ username, display_name: displayName || null, bio: bio || null }).eq('id', auth.user.id)
    setMessage(error ? (error.code === '23505' ? 'Dieser Nutzername ist bereits vergeben.' : error.message) : 'Profil gespeichert.')
    setBusy(false)
  }

  return <form className="profile-form" onSubmit={submit}><label>Nutzername<input name="username" defaultValue={profile.username} required minLength={3} maxLength={24} /></label><label>Anzeigename<input name="display_name" defaultValue={profile.display_name || ''} maxLength={80} /></label><label>Bio<textarea name="bio" defaultValue={profile.bio || ''} maxLength={500} rows={5} placeholder="Optional: Kurz etwas über dich oder deinen Recherche-Fokus." /></label>{message && <div className="form-message success">{message}</div>}<button className="solid" disabled={busy}>{busy ? 'Speichert …' : 'Profil speichern'}</button></form>
}
