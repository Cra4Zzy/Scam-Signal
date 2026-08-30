import AuthForm from '@/components/AuthForm'
import { resetPasswordAction } from '@/app/actions/auth'

export default function ForgotPage() {
  return <main className="auth-page"><section className="auth-panel"><p className="modal-label">ACCOUNT RECOVERY</p><h1>Passwort zurücksetzen</h1><p>Wir senden einen sicheren Reset-Link an die hinterlegte Adresse. Die Antwort verrät nicht, ob ein Account existiert.</p><AuthForm mode="reset" action={resetPasswordAction} /></section></main>
}
