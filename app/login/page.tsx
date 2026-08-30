import Link from 'next/link'
import AuthForm from '@/components/AuthForm'
import { signInAction } from '@/app/actions/auth'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const sp = await searchParams
  return <main className="auth-page"><section className="auth-panel"><p className="modal-label">WELCOME BACK</p><h1>Einloggen</h1><p>Kommentiere, stimme ab und verwalte deine eigenen Scam-Meldungen.</p>{sp.error && <div className="form-message error">Der Bestätigungslink konnte nicht verarbeitet werden.</div>}<AuthForm mode="login" action={signInAction} next={sp.next || '/'} /><div className="auth-links"><Link href="/passwort-vergessen">Passwort vergessen?</Link><span>Noch kein Account? <Link href="/registrieren">Registrieren</Link></span></div></section></main>
}
