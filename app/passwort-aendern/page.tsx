import { redirect } from 'next/navigation'
import AuthForm from '@/components/AuthForm'
import { updatePasswordAction } from '@/app/actions/auth'
import { getViewer } from '@/lib/data'

export default async function ChangePasswordPage() {
  const viewer = await getViewer()
  if (!viewer) redirect('/login')
  return <main className="auth-page"><section className="auth-panel"><p className="modal-label">SECURITY</p><h1>Neues Passwort</h1><p>Verwende ein einzigartiges Passwort, das du nirgendwo sonst nutzt.</p><AuthForm mode="change" action={updatePasswordAction} /></section></main>
}
