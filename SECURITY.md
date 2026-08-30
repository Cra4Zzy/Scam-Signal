# ScamSignal Security Notes

## Schlüsseltrennung

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Browser-safe, arbeitet mit RLS.
- `SUPABASE_SECRET_KEY`: Backend-only, umgeht RLS. Niemals an den Browser senden.

## Zugriffskontrolle

Die Community-Daten basieren auf den RLS-Policies aus Migration 001. Elevated Writes für Evidence und Moderation laufen serverseitig und prüfen zuerst die echte Supabase-User-Session und anschließend Eigentum/Rolle.

## Evidence

Browser-Dateinamen werden nicht als Storage-Pfad übernommen. Der Pfad wird serverseitig zufällig erzeugt. Das Bild wird dekodiert und neu als WebP encodiert. EXIF/ursprüngliche Metadaten werden nicht übernommen.

## Scam URLs

Gemeldete URLs werden als Text/Indikator gespeichert. ScamSignal ruft diese URLs serverseitig nicht automatisch ab. Das reduziert insbesondere SSRF-Risiken.

## Noch vor Production

Rate Limiting, Turnstile, WAF, CSP, SMTP, Security Monitoring, Backup-Restore-Test und externer Security Review gehören vor einen öffentlichen Launch.
