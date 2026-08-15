import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { BasketProvider } from '@/components/basket/basket-provider'
import { SiteHeader } from '@/components/layout/site-header'
import { AssistantPanel } from '@/components/ai/assistant-panel'
import { ConsentBanner } from '@/components/analytics/consent-banner'
import './globals.css'
import './retail.css'

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
})
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'Form & Function — tools for considered work',
    template: '%s — Form & Function',
  },
  description:
    'Thoughtful furniture, lighting and desk tools for focused work and life in motion.',
}
export const viewport: Viewport = {
  themeColor: '#f4f7f8',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className={`${sans.variable} ${mono.variable}`}>
      <head>
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <BasketProvider>
          <SiteHeader />
          <div id="main-content">{children}</div>
          <AssistantPanel />
          <ConsentBanner />
          <footer className="site-footer">
            <div className="footer-mark" aria-hidden="true">
              F/F
            </div>
            <div>
              <p>Form follows use.</p>
              <small>
                Fictional demonstration store · Built for thoughtful commerce.
              </small>
            </div>
            <nav aria-label="Footer">
              <Link href="/products">Catalogue</Link>
              <Link href="/policies/returns">Returns</Link>
              <Link href="/admin/analytics">Analytics</Link>
              <Link href="/studio">Studio</Link>
            </nav>
          </footer>
        </BasketProvider>
      </body>
    </html>
  )
}
