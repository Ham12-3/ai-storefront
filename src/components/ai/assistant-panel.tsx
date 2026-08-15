'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { products } from '@/data/catalogue'
import type { Product } from '@/types/catalogue'
import { ProductVisual } from '@/components/product/product-visual'
import { AddToBasket } from '@/components/product/add-to-basket'
import { formatMoney, effectivePrice } from '@/commerce/money'
import { usePathname } from 'next/navigation'

type Message = {
  role: 'assistant' | 'user'
  text: string
  products?: Product[]
}

export function AssistantPanel() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Tell me what you’re making space for. I’ll search the live catalogue and keep to your budget.',
    },
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener('open-assistant', show)
    return () => window.removeEventListener('open-assistant', show)
  }, [])
  useEffect(() => {
    if (!open) return
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 100)
    const previousBodyOverflow = document.body.style.overflow
    const previousRootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousRootOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])
  useEffect(() => {
    if (!open) return
    const frame = window.requestAnimationFrame(() => {
      const region = messagesRef.current
      if (!region) return
      region.scrollTo({
        top: region.scrollHeight,
        behavior: messages.length > 1 ? 'smooth' : 'auto',
      })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [busy, messages, open])

  async function send(text = input) {
    const clean = text.trim()
    if (!clean || busy) return
    setMessages((value) => [...value, { role: 'user', text: clean }])
    setInput('')
    setBusy(true)
    setOpen(true)
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: clean }),
      })
      const data = (await response.json()) as {
        text?: string
        productIds?: string[]
        error?: string
      }
      const matches = (data.productIds ?? []).flatMap(
        (id) => products.find((product) => product.id === id) ?? [],
      )
      setMessages((value) => [
        ...value,
        {
          role: 'assistant',
          text:
            data.text ??
            'I could not check the catalogue just now. Try again or browse the catalogue.',
          products: matches,
        },
      ])
    } catch {
      setMessages((value) => [
        ...value,
        {
          role: 'assistant',
          text: 'The guide is temporarily unavailable. You can still browse and search the catalogue.',
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/studio'))
    return null

  return (
    <>
      {!open && (
        <button className="floating-guide" onClick={() => setOpen(true)}>
          Product help
        </button>
      )}
      {open && (
        <>
          <button
            className="assistant-backdrop"
            onClick={() => setOpen(false)}
            aria-label="Close product guide"
          />
          <aside
            className="assistant-panel open"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-guide-title"
          >
            <header>
              <div>
                <span className="assistant-mark" aria-hidden="true">
                  F/F
                </span>
                <div>
                  <p id="product-guide-title">Product guide</p>
                  <small>Catalogue and stock connected</small>
                </div>
              </div>
              <button
                className="icon-button"
                onClick={() => setOpen(false)}
                aria-label="Close guide"
              >
                <X aria-hidden="true" />
              </button>
            </header>
            <div className="assistant-note">
              Recommendations use the current catalogue. Price and stock are
              checked again at checkout.
            </div>
            <div
              ref={messagesRef}
              className="messages"
              aria-label="Product guide conversation"
              aria-live="polite"
              onKeyDown={(event) => {
                const region = event.currentTarget
                const page = region.clientHeight * 0.8
                const positions: Partial<Record<string, number>> = {
                  ArrowDown: 48,
                  ArrowUp: -48,
                  PageDown: page,
                  PageUp: -page,
                  Home: -region.scrollHeight,
                  End: region.scrollHeight,
                }
                const distance = positions[event.key]
                if (distance === undefined) return
                event.preventDefault()
                region.scrollBy({ top: distance, behavior: 'smooth' })
              }}
              tabIndex={0}
            >
              {messages.map((message, index) => (
                <div
                  className={`message ${message.role}`}
                  key={`${message.role}-${index}`}
                >
                  <div className="message-copy">{message.text}</div>
                  {message.products?.map((product) => (
                    <div className="chat-product" key={product.id}>
                      <ProductVisual product={product} compact />
                      <div>
                        <strong>{product.title}</strong>
                        <span>{formatMoney(effectivePrice(product))}</span>
                        <AddToBasket product={product} compact />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              {busy && (
                <div className="typing">
                  <i />
                  <i />
                  <i />
                  <span>Checking the catalogue…</span>
                </div>
              )}
            </div>
            <div className="suggestions">
              {[
                'A desk setup under £100',
                'Compare the task lights',
                'What is the returns policy?',
              ].map((item) => (
                <button key={item} onClick={() => send(item)}>
                  {item}
                </button>
              ))}
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                void send()
              }}
            >
              <input
                ref={inputRef}
                name="question"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about products, sizes or delivery…"
                autoComplete="off"
                enterKeyHint="send"
                aria-label="Question for the product guide"
                maxLength={500}
              />
              <button type="submit" disabled={busy || !input.trim()}>
                Send
              </button>
            </form>
          </aside>
        </>
      )}
    </>
  )
}
