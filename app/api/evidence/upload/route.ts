import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { createHash, randomUUID } from 'node:crypto'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const MAX = 10 * 1024 * 1024
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])

function isPdf(buffer: Buffer) {
  return buffer.length >= 5 && buffer.subarray(0, 5).toString('ascii') === '%PDF-'
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })

  const fd = await request.formData()
  const caseId = String(fd.get('caseId') || '')
  const file = fd.get('file')
  if (!caseId || !(file instanceof File)) return NextResponse.json({ error: 'Ungültiger Upload.' }, { status: 400 })
  if (!ALLOWED.has(file.type) || file.size <= 0 || file.size > MAX) return NextResponse.json({ error: 'Datei nicht erlaubt oder zu groß.' }, { status: 415 })

  const { data: row } = await supabase.from('cases').select('id,author_id').eq('id', caseId).maybeSingle()
  if (!row || row.author_id !== auth.user.id) return NextResponse.json({ error: 'Keine Berechtigung.' }, { status: 403 })

  try {
    const source = Buffer.from(await file.arrayBuffer())
    const admin = createAdminClient()

    let output: Buffer
    let mimeType: string
    let extension: string

    if (file.type === 'application/pdf') {
      if (!isPdf(source)) return NextResponse.json({ error: 'Ungültige PDF-Datei.' }, { status: 415 })
      output = source
      mimeType = 'application/pdf'
      extension = 'pdf'
    } else {
      output = await sharp(source, { failOn: 'error', limitInputPixels: 40000000 })
        .rotate()
        .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 86 })
        .toBuffer()
      mimeType = 'image/webp'
      extension = 'webp'
    }

    if (output.length > MAX) return NextResponse.json({ error: 'Verarbeitete Datei ist zu groß.' }, { status: 413 })

    const sha256 = createHash('sha256').update(output).digest('hex')
    const path = `${auth.user.id}/${caseId}/${randomUUID()}.${extension}`
    const { error: up } = await admin.storage.from('evidence').upload(path, output, {
      contentType: mimeType,
      cacheControl: '3600',
      upsert: false
    })
    if (up) throw up

    const { error: db } = await admin.from('case_evidence').insert({
      case_id: caseId,
      uploader_id: auth.user.id,
      storage_path: path,
      mime_type: mimeType,
      size_bytes: output.length,
      sha256,
      caption: file.name.slice(0, 500)
    })
    if (db) {
      await admin.storage.from('evidence').remove([path])
      throw db
    }

    return NextResponse.json({ ok: true, mimeType, size: output.length })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Upload fehlgeschlagen' }, { status: 500 })
  }
}
