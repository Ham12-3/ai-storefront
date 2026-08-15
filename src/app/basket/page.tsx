'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Lock, Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useBasket } from '@/components/basket/basket-provider'
import { formatMoney } from '@/commerce/money'

export default function BasketPage() {
  const { lines, totalMinor, update, remove } = useBasket()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const delivery = totalMinor >= 7500 ? 0 : 550

  async function checkout() {
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: lines.map(
            ({ productId, variantId, quantity, unitPriceMinor }) => ({
              productId,
              variantId,
              quantity,
              expectedUnitPriceMinor: unitPriceMinor,
            }),
          ),
        }),
      })
      const data = (await response.json()) as { url?: string; error?: string }
      if (!response.ok || !data.url)
        throw new Error(data.error || 'Checkout could not start')
      window.location.assign(data.url)
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Checkout could not start',
      )
      setBusy(false)
    }
  }

  if (!lines.length)
    return (
      <main className="basket-page empty-basket">
        <p className="eyebrow">Your basket</p>
        <h1>Space for something useful.</h1>
        <p>
          Your basket is empty. Start with the full edit or ask the guide for a
          grounded recommendation.
        </p>
        <Link className="primary-cta" href="/products">
          Browse all objects <ArrowRight />
        </Link>
      </main>
    )

  return (
    <main className="basket-page">
      <Link href="/products" className="back-link">
        <ArrowLeft /> Continue shopping
      </Link>
      <div className="basket-layout">
        <section>
          <p className="eyebrow">
            Your basket / {lines.reduce((sum, line) => sum + line.quantity, 0)}{' '}
            items
          </p>
          <h1>
            Ready when
            <br />
            you are.
          </h1>
          <div className="basket-lines">
            {lines.map((line) => (
              <article key={line.variantId}>
                <span
                  className="basket-swatch"
                  style={{ background: line.accent }}
                />
                <div>
                  <h2>{line.title}</h2>
                  <p>{line.variant}</p>
                  <button onClick={() => remove(line.variantId)}>
                    <Trash2 /> Remove
                  </button>
                </div>
                <div className="quantity">
                  <button
                    onClick={() => update(line.variantId, line.quantity - 1)}
                    aria-label={`Decrease ${line.title}`}
                  >
                    <Minus />
                  </button>
                  <span>{line.quantity}</span>
                  <button
                    onClick={() => update(line.variantId, line.quantity + 1)}
                    aria-label={`Increase ${line.title}`}
                  >
                    <Plus />
                  </button>
                </div>
                <strong>
                  {formatMoney(line.unitPriceMinor * line.quantity)}
                </strong>
              </article>
            ))}
          </div>
        </section>
        <aside className="order-summary">
          <p className="eyebrow">Order summary</p>
          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatMoney(totalMinor)}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>{delivery === 0 ? 'Free' : formatMoney(delivery)}</dd>
            </div>
            <div className="total">
              <dt>Total</dt>
              <dd>{formatMoney(totalMinor + delivery)}</dd>
            </div>
          </dl>
          {totalMinor < 7500 && (
            <p>Add {formatMoney(7500 - totalMinor)} more for free delivery.</p>
          )}
          <button
            className="checkout-button"
            disabled={busy}
            onClick={checkout}
          >
            {busy ? 'Checking current prices…' : 'Secure checkout'}{' '}
            <ArrowRight />
          </button>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <small>
            <Lock /> Prices and stock are checked securely on the server before
            Stripe opens.
          </small>
        </aside>
      </div>
    </main>
  )
}
