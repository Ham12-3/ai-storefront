'use client'

import { ArrowRight } from 'lucide-react'

export function GuideButton({ light = false }: { light?: boolean }) {
  return (
    <button
      className={`primary-cta ${light ? 'light' : ''}`}
      onClick={() => window.dispatchEvent(new Event('open-assistant'))}
    >
      Ask the product guide{' '}
      <span>
        <ArrowRight />
      </span>
    </button>
  )
}
