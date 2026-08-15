import { csvSafe } from '@/analytics/server/privacy'
import { requireAnalyticsUser } from '@/auth/permissions'
import { overview } from '@/analytics/server/reports'
export async function GET() {
  try {
    await requireAnalyticsUser('export')
  } catch {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  const rows = [
    ['Product', 'Views', 'Basket additions', 'Orders', 'Revenue'],
    ...overview.topProducts.map((row) => [
      row.product,
      row.views,
      row.basket,
      row.orders,
      row.revenue,
    ]),
  ]
  const csv = rows.map((row) => row.map(csvSafe).join(',')).join('\r\n')
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition':
        'attachment; filename="form-function-analytics.csv"',
      'Cache-Control': 'private, no-store',
    },
  })
}
