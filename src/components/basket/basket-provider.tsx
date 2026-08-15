'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Product } from '@/types/catalogue'
import { effectivePrice } from '@/commerce/money'

export type BasketLine = {
  productId: string
  variantId: string
  title: string
  variant: string
  quantity: number
  unitPriceMinor: number
  accent: string
}

type BasketValue = {
  lines: BasketLine[]
  count: number
  totalMinor: number
  add: (product: Product, variantId?: string) => void
  update: (variantId: string, quantity: number) => void
  remove: (variantId: string) => void
  clear: () => void
}

const BasketContext = createContext<BasketValue | null>(null)

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<BasketLine[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setLines(
          JSON.parse(localStorage.getItem('ff-basket') || '[]') as BasketLine[],
        )
      } catch {
        setLines([])
      }
      setReady(true)
    })
  }, [])

  useEffect(() => {
    if (ready) localStorage.setItem('ff-basket', JSON.stringify(lines))
  }, [lines, ready])

  const value = useMemo<BasketValue>(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      totalMinor: lines.reduce(
        (sum, line) => sum + line.unitPriceMinor * line.quantity,
        0,
      ),
      add(product, variantId) {
        const productVariant =
          product.variants.find((item) => item.variantId === variantId) ??
          product.variants[0]
        if (!productVariant || productVariant.stock < 1) return
        setLines((current) => {
          const found = current.find(
            (line) => line.variantId === productVariant.variantId,
          )
          if (found)
            return current.map((line) =>
              line.variantId === found.variantId
                ? { ...line, quantity: Math.min(25, line.quantity + 1) }
                : line,
            )
          return [
            ...current,
            {
              productId: product.id,
              variantId: productVariant.variantId,
              title: product.title,
              variant: productVariant.name,
              quantity: 1,
              unitPriceMinor: effectivePrice(product, productVariant),
              accent: product.accent,
            },
          ]
        })
      },
      update(variantId, quantity) {
        setLines((current) =>
          current.map((line) =>
            line.variantId === variantId
              ? { ...line, quantity: Math.max(1, Math.min(25, quantity)) }
              : line,
          ),
        )
      },
      remove(variantId) {
        setLines((current) =>
          current.filter((line) => line.variantId !== variantId),
        )
      },
      clear() {
        setLines([])
      },
    }),
    [lines],
  )

  return <BasketContext value={value}>{children}</BasketContext>
}

export function useBasket() {
  const context = useContext(BasketContext)
  if (!context) throw new Error('useBasket must be used inside BasketProvider')
  return context
}
