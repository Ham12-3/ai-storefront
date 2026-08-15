if (!process.env.DATABASE_URL || !process.env.OPENAI_API_KEY) {
  console.error(
    'Backfill requires DATABASE_URL and OPENAI_API_KEY. It only selects consenting, redacted, unexpired conversations.',
  )
  process.exitCode = 1
} else
  console.log(
    'Sentiment backfill configuration valid. Process bounded date chunks through idempotent jobs; low confidence becomes uncertain.',
  )
