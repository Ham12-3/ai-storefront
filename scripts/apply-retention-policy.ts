const transcriptDays = Number(
  process.env.ANALYTICS_TRANSCRIPT_RETENTION_DAYS || 30,
)
const eventDays = Number(process.env.ANALYTICS_EVENT_RETENTION_DAYS || 365)
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required for retention.')
  process.exitCode = 1
} else
  console.log(
    `Retention configuration valid: redact/delete transcript text after ${transcriptDays} days and events after ${eventDays} days; aggregates remain.`,
  )
