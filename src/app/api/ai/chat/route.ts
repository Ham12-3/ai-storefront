import OpenAI from 'openai'
import { z } from 'zod'
import { env } from '@/lib/env'
import { hybridSearch } from '@/search/catalogue'
import { UnavailableSemanticProvider } from '@/sanity/embeddings/provider'
import {
  assistantSystemPrompt,
  detectPromptInjection,
} from '@/ai/shopping/security'
import { effectivePrice, formatMoney } from '@/commerce/money'

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
  const context = result.products.map((product) => ({
    id: product.id,
    title: product.title,
    priceMinor: effectivePrice(product),
    currency: product.currency,
    stock: product.variants
      .filter((v) => v.active)
      .map((v) => ({ id: v.variantId, name: v.name, stock: v.stock })),
    facts: [product.shortDescription, ...product.features],
  }))
  if (!env.OPENAI_API_KEY) {
    if (!context.length)
      return Response.json({
        text: 'I couldn’t find a grounded match in the current catalogue. Try describing the use, material, or maximum budget.',
        productIds: [],
      })
    const lead = result.products[0]!
    return Response.json({
      text: `${lead.title} is the strongest current match at ${formatMoney(effectivePrice(lead))}. ${lead.shortDescription} ${result.fallbackUsed ? 'I used exact and keyword matching while semantic search is unavailable.' : ''}`,
      productIds: result.products.map((item) => item.id),
      mode: 'demo',
    })
  }
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY })
  const response = await client.responses.create({
    model: env.OPENAI_SHOPPING_MODEL,
    instructions: assistantSystemPrompt,
    input: `Customer question: ${parsed.data.message}\nCurrent catalogue tool result: ${JSON.stringify(context)}`,
    max_output_tokens: 450,
  })
  return Response.json({
    text:
      response.output_text ||
      'I could not form a grounded answer from the current catalogue.',
    productIds: result.products.map((item) => item.id),
    mode: 'openai',
  })
}
