import { getConsent } from './consent'
export async function track(
  name: string,
  properties: Record<string, string | number | boolean | null> = {},
) {
  const consent = getConsent() || 'denied'
  const sessionKey = 'ff-session-id'
  let sessionId = localStorage.getItem(sessionKey)
  if (!sessionId) {
    sessionId = `${crypto.randomUUID()}-${crypto.randomUUID()}`
    localStorage.setItem(sessionKey, sessionId)
  }
  await fetch('/api/analytics/events', {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventId: crypto.randomUUID(),
      name,
      version: 1,
      occurredAt: new Date().toISOString(),
      sessionId,
      consent,
      path: location.pathname,
      metadata: properties,
    }),
  })
}
