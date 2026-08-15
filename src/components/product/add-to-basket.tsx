'use client'

import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { useBasket } from '@/components/basket/basket-provider'
import type { Product } from '@/types/catalogue'

export function AddToBasket({
  product,
  variantId,
  compact = false,
}: {
  product: Product
  variantId?: string
  compact?: boolean
}) {
  const [added, setAdded] = useState(false)
  const { add } = useBasket()
  return (
    <button
      type="button"
      className={compact ? 'add-button compact' : 'add-button'}
      onClick={() => {
        add(product, variantId)
        setAdded(true)
        setTimeout(() => setAdded(false), 1400)
      }}
    >
      {added ? (
        <>
          <Check aria-hidden="true" /> Added
        </>
      ) : (
        <>
          <Plus aria-hidden="true" /> Add to basket
        </>
      )}
    </button>
  )
}
