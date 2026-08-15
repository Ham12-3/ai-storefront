import { CalendarDays, Download, Info, TrendingUp } from 'lucide-react'

const data: Record<
  string,
  {
    description: string
    metrics: Array<[string, string, string]>
    rows: Array<string[]>
    columns: string[]
  }
> = {
  Commerce: {
    description:
      'Orders, revenue, basket movement, and deterministic AI attribution.',
    metrics: [
      ['Captured revenue', '£42,680', '+12.4%'],
      ['Average order value', '£134.21', '+3.9%'],
      ['Checkout completion', '61.6%', '+2.1 pp'],
    ],
    columns: ['Channel', 'Orders', 'Revenue', 'Conversion'],
    rows: [
      ['Direct catalogue', '246', '£32,940', '3.5%'],
      ['AI-assisted', '72', '£9,740', '5.2%'],
      ['Search-assisted', '84', '£10,860', '4.8%'],
    ],
  },
  Products: {
    description:
      'Views, basket additions, purchases, revenue, and recommendation influence.',
    metrics: [
      ['Product views', '5,240', '+9.2%'],
      ['Basket rate', '20.0%', '+1.4 pp'],
      ['Units sold', '386', '+7.1%'],
    ],
    columns: ['Product', 'Views', 'Basket rate', 'Revenue'],
    rows: [
      ['Arc task lamp', '1,284', '18.8%', '£7,104'],
      ['Field work bag', '1,018', '18.1%', '£8,496'],
      ['Perch desk chair', '710', '13.0%', '£9,269'],
    ],
  },
  Search: {
    description:
      'Search demand, useful results, zero-result queries, and attributed purchases.',
    metrics: [
      ['Searches', '2,418', '+16.8%'],
      ['Result click rate', '42.6%', '+3.2 pp'],
      ['Zero-result rate', '6.8%', '−1.1 pp'],
    ],
    columns: ['Safe query', 'Searches', 'Zero results', 'Conversions'],
    rows: [
      ['desk lamp', '184', '0', '22'],
      ['laptop bag', '142', '0', '18'],
      ['notebook bag', '31', '22', '0'],
    ],
  },
  'AI assistant': {
    description:
      'Guide usage, tool reliability, recommendation actions, and assisted sales.',
    metrics: [
      ['Conversations', '684', '+21.4%'],
      ['Tool success rate', '98.2%', '+0.7 pp'],
      ['Assisted orders', '72', '+14.3%'],
    ],
    columns: ['Tool', 'Calls', 'Success', 'P95 latency'],
    rows: [
      ['Search catalogue', '1,248', '99.0%', '820 ms'],
      ['Get product', '662', '99.5%', '410 ms'],
      ['Add to basket', '184', '97.8%', '360 ms'],
    ],
  },
  Sentiment: {
    description:
      'Aggregate, privacy-thresholded estimates across consenting conversations.',
    metrics: [
      ['Positive', '48%', '+4.0 pp'],
      ['Negative', '9%', '−2.0 pp'],
      ['Resolution rate', '76%', '+5.0 pp'],
    ],
    columns: ['Topic', 'Analysed', 'Negative', 'Resolution'],
    rows: [
      ['Delivery', '108', '12%', '71%'],
      ['Product fit', '146', '7%', '82%'],
      ['Returns', '64', '14%', '69%'],
    ],
  },
  Conversations: {
    description:
      'Redacted conversation outcomes. Opening text requires permission and creates an audit record.',
    metrics: [
      ['Analysed', '412', '+18.0%'],
      ['Resolved', '313', '+24.0%'],
      ['Unanswered', '38', '−8.0%'],
    ],
    columns: ['Conversation', 'Topic', 'Sentiment', 'Status'],
    rows: [
      ['conv_…8f31', 'Lamp compatibility', 'Neutral · 0.84', 'Resolved'],
      ['conv_…21ba', 'Bag dimensions', 'Negative · 0.78', 'Unresolved'],
      ['conv_…c902', 'Returns', 'Mixed · 0.66', 'Resolved'],
    ],
  },
  Operations: {
    description:
      'Queue health, integration errors, latency, data quality, and retention.',
    metrics: [
      ['Pending jobs', '14', 'Normal'],
      ['Dead letters', '0', 'Clear'],
      ['Data freshness', '4 min', 'Healthy'],
    ],
    columns: ['Check', 'Status', 'Last run', 'Detail'],
    rows: [
      ['Sentiment queue', 'Healthy', '2 min ago', '14 pending'],
      ['Daily aggregates', 'Healthy', '35 min ago', 'Reconciled'],
      ['Retention', 'Healthy', '10 h ago', '428 texts expired'],
    ],
  },
}

export function ReportPage({ title }: { title: keyof typeof data }) {
  const report = data[title]!
  return (
    <main className="analytics-page">
      <header className="admin-top">
        <div>
          <p>Analytics / {title}</p>
          <h1>{title}</h1>
          <span>{report.description}</span>
        </div>
        <div className="admin-controls">
          <span className="admin-control-label">
            <CalendarDays aria-hidden="true" /> Last 30 days
          </span>
          <a
            href={`/api/analytics/export?report=${encodeURIComponent(title.toLowerCase())}`}
          >
            <Download aria-hidden="true" /> Export
          </a>
        </div>
      </header>
      <section className="metric-grid compact">
        {report.metrics.map(([label, value, change]) => (
          <article key={label}>
            <p>
              {label}
              <Info aria-hidden="true" />
            </p>
            <strong>{value}</strong>
            <span>
              <TrendingUp aria-hidden="true" />
              {change}
            </span>
          </article>
        ))}
      </section>
      <article className="dashboard-card report-table">
        <header>
          <p className="eyebrow">Detailed report</p>
          <h2>{title} breakdown</h2>
        </header>
        <table>
          <thead>
            <tr>
              {report.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {report.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) => (
                  <td key={`${cell}-${index}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      <div className="method-note">
        <Info aria-hidden="true" />
        <p>
          <b>Method note</b> Results use server-side aggregates, documented
          attribution windows, and equal-length previous periods. Small
          sentiment groups are suppressed.
        </p>
      </div>
    </main>
  )
}
