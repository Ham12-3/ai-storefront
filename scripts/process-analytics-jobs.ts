const configured = Boolean(
  process.env.DATABASE_URL && process.env.ANALYTICS_PROCESSING_SECRET,
)
if (!configured) {
  console.error(
    'Analytics worker requires DATABASE_URL and ANALYTICS_PROCESSING_SECRET. No jobs were claimed.',
  )
  process.exitCode = 1
} else
  console.log(
    'Worker configuration valid. Claim PENDING/RETRY jobs with a lease, process sentiment after redaction, and dead-letter after maxAttempts.',
  )
