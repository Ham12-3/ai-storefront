import { StudioApp } from '@/components/studio/studio-app'

export const dynamic = 'force-static'
export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
    return (
      <main className="studio-setup">
        <p className="eyebrow">Sanity Studio / Setup required</p>
        <h1>
          Your content workspace
          <br />
          is ready to connect.
        </h1>
        <p>
          Create or choose a Sanity project, copy <code>.env.example</code> to{' '}
          <code>.env.local</code>, and add the public project ID and dataset.
          Restart the dev server and Studio will mount here with Sanity
          authentication.
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
