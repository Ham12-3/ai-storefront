import { describe, expect, it } from 'vitest'
import {
  availableToReserve,
  basketTotal,
  decimalToMinor,
  effectivePrice,
  hasPriceChanged,
  validateSalePrice,
} from '@/commerce/money'
import { products } from '@/data/catalogue'

describe('integer money and inventory', () => {
  it('converts decimal editor input without floating point arithmetic', () => {
    expect(decimalToMinor('19.99')).toBe(1999)
    expect(decimalToMinor('12')).toBe(1200)
    expect(decimalToMinor('0.5')).toBe(50)
  })
  it('rejects invalid precision and sale prices', () => {
    expect(() => decimalToMinor('1.999')).toThrow()
    expect(() => validateSalePrice(1000, 1000)).toThrow()
    expect(validateSalePrice(1000, 900)).toBe(true)
  })
  it('calculates effective variant prices and basket totals', () => {
    const product = products[0]!
    expect(effectivePrice(product)).toBe(7400)
    expect(
      effectivePrice(
        { ...product, salePriceMinor: undefined },
        {
          ...product.variants[0]!,
          priceOverrideMinor: 8000,
          salePriceOverrideMinor: 7000,
        },
      ),
    ).toBe(7000)
    expect(
      basketTotal([
        { unitPriceMinor: 1999, quantity: 2 },
        { unitPriceMinor: 500, quantity: 1 },
      ]),
    ).toBe(4498)
  })
  it('detects price changes and safe reservation availability', () => {
    expect(hasPriceChanged(100, 101)).toBe(true)
    expect(hasPriceChanged(100, 100)).toBe(false)
    expect(availableToReserve(7, 3)).toBe(4)
    expect(availableToReserve(2, 8)).toBe(0)
  })
})
