import Stripe from 'stripe'
import { z } from 'zod'
import { products } from '@/data/catalogue'
import { effectivePrice } from '@/commerce/money'
import { env } from '@/lib/env'

const schema = z
  .object({
    lines: z
      .array(
        z
          .object({
            productId: z.string(),
            variantId: z.string(),
            quantity: z.number().int().min(1).max(25),
            expectedUnitPriceMinor: z.number().int().nonnegative(),
          })
          .strict(),
      )
      .min(1)
      .max(50),
  })
  .strict()
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success)
    return Response.json(
      { error: 'The basket could not be validated.' },
      { status: 400 },
    )
  const resolved = []
  for (const line of parsed.data.lines) {
    const product = products.find(
      (item) => item.id === line.productId && item.status === 'active',
    )
    const variant = product?.variants.find(
      (item) => item.variantId === line.variantId && item.active,
    )
    if (!product || !variant || variant.stock < line.quantity)
      return Response.json(
        {
          error:
            'One or more items are no longer available. Refresh your basket.',
        },
        { status: 409 },
      )
    const current = effectivePrice(product, variant)
    if (current !== line.expectedUnitPriceMinor)
      return Response.json(
        {
          error: `The price of ${product.title} changed. Review the updated basket before checkout.`,
          code: 'PRICE_CHANGED',
        },
        { status: 409 },
      )
    resolved.push({
      product,
      variant,
      quantity: line.quantity,
      unitPriceMinor: current,
    })
  }
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin
  if (!env.STRIPE_SECRET_KEY)
    return Response.json({ url: `${siteUrl}/checkout/demo`, mode: 'demo' })
  const stripe = new Stripe(env.STRIPE_SECRET_KEY)
  const session = await stripe.checkout.sessions.create(
    {
      mode: 'payment',
      success_url: `${siteUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/basket`,
      line_items: resolved.map(
        ({ product, variant, quantity, unitPriceMinor }) => ({
          quantity,
          price_data: {
            currency: product.currency.toLowerCase(),
            unit_amount: unitPriceMinor,
            product_data: {
              name: product.title,
              description: variant.name,
              metadata: { productId: product.id, variantId: variant.variantId },
            },
          },
        }),
      ),
      metadata: { source: 'ai-storefront' },
    },
    { idempotencyKey: crypto.randomUUID() },
  )
  return Response.json({ url: session.url })
}
