import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Download,
  Info,
  RefreshCw,
} from 'lucide-react'
import { requireAnalyticsUser } from '@/auth/permissions'
import { overview } from '@/analytics/server/reports'
import { RevenueChart } from '@/components/analytics/charts'

export const dynamic = 'force-dynamic'
export default async function AnalyticsOverviewPage() {
  const user = await requireAnalyticsUser()
  return (
    <main className="analytics-page">
      <header className="admin-top">
        <div>
          <p>Analytics / Overview</p>
          <h1>Store performance</h1>
        </div>
        <div className="admin-controls">
          <button>
            <CalendarDays /> 17 Jul – 15 Aug 2026
          </button>
          <button>
            <RefreshCw /> Compare previous
          </button>
          <a href="/api/analytics/export">
            <Download /> Export CSV
          </a>
        </div>
      </header>
      {user.demo && (
        <div className="demo-notice">
          <Info /> Fictional demo metrics are shown. Configure Auth.js and
          PostgreSQL for production data.
        </div>
      )}
      <p className="updated">Last processed {overview.updated}</p>
      <section className="metric-grid">
        {overview.metrics.map((metric) => (
          <article key={metric.label}>
            <p>
              {metric.label}
              <Info />
            </p>
            <strong>{metric.value}</strong>
            <span className={metric.change.startsWith('+') ? 'positive' : ''}>
              {metric.change.startsWith('+') ? (
                <ArrowUpRight />
              ) : (
                <ArrowDownRight />
              )}
              {metric.change}
            </span>
            <small>vs previous period</small>
          </article>
        ))}
      </section>
      <section className="dashboard-grid">
        <article className="dashboard-card revenue-card">
          <header>
            <div>
              <p className="eyebrow">Revenue trend</p>
              <h2>Captured revenue</h2>
            </div>
            <span>
              <i /> Current <i /> Previous
            </span>
          </header>
          <RevenueChart data={overview.revenue} />
          <table className="sr-only">
            <caption>Revenue by date</caption>
            <thead>
              <tr>
                <th>Date</th>
                <th>Current</th>
                <th>Previous</th>
              </tr>
            </thead>
            <tbody>
              {overview.revenue.map((row) => (
                <tr key={row.day}>
                  <td>{row.day}</td>
                  <td>{row.revenue}</td>
                  <td>{row.previous}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
        <article className="dashboard-card funnel-card">
          <header>
            <p className="eyebrow">Conversion funnel</p>
            <h2>From visit to order</h2>
          </header>
          {overview.funnel.map((step) => (
            <div key={step.label}>
              <span>
                <b>{step.label}</b>
                <small>
                  {step.value.toLocaleString('en-GB')} · {step.rate}%
                </small>
              </span>
              <i>
                <em style={{ width: `${step.rate}%` }} />
              </i>
            </div>
          ))}
        </article>
        <article className="dashboard-card sentiment-card">
          <header>
            <p className="eyebrow">Customer sentiment</p>
            <h2>Analysed conversations</h2>
          </header>
          <div
            className="sentiment-ring"
            style={{
              background: `conic-gradient(${overview.sentiment.map((item, index) => `${item.colour} ${overview.sentiment.slice(0, index).reduce((sum, s) => sum + s.value, 0)}% ${overview.sentiment.slice(0, index + 1).reduce((sum, s) => sum + s.value, 0)}%`).join(',')})`,
            }}
          >
            <span>
              <b>412</b>
              <small>analysed</small>
            </span>
          </div>
          <ul>
            {overview.sentiment.map((item) => (
              <li key={item.label}>
                <i style={{ background: item.colour }} />
                {item.label}
                <b>{item.value}%</b>
              </li>
            ))}
          </ul>
          <small>
            Sentiment is an estimate. Groups below the privacy threshold are
            hidden.
          </small>
        </article>
        <article className="dashboard-card product-table">
          <header>
            <div>
              <p className="eyebrow">Product performance</p>
              <h2>Leading objects</h2>
            </div>
            <a href="/admin/analytics/products">
              View products <ArrowUpRight />
            </a>
          </header>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Views</th>
                <th>Basket</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {overview.topProducts.map((row) => (
                <tr key={row.product}>
                  <td>{row.product}</td>
                  <td>{row.views.toLocaleString('en-GB')}</td>
                  <td>{row.basket}</td>
                  <td>{row.orders}</td>
                  <td>{row.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </main>
  )
}
