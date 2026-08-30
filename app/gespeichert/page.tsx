import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getFeedCases, getViewer } from '@/lib/data'
import CaseCard from '@/components/CaseCard'

export const dynamic = 'force-dynamic'

export default async function SavedPage() {
  const viewer = await getViewer()
  if (!viewer) redirect('/login?next=/gespeichert')
  const supabase = await createClient()
  const { data } = await supabase.from('saved_cases').select('case_id').eq('user_id', viewer.id).order('created_at', { ascending: false })
  const ids = (data ?? []).map((x) => x.case_id)
  const feed = ids.length ? await getFeedCases({ viewerId: viewer.id, ids }) : { items: [], hasMore: false }
  return <main className="content-page"><section className="page-head"><p className="modal-label">SAVED CASES</p><h1>Gespeicherte Fälle</h1><p>Diese Liste ist nur für deinen Account sichtbar.</p></section>{feed.items.length ? feed.items.map((item) => <CaseCard key={item.id} item={item} loggedIn />) : <div className="empty-state"><h2>Noch nichts gespeichert.</h2><p>Mit „☆ Speichern“ kannst du Fälle für später merken.</p></div>}</main>
}
