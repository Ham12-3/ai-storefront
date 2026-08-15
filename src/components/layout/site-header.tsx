'use client'

import Link from 'next/link'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useBasket } from '@/components/basket/basket-provider'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { count } = useBasket()
  if (pathname.startsWith('/admin') || pathname.startsWith('/studio'))
    return null
  return (
    <>
      <div className="announcement">
        <span>Form &amp; Function</span>
        <span>Free UK delivery over £75</span>
        <span>30-day returns</span>
      </div>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Form and Function home">
          <span>F/F</span>
          <em>Objects for considered work</em>
        </Link>
        <button
          className="icon-button mobile-menu"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
          <Link href="/products">Shop all</Link>
          <Link href="/categories/desk-tools">Desk tools</Link>
          <Link href="/collections/the-focus-edit">Collections</Link>
          <Link href="/policies/delivery">Delivery</Link>
        </nav>
        <div className="header-actions">
          <Link href="/search" className="icon-button" aria-label="Search">
            <Search />
          </Link>
          <button
            className="assistant-trigger"
            onClick={() => window.dispatchEvent(new Event('open-assistant'))}
            aria-label="Open AI shopping guide"
          >
            Product help
          </button>
          <Link
            href="/basket"
            className="basket-link"
            aria-label={`Basket with ${count} items`}
          >
            <ShoppingBag />
            <span>Basket&nbsp; {count}</span>
          </Link>
        </div>
      </header>
    </>
  )
}
