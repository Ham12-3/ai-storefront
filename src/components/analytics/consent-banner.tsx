'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { getConsent, setConsent } from '@/analytics/client/consent'
export function ConsentBanner() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    queueMicrotask(() => setVisible(getConsent() === null))
  }, [])
  if (
    !visible ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/studio')
  )
    return null
  return (
    <aside className="consent-banner" aria-label="Analytics choices">
      <div>
        <p className="eyebrow">Your analytics choice</p>
        <h2>Useful insight, fewer details.</h2>
        <p>
          Optional analytics helps improve search and the shopping guide.
          Conversation text is not stored by default, and personal information
          is redacted before any permitted analysis. Essential basket and
          checkout processing always works.
        </p>
        <Link href="/policies/privacy">Read the privacy summary</Link>
      </div>
      <div>
        <button
          onClick={() => {
            setConsent('denied')
            setVisible(false)
          }}
        >
          Use essential only
        </button>
        <button
          onClick={() => {
            setConsent('granted')
            setVisible(false)
          }}
        >
          Allow optional analytics
        </button>
      </div>
    </aside>
  )
}
