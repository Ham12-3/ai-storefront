'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Lock, Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useBasket } from '@/components/basket/basket-provider'
import { formatMoney } from '@/commerce/money'
import { products } from '@/data/catalogue'
import { ProductVisual } from '@/components/product/product-visual'

const productById = new Map(products.map((product) => [product.id, product]))

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
    } catch {
      setError('Checkout could not start. Your basket is unchanged; try again.')
      setBusy(false)
    }
  }

  if (!lines.length)
    return (
      <main className="basket-page empty-basket">
        <p className="eyebrow">Your basket</p>
        <h1>Your basket is empty</h1>
        <p>Browse the catalogue or ask the product guide for help choosing.</p>
        <Link className="primary-cta" href="/products">
          Browse products <ArrowRight aria-hidden="true" />
        </Link>
      </main>
    )

  return (
    <main className="basket-page">
      <Link href="/products" className="back-link">
        <ArrowLeft aria-hidden="true" /> Continue shopping
      </Link>
      <div className="basket-layout">
        <section>
          <p className="eyebrow">
            Your basket / {lines.reduce((sum, line) => sum + line.quantity, 0)}{' '}
            items
          </p>
          <h1>Your basket</h1>
          <div className="basket-lines">
            {lines.map((line) => {
              const product = productById.get(line.productId)
              return (
                <article key={line.variantId}>
                  {product && (
                    <div className="basket-product-thumb">
                      <ProductVisual product={product} compact />
                    </div>
                  )}
                  <div>
                    <h2>{line.title}</h2>
                    <p>{line.variant}</p>
                    <button onClick={() => remove(line.variantId)}>
                      <Trash2 aria-hidden="true" /> Remove
                    </button>
                  </div>
                  <div className="quantity">
                    <button
                      onClick={() => update(line.variantId, line.quantity - 1)}
                      aria-label={`Decrease ${line.title}`}
                    >
                      <Minus aria-hidden="true" />
                    </button>
                    <span>{line.quantity}</span>
                    <button
                      onClick={() => update(line.variantId, line.quantity + 1)}
                      aria-label={`Increase ${line.title}`}
                    >
                      <Plus aria-hidden="true" />
                    </button>
                  </div>
                  <strong>
                    {formatMoney(line.unitPriceMinor * line.quantity)}
                  </strong>
                </article>
              )
            })}
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
            <ArrowRight aria-hidden="true" />
          </button>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <small>
            <Lock aria-hidden="true" /> Prices and stock are checked before
            checkout opens.
          </small>
        </aside>
      </div>
    </main>
  )
}
