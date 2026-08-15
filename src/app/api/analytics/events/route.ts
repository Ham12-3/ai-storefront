import {
  analyticsEventSchema,
  shouldStoreOptionalEvent,
} from '@/analytics/server/event-schema'
export async function POST(request: Request) {
  const parsed = analyticsEventSchema.safeParse(
    await request.json().catch(() => null),
  )
  if (!parsed.success)
    return Response.json(
      {
        error: 'Invalid analytics event',
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      },
      { status: 400 },
    )
  if (!shouldStoreOptionalEvent(parsed.data))
    return Response.json(
      { accepted: false, reason: 'optional_analytics_denied' },
      { status: 202 },
    )
  return Response.json(
    { accepted: true, eventId: parsed.data.eventId },
    { status: 202 },
  )
}
