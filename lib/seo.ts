import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const SITE_NAME = 'ScamSignal'

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://scam-signal.com').replace(/\/+$/, '')
}

export function absoluteUrl(path = '/') {
  const base = getSiteUrl()
  if (!path || path === '/') return `${base}/`
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function seoDescription(value: string | null | undefined, fallback: string) {
  const text = (value || fallback).replace(/\s+/g, ' ').trim()
  if (text.length <= 158) return text
  return `${text.slice(0, 155).trimEnd()}…`
}

export function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null
  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  })
}

export type PublicCaseMeta = {
  id: string
  title: string
  summary: string | null
  body: string
  category: string
  categoryLabel: string
  status: string
  visibility: string
  created_at: string
  updated_at: string
  author: { username: string; display_name: string | null } | null
}

export async function getPublicCaseMeta(id: string): Promise<PublicCaseMeta | null> {
  const supabase = publicClient()
  if (!supabase) return null

  const { data: item } = await supabase
    .from('cases')
    .select('id,title,summary,body,category,status,visibility,created_at,updated_at,author_id')
    .eq('id', id)
    .eq('visibility', 'visible')
    .maybeSingle()

  if (!item) return null

  const [categoryRes, profileRes] = await Promise.all([
    supabase.from('categories').select('label').eq('id', item.category).maybeSingle(),
    supabase.from('profiles').select('username,display_name').eq('id', item.author_id).maybeSingle()
  ])

  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    body: item.body,
    category: item.category,
    categoryLabel: categoryRes.data?.label || item.category,
    status: item.status,
    visibility: item.visibility,
    created_at: item.created_at,
    updated_at: item.updated_at,
    author: profileRes.data
      ? { username: profileRes.data.username, display_name: profileRes.data.display_name }
      : null
  }
}

export type PublicProfileMeta = {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  role: string
  reputation: number
  created_at: string
  caseCount: number
}

export async function getPublicProfileMeta(username: string): Promise<PublicProfileMeta | null> {
  const supabase = publicClient()
  if (!supabase) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id,username,display_name,bio,role,reputation,created_at')
    .eq('username', username)
    .maybeSingle()

  if (!profile) return null

  const { count } = await supabase
    .from('cases')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', profile.id)
    .eq('visibility', 'visible')

  return { ...profile, reputation: Number(profile.reputation || 0), caseCount: count || 0 }
}

export async function getSitemapData() {
  const supabase = publicClient()
  if (!supabase) return { cases: [] as Array<{ id: string; updated_at: string; author_id: string }>, profiles: [] as Array<{ username: string; created_at: string }> }

  const { data: cases } = await supabase
    .from('cases')
    .select('id,updated_at,author_id')
    .eq('visibility', 'visible')
    .order('updated_at', { ascending: false })
    .limit(10000)

  const rows = cases || []
  const authorIds = [...new Set(rows.map((item) => item.author_id))]

  if (!authorIds.length) return { cases: rows, profiles: [] }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('username,created_at,id')
    .in('id', authorIds)

  return {
    cases: rows,
    profiles: (profiles || []).map(({ username, created_at }) => ({ username, created_at }))
  }
}
