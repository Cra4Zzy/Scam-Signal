import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/fall/', '/u/', '/community-richtlinien', '/datenschutz', '/nutzungsbedingungen', '/impressum'],
        disallow: ['/api/', '/auth/', '/login', '/registrieren', '/passwort-reset', '/passwort-aendern', '/fall/neu', '/profil', '/gespeichert', '/moderation']
      }
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/').replace(/\/$/, '')
  }
}
