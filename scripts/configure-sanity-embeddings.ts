import { productEmbeddingProjection } from '../src/sanity/embeddings/projection'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_MANAGEMENT_TOKEN
const mode = process.argv[2] || 'enable'

if (!projectId || !token) {
  console.error(
    'Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_MANAGEMENT_TOKEN before changing Dataset Embeddings.',
  )
  process.exitCode = 1
} else {
  const response = await fetch(
    `https://api.sanity.io/v2026-05-06/projects/${projectId}/datasets/${dataset}/settings/embeddings`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        enabled: true,
        projection: productEmbeddingProjection,
      }),
    },
  )
  if (!response.ok) {
    console.error(
      `Sanity rejected the ${mode} request (${response.status}): ${await response.text()}`,
    )
    process.exitCode = 1
  } else
    console.log(
      `Dataset Embeddings ${mode === 'update' ? 'projection update' : 'enablement'} accepted for ${dataset}. Generation is asynchronous; run pnpm embeddings:status.`,
    )
}
