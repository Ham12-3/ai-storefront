if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required for aggregation.')
  process.exitCode = 1
} else
  console.log(
    'Aggregation configuration valid. Recompute bounded daily store, product, and search metrics, then reconcile totals before upsert.',
  )
