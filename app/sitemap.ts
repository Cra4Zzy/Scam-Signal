import type { MetadataRoute } from 'next'
import { absoluteUrl, getSitemapData } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { cases, profiles } = await getSitemapData()

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'hourly', priority: 1 },
    { url: absoluteUrl('/community-richtlinien'), changeFrequency: 'monthly', priority: 0.5 },
    { url: absoluteUrl('/datenschutz'), changeFrequency: 'monthly', priority: 0.3 },
    { url: absoluteUrl('/nutzungsbedingungen'), changeFrequency: 'monthly', priority: 0.3 },
    { url: absoluteUrl('/impressum'), changeFrequency: 'monthly', priority: 0.2 }
  ]

  const casePages: MetadataRoute.Sitemap = cases.map((item) => ({
    url: absoluteUrl(`/fall/${item.id}`),
    lastModified: item.updated_at,
    changeFrequency: 'weekly',
    priority: 0.85
  }))

  const profilePages: MetadataRoute.Sitemap = profiles.map((profile) => ({
    url: absoluteUrl(`/u/${encodeURIComponent(profile.username)}`),
    lastModified: profile.created_at,
    changeFrequency: 'weekly',
    priority: 0.55
  }))

  return [...staticPages, ...casePages, ...profilePages]
}
