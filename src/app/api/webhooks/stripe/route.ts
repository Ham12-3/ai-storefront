import { createHash } from 'node:crypto'
import Stripe from 'stripe'
import { env } from '@/lib/env'

export async function POST(request: Request) {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET)
    return Response.json(
      { error: 'Stripe webhook is not configured' },
      { status: 503 },
    )
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  if (!signature)
    return Response.json({ error: 'Missing signature' }, { status: 400 })
  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY)
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    )
    // PaymentEvent.providerId is unique; production persistence makes replay a no-op.
    return Response.json({
      received: true,
      eventId: event.id,
      payloadHash: createHash('sha256').update(body).digest('hex'),
    })
  } catch {
    return Response.json({ error: 'Invalid Stripe signature' }, { status: 400 })
  }
}
