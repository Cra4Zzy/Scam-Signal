import { redirect } from 'next/navigation'
import { getViewer } from '@/lib/data'
export default async function ModerationPage(){const viewer=await getViewer();if(!viewer||!['admin','moderator'].includes(viewer.role))redirect('/');return <main className="content-page"><section className="page-head"><p className="modal-label">MODERATION</p><h1>Moderationsbereich</h1><p>Der Moderationsbereich ist aktiv. Fallprüfung und Audit-Workflows werden über die vorhandenen Supabase-Rollen und RLS abgesichert.</p></section></main>}
