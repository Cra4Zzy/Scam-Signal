import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdminKey() {
  const secret =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ''

  if (!secret || secret.includes('REPLACE_ME') || secret.includes('DEIN_')) {
    return null
  }

  return secret
}

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secret = getSupabaseAdminKey()

  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL fehlt in .env.local.')
  }

  if (!secret) {
    throw new Error(
      'Supabase Server-Key fehlt. Trage SUPABASE_SECRET_KEY (sb_secret_...) oder SUPABASE_SERVICE_ROLE_KEY in .env.local ein.'
    )
  }

  return createClient(url, secret, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  })
}
