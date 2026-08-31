import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCaseDetail,getViewer } from '@/lib/data'
import { absoluteUrl, getPublicCaseMeta, safeJsonLd, seoDescription, SITE_NAME } from '@/lib/seo'
import VoteControl from '@/components/VoteControl'
import SaveButton from '@/components/SaveButton'
import ReportButton from '@/components/ReportButton'
import DeleteCaseButton from '@/components/DeleteCaseButton'
import CommentSection from '@/components/CommentSection'
import CopyIndicator from '@/components/CopyIndicator'
import { formatRelativeTime,statusLabel } from '@/lib/utils'

export const dynamic='force-dynamic'

type Props={params:Promise<{id:string}>}

export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {id}=await params
  const item=await getPublicCaseMeta(id)
  if(!item){
    return {title:'Fall nicht verfügbar',robots:{index:false,follow:false}}
  }

  const title=`${item.title} | ${SITE_NAME}`
  const description=seoDescription(item.summary||item.body,`Community-Meldung zu ${item.title} auf ScamSignal.`)
  const canonical=absoluteUrl(`/fall/${item.id}`)

  return {
    title:item.title,
    description,
    alternates:{canonical},
    robots:{index:true,follow:true},
    openGraph:{
      type:'article',
      url:canonical,
      title,
      description,
      siteName:SITE_NAME,
      publishedTime:item.created_at,
      modifiedTime:item.updated_at,
      authors:item.author?[item.author.display_name||item.author.username]:undefined,
      locale:'de_DE'
    },
    twitter:{card:'summary_large_image',title,description}
  }
}

function formatBytes(bytes:number){
  if(bytes<1024)return `${bytes} B`
  if(bytes<1024*1024)return `${(bytes/1024).toFixed(1)} KB`
  return `${(bytes/1024/1024).toFixed(1)} MB`
}

export default async function CasePage({params}:Props){
  const {id}=await params
  const viewer=await getViewer()
  const item=await getCaseDetail(id,viewer?.id)
  if(!item)notFound()

  const images=item.evidence.filter((e)=>e.mime_type.startsWith('image/')&&e.signedUrl)
  const documents=item.evidence.filter((e)=>e.mime_type==='application/pdf'&&e.signedUrl)
  const canDelete=Boolean(viewer&&(viewer.id===item.author_id||viewer.role==='admin'||viewer.role==='moderator'))
  const canonical=absoluteUrl(`/fall/${item.id}`)
  const authorUrl=item.author?absoluteUrl(`/u/${encodeURIComponent(item.author.username)}`):undefined

  const discussionJsonLd={
    '@context':'https://schema.org',
    '@type':'DiscussionForumPosting',
    '@id':`${canonical}#post`,
    url:canonical,
    headline:item.title,
    text:item.body,
    abstract:item.summary||undefined,
    datePublished:item.created_at,
    dateModified:item.updated_at,
    interactionStatistic:[
      {'@type':'InteractionCounter',interactionType:'https://schema.org/CommentAction',userInteractionCount:item.commentCount},
      {'@type':'InteractionCounter',interactionType:'https://schema.org/LikeAction',userInteractionCount:Math.max(0,item.score)}
    ],
    author:item.author?{
      '@type':'Person',
      name:item.author.display_name||item.author.username,
      alternateName:`@${item.author.username}`,
      url:authorUrl
    }:undefined,
    comment:item.comments.map((comment)=>({
      '@type':'Comment',
      text:comment.body,
      dateCreated:comment.created_at,
      author:comment.author?{
        '@type':'Person',
        name:comment.author.display_name||comment.author.username,
        alternateName:`@${comment.author.username}`,
        url:absoluteUrl(`/u/${encodeURIComponent(comment.author.username)}`)
      }:undefined
    }))
  }

  const breadcrumbJsonLd={
    '@context':'https://schema.org',
    '@type':'BreadcrumbList',
    itemListElement:[
      {'@type':'ListItem',position:1,name:'ScamSignal',item:absoluteUrl('/')},
      {'@type':'ListItem',position:2,name:item.categoryLabel,item:absoluteUrl(`/?category=${encodeURIComponent(item.category)}`)},
      {'@type':'ListItem',position:3,name:item.title,item:canonical}
    ]
  }

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(discussionJsonLd)}}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(breadcrumbJsonLd)}}/>
    <main className="case-page"><div className="case-layout"><div><article className="case-detail">
      <nav aria-label="Breadcrumb" style={{fontSize:11,color:'#7b7f83',marginBottom:18}}><Link href="/">Fälle</Link> <span aria-hidden="true">/</span> <Link href={`/?category=${encodeURIComponent(item.category)}`}>{item.categoryLabel}</Link> <span aria-hidden="true">/</span> <span>Fall</span></nav>
      <div className="post-meta"><span className="community-badge">{item.categoryLabel}</span><span>{formatRelativeTime(item.created_at)}</span><span className="status-inline">{statusLabel(item.status)}</span></div>
      <h1 className="case-title">{item.title}</h1>
      {item.summary&&<p style={{fontSize:18,fontWeight:650,color:'#435365'}}>{item.summary}</p>}
      <div className="case-body">{item.body}</div>

      {item.indicators.length>0&&<><h2>Indikatoren</h2><div className="indicator-list">{item.indicators.map(i=><div className="indicator-item" key={i.id}><span><b>{i.indicator_type}</b> · {i.value}</span><CopyIndicator value={i.value}/></div>)}</div></>}

      {item.evidence.length>0&&<section className="evidence-section"><div className="evidence-heading"><div><span className="modal-label">EVIDENCE</span><h2>Beweise & Dokumente</h2></div><span>{item.evidence.length} Datei{item.evidence.length===1?'':'en'}</span></div>
        {images.length>0&&<div className="evidence-grid">{images.map(e=><a className="evidence-image-link" key={e.id} href={e.signedUrl!} target="_blank" rel="noopener noreferrer"><img src={e.signedUrl!} alt={e.caption||'Beweisbild'}/><div><b>{e.caption||'Beweisbild'}</b><small>{formatBytes(e.size_bytes)}</small></div></a>)}</div>}
        {documents.length>0&&<div className="evidence-documents">{documents.map(e=><a className="evidence-document-card" key={e.id} href={e.signedUrl!} target="_blank" rel="noopener noreferrer"><span className="evidence-doc-icon">PDF</span><div className="evidence-doc-copy"><b>{e.caption||'PDF-Bericht'}</b><small>{formatBytes(e.size_bytes)} · Privater Beleg</small>{e.sha256&&<code>SHA-256 {e.sha256.slice(0,16)}…</code>}</div><span className="evidence-doc-open">Öffnen ↗</span></a>)}</div>}
      </section>}
    </article><CommentSection caseId={item.id} comments={item.comments} loggedIn={Boolean(viewer)} locked={item.is_locked}/></div>
    <aside className="right-rail"><section className="side-card"><VoteControl caseId={item.id} initialScore={item.score} initialVote={item.userVote} loggedIn={Boolean(viewer)}/><SaveButton caseId={item.id} initialSaved={item.saved} loggedIn={Boolean(viewer)}/><ReportButton caseId={item.id} loggedIn={Boolean(viewer)}/>{canDelete&&<DeleteCaseButton caseId={item.id}/>}</section>{item.author&&<section className="side-card"><div className="side-card-head">VERÖFFENTLICHT VON</div><h3>@{item.author.username}</h3><Link className="ghost" href={`/u/${item.author.username}`}>Profil ansehen</Link></section>}</aside></div></main>
  </>
}
