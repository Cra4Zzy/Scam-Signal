import { notFound } from 'next/navigation'
import { getFeedCases, getProfileByUsername, getViewer } from '@/lib/data'
import CaseCard from '@/components/CaseCard'

export const dynamic = 'force-dynamic'

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const [profile, viewer] = await Promise.all([getProfileByUsername(username), getViewer()])
  if (!profile) notFound()
  const feed = await getFeedCases({ viewerId: viewer?.id, authorId: profile.id })
  const own = feed.items
  return <main className="content-page"><section className="profile-hero"><div className="avatar profile-avatar">{profile.username.slice(0,2).toUpperCase()}</div><div><p className="modal-label">COMMUNITY PROFILE</p><h1>@{profile.username}</h1>{profile.display_name && <p>{profile.display_name}</p>}<div className="profile-stats"><span>{profile.reputation} Reputation</span><span>{profile.role}</span></div></div></section>{profile.bio && <section className="settings-card profile-bio"><h2>Über</h2><p>{profile.bio}</p></section>}<section className="profile-cases"><div className="section-heading"><div><span>PUBLIC REPORTS</span><h2>Veröffentlichte Fälle</h2></div></div>{own.length ? own.map((item) => <CaseCard key={item.id} item={item} loggedIn={Boolean(viewer)} />) : <div className="empty-state"><h2>Keine öffentlichen Fälle.</h2></div>}</section></main>
}
