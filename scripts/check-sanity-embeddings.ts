export {}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_MANAGEMENT_TOKEN
if (!projectId || !token) {
  console.error(
    'Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_MANAGEMENT_TOKEN to check Dataset Embeddings.',
  )
  process.exitCode = 1
} else {
  const response = await fetch(
    `https://api.sanity.io/v2026-05-06/projects/${projectId}/datasets/${dataset}/settings/embeddings`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  if (!response.ok) {
    console.error(
      `Status request failed (${response.status}): ${await response.text()}`,
    )
    process.exitCode = 1
  } else {
    const status = (await response.json()) as {
      enabled: boolean
      status: 'ready' | 'updating' | 'error'
      projection?: string
    }
    console.log(JSON.stringify(status, null, 2))
    if (status.status !== 'ready')
      console.log(
        'Semantic search will use keyword fallback until status is ready.',
      )
  }
}
