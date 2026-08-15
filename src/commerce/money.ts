import { z } from 'zod'
import type { Product, ProductVariant } from '@/types/catalogue'

export const minorMoneySchema = z.number().int().nonnegative().max(100_000_000)

export function decimalToMinor(value: string): number {
  const trimmed = value.trim()
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed))
    throw new Error('Enter a valid amount with up to two decimal places')
  const [whole = '0', fraction = ''] = trimmed.split('.')
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
}

export function formatMoney(minor: number, currency = 'GBP', locale = 'en-GB') {
  minorMoneySchema.parse(minor)
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
    minor / 100,
  )
}

export function effectivePrice(
  product: Product,
  variant?: ProductVariant,
): number {
  const regular = variant?.priceOverrideMinor ?? product.basePriceMinor
  const sale = variant?.salePriceOverrideMinor ?? product.salePriceMinor
  return sale !== undefined && sale < regular ? sale : regular
}

export function validateSalePrice(regular: number, sale?: number) {
  minorMoneySchema.parse(regular)
  if (sale === undefined) return true
  minorMoneySchema.parse(sale)
  if (sale >= regular)
    throw new Error('Sale price must be lower than the regular price')
  return true
}

export function basketTotal(
  lines: Array<{ unitPriceMinor: number; quantity: number }>,
) {
  return lines.reduce(
    (sum, line) =>
      sum +
      minorMoneySchema.parse(line.unitPriceMinor) *
        z.number().int().min(1).max(25).parse(line.quantity),
    0,
  )
}

export function hasPriceChanged(expectedMinor: number, currentMinor: number) {
  return expectedMinor !== currentMinor
}

export function availableToReserve(stock: number, reserved: number) {
  return Math.max(
    0,
    z.number().int().nonnegative().parse(stock) -
      z.number().int().nonnegative().parse(reserved),
  )
}
