import { z } from 'zod'
const schema = z
  .object({
    conversationId: z.string().uuid(),
    messageId: z.string().uuid(),
    helpful: z.boolean(),
    reason: z.string().max(200).optional(),
  })
  .strict()
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success)
    return Response.json({ error: 'Invalid feedback' }, { status: 400 })
  return Response.json({ accepted: true }, { status: 202 })
}
