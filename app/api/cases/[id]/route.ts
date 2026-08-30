import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()

  if (!auth.user) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', auth.user.id)
    .maybeSingle()

  const { data: item } = await supabase
    .from('cases')
    .select('id,author_id')
    .eq('id', id)
    .maybeSingle()

  if (!item) return NextResponse.json({ error: 'Fall nicht gefunden.' }, { status: 404 })

  const isStaff = profile?.role === 'admin' || profile?.role === 'moderator'
  if (item.author_id !== auth.user.id && !isStaff) {
    return NextResponse.json({ error: 'Keine Berechtigung zum Löschen dieses Falls.' }, { status: 403 })
  }

  try {
    const admin = createAdminClient()
    const { data: evidence, error: evidenceError } = await admin
      .from('case_evidence')
      .select('storage_path')
      .eq('case_id', id)

    if (evidenceError) throw evidenceError

    const paths = (evidence ?? []).map((row) => row.storage_path).filter(Boolean)
    if (paths.length) {
      const { error: storageError } = await admin.storage.from('evidence').remove(paths)
      if (storageError) throw storageError
    }

    const { error: deleteError } = await admin.from('cases').delete().eq('id', id)
    if (deleteError) throw deleteError

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Fall konnte nicht gelöscht werden.' },
      { status: 500 }
    )
  }
}
