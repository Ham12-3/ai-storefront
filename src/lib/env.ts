import 'server-only'
import { z } from 'zod'

const optionalUrl = z.string().url().optional().or(z.literal(''))

const serverSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: optionalUrl,
  SANITY_API_READ_TOKEN: z.string().optional(),
  SANITY_API_WRITE_TOKEN: z.string().optional(),
  SANITY_MANAGEMENT_TOKEN: z.string().optional(),
  SANITY_WEBHOOK_SECRET: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_SHOPPING_MODEL: z.string().default('gpt-5-mini'),
  OPENAI_SENTIMENT_MODEL: z.string().default('gpt-5-mini'),
  OPENAI_INSIGHTS_MODEL: z.string().default('gpt-5-mini'),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  ADMIN_EMAILS: z.string().default(''),
  ANALYST_EMAILS: z.string().default(''),
  EDITOR_EMAILS: z.string().default(''),
  ANALYTICS_ENABLED: z.string().default('true'),
  ANALYTICS_STORE_REDACTED_TRANSCRIPTS: z.string().default('false'),
  ANALYTICS_TRANSCRIPT_RETENTION_DAYS: z.coerce
    .number()
    .int()
    .positive()
    .default(30),
  ANALYTICS_EVENT_RETENTION_DAYS: z.coerce
    .number()
    .int()
    .positive()
    .default(365),
  ANALYTICS_K_ANONYMITY_MIN: z.coerce.number().int().min(2).default(5),
  ANALYTICS_PROCESSING_SECRET: z.string().optional(),
  ANALYTICS_SENTIMENT_CONFIDENCE_THRESHOLD: z.coerce
    .number()
    .min(0)
    .max(1)
    .default(0.6),
})

const result = serverSchema.safeParse(process.env)
if (!result.success) {
  throw new Error(
    `Invalid server configuration: ${result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')}`,
  )
}

export const env = result.data
export const isDemoMode =
  !env.DATABASE_URL || !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

export const emailList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
