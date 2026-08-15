import OpenAI from 'openai'
import { z } from 'zod'
import { env } from '@/lib/env'
import { hybridSearch } from '@/search/catalogue'
import { UnavailableSemanticProvider } from '@/sanity/embeddings/provider'
import {
  assistantSystemPrompt,
  detectPromptInjection,
} from '@/ai/shopping/security'
import {
  buildGroundedFallback,
  buildShoppingContext,
  policyForQuestion,
  productIdsMentionedIn,
  selectGuideProducts,
} from '@/ai/shopping/response'
import { assistantPolicyContext } from '@/data/policies'

const inputSchema = z
  .object({
    message: z.string().trim().min(1).max(500),
    conversationId: z.string().uuid().optional(),
  })
  .strict()
export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success)
    return Response.json(
      { error: 'Enter a question of 500 characters or fewer.' },
      { status: 400 },
    )
  if (detectPromptInjection(parsed.data.message))
    return Response.json({
      text: 'I can help with products, comparisons, delivery, and returns, but I cannot change my security rules.',
      productIds: [],
    })
  const result = await hybridSearch(
    parsed.data.message,
    new UnavailableSemanticProvider(),
  )
  const isPolicyQuestion = Boolean(policyForQuestion(parsed.data.message))
  const guideProducts = isPolicyQuestion
    ? []
    : selectGuideProducts(result.products)
  const context = buildShoppingContext(guideProducts)
  const fallbackText = buildGroundedFallback(parsed.data.message, guideProducts)
  const fallbackProductIds = productIdsMentionedIn(fallbackText, guideProducts)

  if (!env.OPENAI_API_KEY) {
    return Response.json({
      text: fallbackText,
      productIds: fallbackProductIds,
      mode: 'demo',
    })
  }

  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY })

  try {
    const response = await client.responses.create({
      model: env.OPENAI_SHOPPING_MODEL,
      instructions: assistantSystemPrompt,
      input: `Customer question: ${parsed.data.message}\nCurrent catalogue tool result: ${JSON.stringify(context)}\nCurrent store policy tool result: ${JSON.stringify(assistantPolicyContext)}`,
      reasoning: { effort: 'low' },
      max_output_tokens: 1200,
    })
    const text = response.output_text.trim()

    if (response.status !== 'completed' || !text) {
      console.warn('Shopping guide used its grounded fallback.', {
        status: response.status,
        reason: response.incomplete_details?.reason,
        model: response.model,
      })

      return Response.json({
        text: fallbackText,
        productIds: fallbackProductIds,
        mode: 'fallback',
      })
    }

    return Response.json({
      text,
      productIds: productIdsMentionedIn(text, guideProducts),
      mode: 'openai',
    })
  } catch (error) {
    console.error('Shopping guide request failed.', {
      error: error instanceof Error ? error.name : 'UnknownError',
    })

    return Response.json({
      text: fallbackText,
      productIds: fallbackProductIds,
      mode: 'fallback',
    })
  }
}
