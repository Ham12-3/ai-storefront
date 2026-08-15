import { Info } from 'lucide-react'
import { requireAnalyticsUser } from '@/auth/permissions'
import { contentGaps } from '@/analytics/server/reports'
import { DraftButton } from '@/components/admin/draft-button'
export const dynamic = 'force-dynamic'
export default async function ContentGapsPage() {
  await requireAnalyticsUser('create_draft')
  return (
    <main className="analytics-page">
      <header className="admin-top">
        <div>
          <p>Customer insight / Content gaps</p>
          <h1>
            Questions the store
            <br />
            doesn’t answer yet
          </h1>
          <span>
            Repeated, anonymised patterns that may warrant clearer
            human-reviewed content.
          </span>
        </div>
      </header>
      <div className="demo-notice">
        <Info /> Draft suggestions never publish automatically and contain no
        raw customer text.
      </div>
      <section className="gap-grid">
        {contentGaps.map((gap, index) => (
          <article key={gap.topic}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p className="eyebrow">{gap.impact} impact</p>
            <h2>{gap.topic}</h2>
            <p>{gap.source}</p>
            <small>{gap.suggestion}</small>
            <DraftButton
              type={index === 2 ? 'synonym' : index === 1 ? 'knowledge' : 'faq'}
              topic={gap.topic}
            />
          </article>
        ))}
      </section>
    </main>
  )
}
