import { createHmac } from 'node:crypto'

export function hashSession(sessionId: string, secret: string) {
  if (secret.length < 16)
    throw new Error('Session hashing secret must be at least 16 characters')
  return createHmac('sha256', secret).update(sessionId).digest('hex')
}

const rules: Array<[RegExp, string]> = [
  [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[EMAIL]'],
  [/(?:\+?44\s?|0)(?:\d[\s()-]?){9,10}\b/g, '[PHONE]'],
  [/\b(?:\d[ -]*?){13,19}\b/g, '[PAYMENT_NUMBER]'],
  [/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP_ADDRESS]'],
  [
    /\b\d{1,4}\s+[A-Za-z][A-Za-z '-]{2,}\s(?:Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Way|Drive|Dr)\b/gi,
    '[ADDRESS]',
  ],
  [/\b(?:[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b/gi, '[POSTCODE]'],
]

export function redactPersonalInformation(input: string) {
  return rules.reduce(
    (value, [pattern, replacement]) => value.replace(pattern, replacement),
    input,
  )
}

export function csvSafe(value: string | number) {
  const text = String(value).replaceAll('"', '""')
  const neutral = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
  return `"${neutral}"`
}

export function transcriptExpiry(createdAt: Date, retentionDays: number) {
  const value = new Date(createdAt)
  value.setUTCDate(value.getUTCDate() + retentionDays)
  return value
}
