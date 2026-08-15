import { StudioApp } from '@/components/studio/studio-app'

export const dynamic = 'force-static'
export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
    return (
      <main className="studio-setup">
        <p className="eyebrow">Sanity Studio / Setup required</p>
        <h1>Connect Sanity Studio</h1>
        <p>
          Add your Sanity project ID and dataset to <code>.env.local</code>,
          then restart the development server.
        </p>
        <pre>
          NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id{`\n`}
          NEXT_PUBLIC_SANITY_DATASET=production
        </pre>
        <a
          href="https://www.sanity.io/manage"
          target="_blank"
          rel="noreferrer"
          className="primary-cta"
        >
          Open Sanity management
        </a>
      </main>
    )
  return <StudioApp />
}
