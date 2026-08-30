'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient, getSupabaseAdminKey } from '@/lib/supabase/admin'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export type AuthState = { error?: string; success?: string }

const USERNAME_RE = /^[A-Za-z0-9_]{3,24}$/
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,128}$/

function normalizeEmail(value: FormDataEntryValue | null) { return String(value || '').trim().toLowerCase() }
function getSiteUrl() { return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '') }
async function isLocalDevelopmentRequest() { if (process.env.NODE_ENV === 'production') return false; const requestHeaders = await headers(); const host = (requestHeaders.get('host') || '').split(',')[0].trim(); return /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(host) }
function authErrorMessage(message: string, local = false) { const value = message.toLowerCase(); if (value.includes('already') || value.includes('registered') || value.includes('exists')) return 'Für diese E-Mail-Adresse existiert bereits ein Account.'; if (value.includes('email') && value.includes('not authorized')) return 'Der Supabase-Test-Maildienst blockiert diese Adresse.'; if (value.includes('rate limit') || value.includes('too many')) return 'Zu viele Anmeldeversuche in kurzer Zeit.'; if (value.includes('password')) return 'Das Passwort erfüllt die Sicherheitsanforderungen noch nicht.'; if (value.includes('database') || value.includes('saving new user')) return local ? `Supabase konnte den Benutzer nicht in der Datenbank anlegen. Technischer Hinweis: ${message}` : 'Der Account konnte in der Datenbank nicht vollständig angelegt werden.'; if (value.includes('invalid api key') || value.includes('jwt') || value.includes('unauthorized')) return 'Der Supabase Server-Key ist ungültig oder hat nicht die nötigen Rechte.'; return local ? `Registrierung fehlgeschlagen: ${message}` : 'Registrierung konnte nicht abgeschlossen werden. Bitte versuche es erneut.' }

async function findUserByEmail(email: string): Promise<User | null> { const admin = createAdminClient(); for (let page = 1; page <= 10; page += 1) { const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 }); if (error) throw error; const user = data.users.find((item) => item.email?.toLowerCase() === email); if (user) return user; if (data.users.length < 100) break } return null }

async function ensureLocalUser(email: string, password: string, username: string) {
  const admin = createAdminClient(); let user: User | null = null
  const { data: created, error: createError } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { username } })
  if (!createError && created.user) user = created.user
  else { const message = createError?.message || 'Unknown create user error'; const duplicate = /already|registered|exists/i.test(message); if (!duplicate) throw new Error(message); user = await findUserByEmail(email); if (!user) throw new Error(message); const { data: updated, error: updateError } = await admin.auth.admin.updateUserById(user.id, { password, email_confirm: true, user_metadata: { ...(user.user_metadata || {}), username } }); if (updateError) throw updateError; user = updated.user }
  const { data: usernameOwner, error: ownerError } = await admin.from('profiles').select('id').ilike('username', username).neq('id', user.id).limit(1).maybeSingle(); if (ownerError) throw ownerError; if (usernameOwner) throw new Error('USERNAME_TAKEN')
  const { error: profileError } = await admin.from('profiles').upsert({ id: user.id, username, role: 'member', reputation: 0 }, { onConflict: 'id' }); if (profileError) throw profileError
  return user
}

export async function signInAction(_: AuthState, formData: FormData): Promise<AuthState> { const email = normalizeEmail(formData.get('email')); const password = String(formData.get('password') || ''); if (!email || !password) return { error: 'Bitte E-Mail und Passwort eingeben.' }; const supabase = await createClient(); const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) { const message = error.message.toLowerCase(); if (message.includes('email not confirmed')) return { error: 'Bitte bestätige zuerst deine E-Mail-Adresse.' }; return { error: 'Anmeldung fehlgeschlagen. Bitte prüfe E-Mail und Passwort.' } } const next = String(formData.get('next') || '/'); redirect(next.startsWith('/') ? next : '/') }

export async function signUpAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const username = String(formData.get('username') || '').trim(); const email = normalizeEmail(formData.get('email')); const password = String(formData.get('password') || ''); const accepted = formData.get('accepted') === 'on'
  if (!USERNAME_RE.test(username)) return { error: 'Nutzername: 3–24 Zeichen, nur Buchstaben, Zahlen und Unterstrich.' }
  if (!email || !email.includes('@')) return { error: 'Bitte eine gültige E-Mail-Adresse eingeben.' }
  if (!PASSWORD_RE.test(password)) return { error: 'Passwort: mindestens 10 Zeichen sowie Großbuchstabe, Kleinbuchstabe, Zahl und Sonderzeichen.' }
  if (!accepted) return { error: 'Bitte Nutzungsbedingungen und Community-Richtlinien akzeptieren.' }
  const supabase = await createClient(); const local = await isLocalDevelopmentRequest()
  const { data: usernameOwner, error: usernameCheckError } = await supabase.from('profiles').select('id').ilike('username', username).limit(1).maybeSingle()
  if (usernameCheckError) return { error: authErrorMessage(usernameCheckError.message, local) }; if (usernameOwner) return { error: 'Dieser Nutzername ist bereits vergeben.' }
  if (local && getSupabaseAdminKey()) { try { await ensureLocalUser(email, password, username); const { error: loginError } = await supabase.auth.signInWithPassword({ email, password }); if (loginError) throw loginError } catch (error) { const message = error instanceof Error ? error.message : String(error); if (message === 'USERNAME_TAKEN') return { error: 'Dieser Nutzername ist bereits vergeben.' }; return { error: authErrorMessage(message, true) } } redirect('/profil?welcome=1') }
  const { error } = await supabase.auth.signUp({ email, password, options: { data: { username }, emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/profil` } })
  if (error) return { error: authErrorMessage(error.message, local) }
  return { success: local ? 'Account angelegt. Falls Supabase eine Bestätigung verlangt, öffne den Link in der E-Mail.' : 'Account angelegt. Bitte bestätige jetzt den Link in deiner E-Mail.' }
}

export async function signOutAction() { const supabase = await createClient(); await supabase.auth.signOut(); redirect('/') }
export async function resetPasswordAction(_: AuthState, formData: FormData): Promise<AuthState> { const email = normalizeEmail(formData.get('email')); if (!email) return { error: 'Bitte eine E-Mail-Adresse eingeben.' }; const supabase = await createClient(); await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${getSiteUrl()}/auth/callback?next=/passwort-aendern` }); return { success: 'Falls ein Account existiert, wurde eine E-Mail zum Zurücksetzen versendet.' } }
export async function updatePasswordAction(_: AuthState, formData: FormData): Promise<AuthState> { const password = String(formData.get('password') || ''); const repeat = String(formData.get('repeat') || ''); if (!PASSWORD_RE.test(password)) return { error: 'Passwort: mindestens 10 Zeichen sowie Großbuchstabe, Kleinbuchstabe, Zahl und Sonderzeichen.' }; if (password !== repeat) return { error: 'Die Passwörter stimmen nicht überein.' }; const supabase = await createClient(); const { error } = await supabase.auth.updateUser({ password }); if (error) return { error: 'Passwort konnte nicht geändert werden. Öffne den Reset-Link erneut.' }; return { success: 'Passwort wurde geändert. Du kannst ScamSignal jetzt weiter nutzen.' } }
