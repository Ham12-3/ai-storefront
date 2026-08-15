import { createHmac, timingSafeEqual } from 'node:crypto'
import { revalidatePath, revalidateTag } from 'next/cache'
import { env } from '@/lib/env'

export function validSanitySignature(
  body: string,
  signature: string,
  secret: string,
) {
  const actual = Buffer.from(signature.replace(/^sha256=/, ''), 'hex')
  const expected = Buffer.from(
    createHmac('sha256', secret).update(body).digest('hex'),
    'hex',
  )
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export async function POST(request: Request) {
  if (!env.SANITY_WEBHOOK_SECRET)
    return Response.json(
      { error: 'Webhook secret is not configured' },
      { status: 503 },
    )
  const body = await request.text()
  const signature = request.headers.get('sanity-webhook-signature') || ''
  if (!validSanitySignature(body, signature, env.SANITY_WEBHOOK_SECRET))
    return Response.json({ error: 'Invalid Sanity signature' }, { status: 401 })
  const payload = JSON.parse(body) as { _type?: string; slug?: string }
  revalidateTag('sanity-content', 'max')
  revalidatePath('/')
  if (payload._type === 'product' && payload.slug)
    revalidatePath(`/products/${payload.slug}`)
  return Response.json({ revalidated: true })
}
