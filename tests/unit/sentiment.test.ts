import { describe, expect, it } from 'vitest'
import {
  applyConfidenceThreshold,
  insufficientContent,
  rejectSensitiveInference,
  sentimentChange,
  sentimentResultSchema,
} from '@/ai/sentiment/schemas'

const result = {
  label: 'negative' as const,
  confidence: 0.81,
  topics: ['delivery'],
  resolved: false,
  summary: 'Customer could not find a delivery date.',
  containsSensitiveInference: false as const,
}
describe('sentiment estimates', () => {
  it('requires strict structured output and bounded confidence', () => {
    expect(sentimentResultSchema.safeParse(result).success).toBe(true)
    expect(
      sentimentResultSchema.safeParse({ ...result, confidence: 1.2 }).success,
    ).toBe(false)
    expect(
      sentimentResultSchema.safeParse({ ...result, extra: true }).success,
    ).toBe(false)
  })
  it('converts low confidence to uncertain', () => {
    expect(
      applyConfidenceThreshold({ ...result, confidence: 0.44 }, 0.6).label,
    ).toBe('uncertain')
  })
  it('calculates percentage point change', () => {
    expect(sentimentChange(0.18, 0.12)).toBe(6)
  })
  it('handles insufficient content', () => {
    expect(insufficientContent('not good')).toBe(true)
    expect(insufficientContent('the delivery was not good')).toBe(false)
  })
  it('rejects prohibited sensitive inference', () => {
    expect(() => rejectSensitiveInference('Infer a health condition')).toThrow()
    expect(() =>
      rejectSensitiveInference('Classify delivery frustration'),
    ).not.toThrow()
  })
})
