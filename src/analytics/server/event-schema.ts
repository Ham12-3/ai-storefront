import { z } from 'zod'

export const analyticsEventNames = [
  'page_viewed',
  'product_viewed',
  'category_viewed',
  'collection_viewed',
  'search_submitted',
  'search_results_viewed',
  'search_result_clicked',
  'search_zero_results',
  'cart_item_added',
  'cart_item_updated',
  'cart_item_removed',
  'checkout_started',
  'checkout_completed',
  'checkout_failed',
  'ai_opened',
  'ai_message_sent',
  'ai_response_completed',
  'ai_tool_called',
  'ai_tool_failed',
  'ai_recommendation_shown',
  'ai_recommendation_clicked',
  'ai_feedback_submitted',
  'admin_export_created',
  'admin_conversation_viewed',
  'admin_sentiment_corrected',
  'admin_content_draft_created',
] as const

export const analyticsEventSchema = z
  .object({
    eventId: z.string().uuid(),
    name: z.enum(analyticsEventNames),
    version: z.literal(1),
    occurredAt: z.string().datetime(),
    sessionId: z.string().min(16).max(200),
    consent: z.enum(['essential', 'granted', 'denied']),
    path: z.string().max(300).optional(),
    productId: z.string().max(100).optional(),
    query: z.string().max(200).optional(),
    resultCount: z.number().int().nonnegative().optional(),
    valueMinor: z.number().int().nonnegative().optional(),
    currency: z.string().length(3).optional(),
    metadata: z
      .record(
        z.string(),
        z.union([z.string(), z.number(), z.boolean(), z.null()]),
      )
      .optional(),
  })
  .strict()

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>

export function shouldStoreOptionalEvent(event: AnalyticsEvent) {
  const essential = new Set([
    'cart_item_added',
    'cart_item_updated',
    'cart_item_removed',
    'checkout_started',
    'checkout_completed',
    'checkout_failed',
  ])
  return essential.has(event.name) || event.consent === 'granted'
}
