import { effectivePrice, formatMoney } from '@/commerce/money'
import { policies, type PolicySlug } from '@/data/policies'
import type { Product } from '@/types/catalogue'

export const MAX_GUIDE_PRODUCTS = 4

export function selectGuideProducts(products: Product[]) {
  return products.slice(0, MAX_GUIDE_PRODUCTS)
}

export function buildShoppingContext(products: Product[]) {
  return selectGuideProducts(products).map((product) => {
    const priceMinor = effectivePrice(product)

    return {
      id: product.id,
      title: product.title,
      priceMinor,
      formattedPrice: formatMoney(priceMinor, product.currency),
      currency: product.currency,
      stock: product.variants
        .filter((variant) => variant.active)
        .map((variant) => ({
          id: variant.variantId,
          name: variant.name,
          stock: variant.stock,
        })),
      facts: [product.shortDescription, ...product.features],
    }
  })
}

export function policyForQuestion(message: string): PolicySlug | undefined {
  const normalised = message.toLowerCase()

  if (/return|refund|send back/.test(normalised)) return 'returns'
  if (/delivery|shipping|arrive|tracking/.test(normalised)) return 'delivery'
  if (/privacy|personal data|analytics|conversation/.test(normalised))
    return 'privacy'
  if (/terms|payment confirmation|availability/.test(normalised)) return 'terms'

  return undefined
}

export function productIdsMentionedIn(
  text: string,
  products: Product[],
): string[] {
  const normalised = text.toLowerCase()
  const mentioned = products
    .filter((product) => normalised.includes(product.title.toLowerCase()))
    .map((product) => product.id)

  return mentioned.length ? mentioned : products.map((product) => product.id)
}

export function buildGroundedFallback(
  message: string,
  products: Product[],
): string {
  const policySlug = policyForQuestion(message)
  if (policySlug) return policies[policySlug].body.join(' ')

  const choices = selectGuideProducts(products).slice(0, 3)
  if (!choices.length) {
    return 'I couldn’t find a grounded match in the current catalogue. Try describing the intended use, preferred material, or maximum budget.'
  }

  return choices
    .map(
      (product) =>
        `${product.title} is ${formatMoney(effectivePrice(product), product.currency)} — ${product.shortDescription}`,
    )
    .join(' ')
}
