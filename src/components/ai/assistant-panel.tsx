'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, ChevronRight, Send, ThumbsDown, ThumbsUp, X } from 'lucide-react'
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
  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener('open-assistant', show)
    return () => window.removeEventListener('open-assistant', show)
  }, [])
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

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
            data.error ??
            'I could not check the catalogue just now.',
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
          <span aria-hidden="true">?</span> Product help
        </button>
      )}
      {open && (
        <div className="assistant-backdrop" onClick={() => setOpen(false)} />
      )}
      <aside
        className={open ? 'assistant-panel open' : 'assistant-panel'}
        aria-label="AI shopping guide"
        aria-hidden={!open}
      >
        <header>
          <div>
            <span>
              <Bot />
            </span>
            <div>
              <p>Product guide</p>
              <small>
                <i /> Catalogue connected
              </small>
            </div>
          </div>
          <button
            className="icon-button"
            onClick={() => setOpen(false)}
            aria-label="Close guide"
          >
            <X />
          </button>
        </header>
        <div className="assistant-note">
          Recommendations are grounded in current catalogue data. Exact price
          and stock are checked again at checkout.
        </div>
        <div className="messages" aria-live="polite">
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
              {message.role === 'assistant' && index > 0 && (
                <div className="feedback">
                  <span>Was this useful?</span>
                  <button aria-label="Helpful">
                    <ThumbsUp />
                  </button>
                  <button aria-label="Not helpful">
                    <ThumbsDown />
                  </button>
                </div>
              )}
            </div>
          ))}
          {busy && (
            <div className="typing">
              <i />
              <i />
              <i />
              <span>Checking products and stock</span>
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
              <ChevronRight />
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
            aria-label="Question for the product guide"
            maxLength={500}
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={busy || !input.trim()}
          >
            <Send />
          </button>
        </form>
      </aside>
    </>
  )
}
