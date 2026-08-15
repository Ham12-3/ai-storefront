import { describe, expect, it } from 'vitest'
import {
  buildGroundedFallback,
  buildShoppingContext,
  MAX_GUIDE_PRODUCTS,
  productIdsMentionedIn,
} from '@/ai/shopping/response'
import { products } from '@/data/catalogue'

describe('shopping assistant responses', () => {
  it('limits model context and includes display-ready prices', () => {
    const context = buildShoppingContext(products)

    expect(context).toHaveLength(MAX_GUIDE_PRODUCTS)
    expect(context[0]).toMatchObject({
      id: products[0]!.id,
      formattedPrice: '£74.00',
      priceMinor: 7400,
    })
  })

  it('builds a useful product fallback without overwhelming the customer', () => {
    const text = buildGroundedFallback('Help me choose a product', products)

    expect(text).toContain(products[0]!.title)
    expect(text).toContain('£74.00')
    expect(text).not.toContain(products[3]!.title)
  })

  it('answers policy questions from the same facts shown on the site', () => {
    expect(buildGroundedFallback('What is the returns policy?', [])).toContain(
      'within 30 days of delivery',
    )
    expect(buildGroundedFallback('How long is delivery?', [])).toContain(
      '2–4 working days',
    )
  })

  it('returns cards only for products named in the answer', () => {
    expect(
      productIdsMentionedIn(
        `The ${products[1]!.title} is the best fit.`,
        products.slice(0, 3),
      ),
    ).toEqual([products[1]!.id])
  })

  it('gives a helpful prompt when the catalogue has no match', () => {
    expect(buildGroundedFallback('Do you sell sofas?', [])).toContain(
      'maximum budget',
    )
  })
})
