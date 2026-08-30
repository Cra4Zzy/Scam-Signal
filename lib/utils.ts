export function formatRelativeTime(iso: string) {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'gerade eben'
  if (minutes < 60) return `vor ${minutes} Min.`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `vor ${hours} Std.`
  const days = Math.floor(hours / 24)
  if (days < 30) return `vor ${days} Tag${days === 1 ? '' : 'en'}`
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(date)
}

export function publicCaseId(id: string) {
  return `SS-${id.replaceAll('-', '').slice(0, 8).toUpperCase()}`
}

export function normalizeIndicator(type: string, value: string) {
  const trimmed = value.trim()
  if (type === 'domain') {
    return trimmed.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '')
  }
  if (type === 'url' || type === 'email' || type === 'social_account' || type === 'username') {
    return trimmed.toLowerCase()
  }
  if (type === 'phone') {
    return trimmed.replace(/[^+\d]/g, '')
  }
  return trimmed
}

export function categoryClass(category: string) {
  if (category === 'phishing') return 'blue'
  if (category === 'marketplace' || category === 'fake_shop') return 'amber'
  if (category === 'banking') return 'green'
  return ''
}

export function statusLabel(status: string) {
  const map: Record<string, string> = {
    reported: 'GEMELDET',
    investigating: 'IN PRÜFUNG',
    corroborated: 'MEHRFACH BESTÄTIGT',
    disputed: 'BESTRITTEN',
    confirmed: 'BESTÄTIGT',
    closed: 'GESCHLOSSEN'
  }
  return map[status] ?? status.toUpperCase()
}

export function statusClass(status: string) {
  if (status === 'confirmed' || status === 'corroborated') return 'corroborated'
  if (status === 'disputed') return 'disputed'
  if (status === 'reported') return 'new'
  return 'review'
}
