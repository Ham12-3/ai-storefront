export function GET() {
  return Response.json({
    status: 'ok',
    service: 'ai-storefront',
    time: new Date().toISOString(),
    integrations: {
      catalogue: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
        ? 'configured'
        : 'demo',
      database: process.env.DATABASE_URL ? 'configured' : 'demo',
      payments: process.env.STRIPE_SECRET_KEY ? 'configured' : 'demo',
      ai: process.env.OPENAI_API_KEY ? 'configured' : 'demo',
    },
  })
}
