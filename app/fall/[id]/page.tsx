import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCaseDetail,getViewer } from '@/lib/data'
import VoteControl from '@/components/VoteControl'
import SaveButton from '@/components/SaveButton'
import ReportButton from '@/components/ReportButton'
import CommentSection from '@/components/CommentSection'
import CopyIndicator from '@/components/CopyIndicator'
import { formatRelativeTime,statusLabel } from '@/lib/utils'

export const dynamic='force-dynamic'

function formatBytes(bytes:number){
  if(bytes<1024)return `${bytes} B`
  if(bytes<1024*1024)return `${(bytes/1024).toFixed(1)} KB`
  return `${(bytes/1024/1024).toFixed(1)} MB`
}

export default async function CasePage({params}:{params:Promise<{id:string}>}){
  const {id}=await params
  const viewer=await getViewer()
  const item=await getCaseDetail(id,viewer?.id)
  if(!item)notFound()

  const images=item.evidence.filter((e)=>e.mime_type.startsWith('image/')&&e.signedUrl)
  const documents=item.evidence.filter((e)=>e.mime_type==='application/pdf'&&e.signedUrl)

  return <main className="case-page"><div className="case-layout"><div><article className="case-detail">
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
  <aside className="right-rail"><section className="side-card"><VoteControl caseId={item.id} initialScore={item.score} initialVote={item.userVote} loggedIn={Boolean(viewer)}/><SaveButton caseId={item.id} initialSaved={item.saved} loggedIn={Boolean(viewer)}/><ReportButton caseId={item.id} loggedIn={Boolean(viewer)}/></section>{item.author&&<section className="side-card"><div className="side-card-head">VERÖFFENTLICHT VON</div><h3>@{item.author.username}</h3><Link className="ghost" href={`/u/${item.author.username}`}>Profil ansehen</Link></section>}</aside></div></main>
}
