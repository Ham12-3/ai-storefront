const fictional = {
  sessions: 8368,
  productViews: 5240,
  searches: 2418,
  zeroResultSearches: 164,
  basketAdditions: 1048,
  completedOrders: 318,
  aiConversations: 684,
  recommendations: 912,
  feedback: { helpful: 426, unhelpful: 58 },
  sentiment: {
    positive: 198,
    neutral: 107,
    negative: 37,
    mixed: 49,
    uncertain: 21,
  },
  resolved: 313,
  unresolved: 99,
  contentGaps: 3,
}
if (!process.env.DATABASE_URL) {
  console.log('DATABASE_URL is not set. Fictional analytics seed preview:')
  console.log(JSON.stringify(fictional, null, 2))
  console.log(
    'Start PostgreSQL and run pnpm db:migrate before persisting this seed.',
  )
} else
  console.log(
    'Analytics seed contract validated. Add database adapter credentials to persist the fictional aggregate and event fixtures.',
  )
