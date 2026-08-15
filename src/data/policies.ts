export const policies = {
  delivery: {
    title: 'Delivery',
    summary: 'Clear timings, no mystery windows.',
    body: [
      'UK orders normally arrive in 2–4 working days. Delivery is free when the basket total is £75 or more.',
      'Larger furniture uses a two-person service. We show the service and any fee before checkout. Tracking is sent only after the carrier receives the order.',
    ],
  },
  returns: {
    title: 'Returns',
    summary: 'Thirty days to decide, with a fair process.',
    body: [
      'Unused products can be returned within 30 days of delivery. Keep protective packaging until you know the object works in your space.',
      'Contact support before returning furniture so we can arrange a suitable collection. Refunds are issued to the original payment method after inspection.',
    ],
  },
  privacy: {
    title: 'Privacy',
    summary: 'Collect less. Explain what remains.',
    body: [
      'Essential basket and order data supports the service. Optional analytics requires consent.',
      'AI conversations are not stored by default. When redacted storage is enabled, personal information is removed before analysis and text expires on schedule.',
    ],
  },
  terms: {
    title: 'Terms',
    summary: 'The practical agreement behind each order.',
    body: [
      'Prices and availability are checked again when checkout begins. Payment is confirmed only by the payment provider webhook.',
      'This demonstration wording requires professional legal review before a production launch.',
    ],
  },
} as const

export type PolicySlug = keyof typeof policies

export const assistantPolicyContext = Object.entries(policies).map(
  ([slug, policy]) => ({
    slug,
    title: policy.title,
    facts: policy.body,
  }),
)
