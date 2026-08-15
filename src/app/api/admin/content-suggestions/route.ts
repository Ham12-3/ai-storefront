import { z } from 'zod'
import { requireAnalyticsUser } from '@/auth/permissions'
const schema = z
  .object({
    type: z.enum(['faq', 'knowledge', 'synonym']),
    topic: z.string().trim().min(3).max(120),
  })
  .strict()
export async function POST(request: Request) {
  try {
    await requireAnalyticsUser('create_draft')
  } catch {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success)
    return Response.json({ error: 'Invalid suggestion' }, { status: 400 })
  const draftId = `drafts.analyticsSuggestion-${crypto.randomUUID()}`
  return Response.json(
    {
      draftId,
      published: false,
      reviewStatus: 'pending',
      note: 'Connect SANITY_API_WRITE_TOKEN to persist this human-review draft.',
    },
    { status: 201 },
  )
}
