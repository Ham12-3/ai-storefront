import { notFound } from 'next/navigation'
import { policies } from '@/data/policies'

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const policy = policies[slug as keyof typeof policies]
  if (!policy) notFound()
  return (
    <main className="policy-page">
      <p className="eyebrow">Customer information</p>
      <h1>{policy.title}</h1>
      <p className="policy-summary">{policy.summary}</p>
      {policy.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <small>Last reviewed 15 August 2026 · Demo content</small>
    </main>
  )
}
