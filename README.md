# ScamSignal

## Schnellstart

1. `.env.example` als `.env.local` kopieren und Supabase URL, Publishable Key und `SUPABASE_SECRET_KEY=sb_secret_...` eintragen.
2. `npm.cmd install`
3. `npm.cmd run dev`

Vor jedem lokalen Start prüft ScamSignal automatisch Datenbank, Admin-Key und den privaten `evidence`-Bucket. Wenn etwas falsch verbunden ist, startet die Website nicht mit einem versteckten Fehler, sondern zeigt die konkrete Ursache im Terminal.

Die lokale Registrierung bestätigt Testaccounts serverseitig, repariert bereits halb angelegte Testaccounts und loggt anschließend automatisch ein. In Produktion bleibt die normale E-Mail-Bestätigung aktiv.

Production-oriented Next.js + Supabase community website for public scam reports.

## Start locally

1. Copy `.env.example` to `.env.local`.
2. Enter your Supabase URL, publishable key and secret key.
3. Double-click `START_LOCAL.bat` or run:

```cmd
npm.cmd install
npm.cmd run dev
```

4. Open `http://localhost:3000`.
5. Open `http://localhost:3000/api/health`. `"ok": true` means the website can reach Supabase.

## Local registration

During local development only, registration is created server-side and immediately confirmed so Supabase's restricted development mailer cannot block testing. The user is then signed in normally with Supabase Auth.

In a production build this bypass is disabled automatically. Production registration uses the normal email-confirmation flow.

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SECRET_KEY=sb_secret_...
```

Never commit `.env.local` or expose `SUPABASE_SECRET_KEY` in browser code.

## Database

The project expects the ScamSignal schema already created in Supabase (`001_core_schema.sql`). Additional hardening migrations are included in `/supabase` for a fresh installation. Your existing database does not need to be recreated just to use this corrected website build.

## Core functions

- Supabase authentication and profiles
- public case feed with search/categories/sorting
- case publishing
- indicators (URL/domain/wallet/phone/email/social account)
- comments and nested replies
- case and comment voting
- saved cases
- evidence image upload and private signed URLs
- reports and moderation workflow
- public user profiles
- password reset/change
- legal/community pages

No demo feed records are bundled in the application.

## Design V3
Diese Version enthält das neue ScamSignal Community UI: größere Typografie, dunkle Intelligence-Navigation, 3-Spalten-Feed, stärkeres Profil-Dashboard und echte Evidence-Vorschauen aus dem privaten Supabase-Bucket. Es werden weiterhin keine Demo-Fälle erzeugt; alle Feed-Inhalte stammen aus Supabase.
