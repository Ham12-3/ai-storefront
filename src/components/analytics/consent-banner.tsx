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
        <h2>Choose your analytics setting</h2>
        <p>
          Optional analytics helps improve search and product guidance. Basket
          and checkout features work with either choice.
        </p>
        <Link href="/policies/privacy">Read the privacy summary</Link>
      </div>
      <div>
        <button
          type="button"
          className="consent-secondary"
          onClick={() => {
            setConsent('denied')
            setVisible(false)
          }}
        >
          Use essential only
        </button>
        <button
          type="button"
          className="consent-primary"
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
