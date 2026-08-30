'use client'

import { useState } from 'react'

export default function CopyIndicator({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return <button className="copy-indicator" onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1200) }}>{copied ? 'kopiert' : 'kopieren'}</button>
}
