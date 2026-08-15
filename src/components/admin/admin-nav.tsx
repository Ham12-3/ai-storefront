'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Activity,
  BarChart3,
  Box,
  ChartNoAxesCombined,
  MessageSquareText,
  MessageCircleQuestion,
  Search,
  Settings,
  Shapes,
  Store,
  TriangleAlert,
} from 'lucide-react'

const groups = [
  {
    label: 'Performance',
    items: [
      ['Overview', '/admin/analytics', ChartNoAxesCombined],
      ['Commerce', '/admin/analytics/commerce', BarChart3],
      ['Products', '/admin/analytics/products', Box],
      ['Search', '/admin/analytics/search', Search],
    ],
  },
  {
    label: 'Customer insight',
    items: [
      ['AI assistant', '/admin/analytics/ai-assistant', MessageCircleQuestion],
      ['Sentiment', '/admin/analytics/sentiment', Activity],
      ['Conversations', '/admin/analytics/conversations', MessageSquareText],
      ['Content gaps', '/admin/analytics/content-gaps', Shapes],
    ],
  },
  {
    label: 'System',
    items: [
      ['Operations', '/admin/analytics/operations', TriangleAlert],
      ['Storefront', '/', Store],
      ['Studio', '/studio', Settings],
    ],
  },
] as const

export function AdminNav() {
  const pathname = usePathname()
  return (
    <aside className="admin-nav">
      <Link href="/admin/analytics" className="admin-brand">
        <span>F/F</span>
        <div>
          Store reports<small>Private workspace</small>
        </div>
      </Link>
      {groups.map((group) => (
        <nav aria-label={group.label} key={group.label}>
          <p>{group.label}</p>
          {group.items.map(([label, href, Icon]) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? 'active' : ''}
              aria-current={pathname === href ? 'page' : undefined}
            >
              <Icon aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      ))}
      <div className="admin-user">
        <span>AP</span>
        <div>
          <b>Analytics preview</b>
          <small>Admin · Demo data</small>
        </div>
      </div>
    </aside>
  )
}
