import { z } from 'zod'

export const publicEnv = z
  .object({
    siteUrl: z.string().url(),
    timezone: z.string().min(1),
    sanityProjectId: z.string(),
    sanityDataset: z.string(),
    consentRequired: z.boolean(),
  })
  .parse({
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    timezone: process.env.NEXT_PUBLIC_STORE_TIMEZONE || 'Europe/London',
    sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    consentRequired:
      process.env.NEXT_PUBLIC_ANALYTICS_CONSENT_REQUIRED !== 'false',
  })
