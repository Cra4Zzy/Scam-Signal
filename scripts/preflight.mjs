import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const text = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const equals = line.indexOf('=')
    if (equals <= 0) continue

    const key = line.slice(0, equals).trim()
    let value = line.slice(equals + 1).trim()

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    if (!process.env[key]) process.env[key] = value
  }
}

function fail(message) {
  console.error(`\n❌ ScamSignal Preflight: ${message}\n`)
  process.exit(1)
}

loadEnvFile(path.join(process.cwd(), '.env.local'))

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
const secret = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim()

if (!url || /DEIN-|YOUR_|REPLACE_ME/i.test(url)) {
  fail('NEXT_PUBLIC_SUPABASE_URL fehlt oder ist noch ein Platzhalter in .env.local.')
}

if (!publishable || /DEIN_|YOUR_|REPLACE_ME/i.test(publishable)) {
  fail('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY fehlt oder ist noch ein Platzhalter in .env.local.')
}

if (!secret || /DEIN_|YOUR_|REPLACE_ME/i.test(secret)) {
  fail('SUPABASE_SECRET_KEY fehlt in .env.local. Verwende den serverseitigen sb_secret_... Key aus Supabase. Alternativ wird SUPABASE_SERVICE_ROLE_KEY akzeptiert.')
}

try {
  new URL(url)
} catch {
  fail('NEXT_PUBLIC_SUPABASE_URL ist keine gültige URL.')
}

console.log('🔎 ScamSignal prüft die Supabase-Verbindung ...')

const publicClient = createClient(url, publishable, {
  auth: { persistSession: false, autoRefreshToken: false }
})

const { error: dbError } = await publicClient.from('categories').select('id').limit(1)
if (dbError) {
  fail(`Datenbank/Publishable-Key nicht bereit: ${dbError.message}`)
}

const adminClient = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false }
})

const { error: adminError } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1 })
if (adminError) {
  fail(`Server-Key ist nicht gültig oder hat keine Admin-Rechte: ${adminError.message}`)
}

const { data: bucket, error: bucketError } = await adminClient.storage.getBucket('evidence')
if (bucketError || !bucket) {
  fail(`Der private Storage-Bucket "evidence" fehlt oder ist nicht erreichbar: ${bucketError?.message || 'Bucket nicht gefunden'}`)
}

if (bucket.public) {
  fail('Der Storage-Bucket "evidence" ist öffentlich. Er muss privat sein.')
}

console.log('✅ Datenbank verbunden')
console.log('✅ Auth Admin verbunden')
console.log('✅ Evidence Storage bereit')
console.log('✅ Lokale Registrierung ist bereit\n')
