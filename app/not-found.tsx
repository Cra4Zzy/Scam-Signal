import Link from 'next/link'

export default function NotFound() {
  return <main className="auth-page"><section className="auth-panel"><p className="modal-label">404 / SIGNAL LOST</p><h1>Nicht gefunden</h1><p>Der Fall oder die Seite existiert nicht, wurde entfernt oder ist für deinen Account nicht sichtbar.</p><Link className="solid wide" href="/">Zurück zum Feed</Link></section></main>
}
