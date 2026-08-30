import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileForm from '@/components/ProfileForm'
import CaseCard from '@/components/CaseCard'
import { getFeedCases,getViewer,getViewerCommunityStats } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
export const dynamic='force-dynamic'
export default async function ProfilePage(){const viewer=await getViewer();if(!viewer)redirect('/login?next=/profil');const supabase=await createClient();const {data:profile}=await supabase.from('profiles').select('username,display_name,bio').eq('id',viewer.id).single();const [feed,stats]=await Promise.all([getFeedCases({viewerId:viewer.id,authorId:viewer.id}),getViewerCommunityStats(viewer.id)]);return <main className="content-page"><section className="profile-hero"><div className="avatar profile-avatar">{viewer.username.slice(0,2).toUpperCase()}</div><div><p className="modal-label">MY SCAMSIGNAL</p><h1>@{viewer.username}</h1><div className="profile-stats"><span>{viewer.reputation} Reputation</span><span>{viewer.role}</span><span>{stats.cases} Fälle</span></div></div></section><ProfileForm profile={{username:profile?.username||viewer.username,display_name:profile?.display_name||null,bio:profile?.bio||null}}/><section style={{marginTop:28}}><div className="page-head"><h1>Deine Veröffentlichungen</h1></div>{feed.items.length?feed.items.map(i=><CaseCard key={i.id} item={i} loggedIn/>):<div className="empty-state"><h2>Noch nichts veröffentlicht.</h2><Link className="solid" href="/fall/neu">Ersten Fall melden</Link></div>}</section></main>}
