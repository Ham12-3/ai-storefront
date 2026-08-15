import { requireAnalyticsUser } from '@/auth/permissions'
import { ReportPage } from '@/components/admin/report-page'
export const dynamic = 'force-dynamic'
export default async function Page() {
  await requireAnalyticsUser()
  return <ReportPage title="Products" />
}
