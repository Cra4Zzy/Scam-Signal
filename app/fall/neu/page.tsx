import { redirect } from 'next/navigation'
import NewCaseForm from '@/components/NewCaseForm'
import { getCategories, getViewer } from '@/lib/data'

export default async function NewCasePage() {
  const viewer = await getViewer()
  if (!viewer) redirect('/login?next=/fall/neu')
  const categories = await getCategories()
  return <main className="content-page"><section className="page-head"><p className="modal-label">NEW COMMUNITY REPORT</p><h1>Fall veröffentlichen</h1><p>Dokumentiere nachvollziehbar, was passiert ist. Ein neuer Fall startet als <b>„Gemeldet“</b> und ist keine automatische Scam-Feststellung.</p></section><NewCaseForm categories={categories} /></main>
}
