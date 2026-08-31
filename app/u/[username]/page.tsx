import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getFeedCases, getProfileByUsername, getViewer } from '@/lib/data'
import { absoluteUrl, getPublicProfileMeta, safeJsonLd, seoDescription, SITE_NAME } from '@/lib/seo'
import CaseCard from '@/components/CaseCard'

export const dynamic = 'force-dynamic'

type Props={params:Promise<{username:string}>}

export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {username}=await params
  const profile=await getPublicProfileMeta(username)
  if(!profile){
    return {title:'Profil nicht gefunden',robots:{index:false,follow:false}}
  }
  const display=profile.display_name||`@${profile.username}`
  const description=seoDescription(profile.bio,`${display} auf ScamSignal · ${profile.caseCount} öffentliche Scam-Meldung${profile.caseCount===1?'':'en'}.`)
  const canonical=absoluteUrl(`/u/${encodeURIComponent(profile.username)}`)
  const index=profile.caseCount>0

  return {
    title:`${display} – Community-Profil`,
    description,
    alternates:{canonical},
    robots:{index,follow:true},
    openGraph:{type:'profile',url:canonical,title:`${display} | ${SITE_NAME}`,description,siteName:SITE_NAME,locale:'de_DE'},
    twitter:{card:'summary',title:`${display} | ${SITE_NAME}`,description}
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const [profile, viewer] = await Promise.all([getProfileByUsername(username), getViewer()])
  if (!profile) notFound()
  const feed = await getFeedCases({ viewerId: viewer?.id, authorId: profile.id })
  const own = feed.items
  const canonical=absoluteUrl(`/u/${encodeURIComponent(profile.username)}`)

  const profileJsonLd={
    '@context':'https://schema.org',
    '@type':'ProfilePage',
    '@id':`${canonical}#profile`,
    url:canonical,
    dateCreated:profile.created_at,
    mainEntity:{
      '@type':'Person',
      name:profile.display_name||profile.username,
      alternateName:`@${profile.username}`,
      description:profile.bio||undefined,
      url:canonical,
      interactionStatistic:{
        '@type':'InteractionCounter',
        interactionType:'https://schema.org/WriteAction',
        userInteractionCount:own.length
      }
    }
  }

  const breadcrumbJsonLd={
    '@context':'https://schema.org',
    '@type':'BreadcrumbList',
    itemListElement:[
      {'@type':'ListItem',position:1,name:'ScamSignal',item:absoluteUrl('/')},
      {'@type':'ListItem',position:2,name:'Community-Profil',item:canonical}
    ]
  }

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(profileJsonLd)}}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(breadcrumbJsonLd)}}/>
    <main className="content-page"><section className="profile-hero"><div className="avatar profile-avatar">{profile.username.slice(0,2).toUpperCase()}</div><div><p className="modal-label">COMMUNITY PROFILE</p><h1>@{profile.username}</h1>{profile.display_name && <p>{profile.display_name}</p>}<div className="profile-stats"><span>{profile.reputation} Reputation</span><span>{profile.role}</span></div></div></section>{profile.bio && <section className="settings-card profile-bio"><h2>Über</h2><p>{profile.bio}</p></section>}<section className="profile-cases"><div className="section-heading"><div><span>PUBLIC REPORTS</span><h2>Veröffentlichte Fälle</h2></div></div>{own.length ? own.map((item) => <CaseCard key={item.id} item={item} loggedIn={Boolean(viewer)} canDelete={Boolean(viewer&&(viewer.id===item.author_id||viewer.role==='admin'||viewer.role==='moderator'))}/>) : <div className="empty-state"><h2>Keine öffentlichen Fälle.</h2></div>}</section></main>
  </>
}
