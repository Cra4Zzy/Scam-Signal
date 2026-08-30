import Link from 'next/link'
import AuthForm from '@/components/AuthForm'
import { signUpAction } from '@/app/actions/auth'

export default function SignupPage() {
  return <main className="auth-page"><section className="auth-panel"><p className="modal-label">JOIN SCAMSIGNAL</p><h1>Account erstellen</h1><p>Dein Nutzername ist öffentlich. Deine E-Mail-Adresse bleibt privat und wird für Anmeldung sowie Sicherheitsfunktionen verwendet.</p><AuthForm mode="signup" action={signUpAction} /><div className="auth-links"><span>Schon registriert? <Link href="/login">Einloggen</Link></span></div></section></main>
}
