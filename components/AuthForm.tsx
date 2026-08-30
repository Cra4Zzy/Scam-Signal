'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import type { AuthState } from '@/app/actions/auth'

type Action = (state: AuthState, formData: FormData) => Promise<AuthState>

export default function AuthForm({
  mode,
  action,
  next = '/'
}: {
  mode: 'login' | 'signup' | 'reset' | 'change'
  action: Action
  next?: string
}) {
  const [state, formAction, pending] = useActionState(action, {})

  return (
    <form action={formAction} className="auth-form">
      {mode === 'signup' && (
        <label>
          Nutzername
          <input
            name="username"
            required
            minLength={3}
            maxLength={24}
            pattern="[A-Za-z0-9_]+"
            title="3–24 Zeichen: Buchstaben, Zahlen oder Unterstrich"
            autoComplete="username"
          />
        </label>
      )}

      {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
        <label>
          E-Mail
          <input name="email" type="email" required autoComplete="email" />
        </label>
      )}

      {(mode === 'login' || mode === 'signup' || mode === 'change') && (
        <label>
          Passwort
          <input
            name="password"
            type="password"
            required
            minLength={10}
            maxLength={128}
            pattern={mode === 'login' ? undefined : '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{10,128}'}
            title={mode === 'login' ? undefined : 'Mindestens 10 Zeichen mit Groß-/Kleinbuchstaben, Zahl und Sonderzeichen'}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          {(mode === 'signup' || mode === 'change') && (
            <span className="field-hint">Mind. 10 Zeichen · Groß/Klein · Zahl · Sonderzeichen</span>
          )}
        </label>
      )}

      {mode === 'change' && (
        <label>
          Passwort wiederholen
          <input name="repeat" type="password" required minLength={10} maxLength={128} autoComplete="new-password" />
        </label>
      )}

      {mode === 'login' && <input type="hidden" name="next" value={next} />}

      {mode === 'signup' && (
        <label className="check-row">
          <input type="checkbox" name="accepted" required />
          <span>
            Ich akzeptiere die <Link href="/nutzungsbedingungen">Nutzungsbedingungen</Link> und{' '}
            <Link href="/community-richtlinien">Community-Richtlinien</Link>.
          </span>
        </label>
      )}

      {state.error && <div className="form-message error">{state.error}</div>}
      {state.success && <div className="form-message success">{state.success}</div>}

      <button className="solid wide" disabled={pending} type="submit">
        {pending
          ? 'Bitte warten …'
          : mode === 'login'
            ? 'Einloggen'
            : mode === 'signup'
              ? 'Account erstellen'
              : mode === 'reset'
                ? 'Reset-Link senden'
                : 'Passwort ändern'}
      </button>
    </form>
  )
}
