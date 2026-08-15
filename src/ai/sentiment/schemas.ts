import { z } from 'zod'

export const sentimentLabels = [
  'positive',
  'neutral',
  'negative',
  'mixed',
  'uncertain',
] as const

export const sentimentResultSchema = z
  .object({
    label: z.enum(sentimentLabels),
    confidence: z.number().min(0).max(1),
    topics: z.array(z.string().max(60)).max(8),
    resolved: z.boolean().nullable(),
    summary: z.string().max(300),
    containsSensitiveInference: z.literal(false),
  })
  .strict()

export type SentimentResult = z.infer<typeof sentimentResultSchema>

export function applyConfidenceThreshold(
  result: SentimentResult,
  threshold: number,
): SentimentResult {
  return result.confidence < threshold
    ? { ...result, label: 'uncertain' }
    : result
}

export function sentimentChange(
  currentNegativeRate: number,
  previousNegativeRate: number,
) {
  return Math.round((currentNegativeRate - previousNegativeRate) * 10_000) / 100
}

export function insufficientContent(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length < 3
}

export function rejectSensitiveInference(text: string) {
  const prohibited =
    /(?:religion|ethnicity|sexuality|political view|health condition|financial vulnerability)/i
  if (prohibited.test(text))
    throw new Error('Sensitive-trait inference is prohibited')
}
