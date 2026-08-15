import { describe, expect, it } from 'vitest'
import {
  analyticsEventSchema,
  shouldStoreOptionalEvent,
} from '@/analytics/server/event-schema'
import {
  csvSafe,
  hashSession,
  redactPersonalInformation,
  transcriptExpiry,
} from '@/analytics/server/privacy'

const event = {
  eventId: '4b49d7ad-d01e-488d-a988-28569930d501',
  name: 'product_viewed',
  version: 1,
  occurredAt: '2026-08-15T08:00:00.000Z',
  sessionId: 'session-identifier-123',
  consent: 'granted',
} as const
describe('privacy-aware analytics', () => {
  it('validates names and versions', () => {
    expect(analyticsEventSchema.safeParse(event).success).toBe(true)
    expect(
      analyticsEventSchema.safeParse({ ...event, version: 2 }).success,
    ).toBe(false)
    expect(
      analyticsEventSchema.safeParse({ ...event, name: 'unknown' }).success,
    ).toBe(false)
  })
  it('rejects optional events without consent but keeps essential commerce', () => {
    expect(shouldStoreOptionalEvent({ ...event, consent: 'denied' })).toBe(
      false,
    )
    expect(
      shouldStoreOptionalEvent({
        ...event,
        name: 'checkout_started',
        consent: 'denied',
      }),
    ).toBe(true)
  })
  it('hashes session identifiers deterministically without retaining originals', () => {
    const a = hashSession('session-identifier-123', '0123456789abcdef')
    expect(a).toBe(hashSession('session-identifier-123', '0123456789abcdef'))
    expect(a).not.toContain('session')
  })
  it('redacts deterministic personal information', () => {
    const redacted = redactPersonalInformation(
      'Email me at person@example.com or 07700 900123, postcode SW1A 1AA.',
    )
    expect(redacted).toContain('[EMAIL]')
    expect(redacted).toContain('[PHONE]')
    expect(redacted).toContain('[POSTCODE]')
    expect(redacted).not.toContain('person@example.com')
  })
  it('prevents spreadsheet formula execution', () => {
    expect(csvSafe('=HYPERLINK("bad")')).toBe('"\'=HYPERLINK(""bad"")"')
  })
  it('calculates transcript expiry in UTC', () => {
    expect(
      transcriptExpiry(new Date('2026-01-30T12:00:00Z'), 30).toISOString(),
    ).toBe('2026-03-01T12:00:00.000Z')
  })
})
