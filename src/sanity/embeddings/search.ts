import type { SemanticSearchProvider, SemanticHit } from './provider'

type NativeSemanticHit = { productId: string; score: number }

export class SanityDatasetEmbeddingsProvider implements SemanticSearchProvider {
  constructor(
    private readonly config: {
      projectId: string
      dataset: string
      token?: string
      apiVersion?: string
    },
  ) {}

  async status() {
    if (!this.config.projectId || !this.config.token)
      return 'unavailable' as const
    const response = await fetch(
      `https://api.sanity.io/v2026-05-06/projects/${this.config.projectId}/datasets/${this.config.dataset}/settings/embeddings`,
      {
        headers: { Authorization: `Bearer ${this.config.token}` },
        cache: 'no-store',
      },
    )
    if (!response.ok) return 'unavailable' as const
    const body = (await response.json()) as {
      enabled?: boolean
      status?: string
    }
    if (!body.enabled) return 'unavailable' as const
    return body.status === 'ready' ? ('ready' as const) : ('updating' as const)
  }

  async search(query: string, limit: number): Promise<SemanticHit[]> {
    const groq = `*[_type == "product" && status == "active" && aiSearchEnabled == true]
      | score(text::semanticSimilarity($query))
      | order(_score desc)[0...$limit]{"productId": _id, "score": _score}`
    const apiVersion = this.config.apiVersion || '2026-08-15'
    const response = await fetch(
      `https://${this.config.projectId}.api.sanity.io/v${apiVersion}/data/query/${this.config.dataset}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.token
            ? { Authorization: `Bearer ${this.config.token}` }
            : {}),
        },
        body: JSON.stringify({ query: groq, params: { query, limit } }),
        cache: 'no-store',
      },
    )
    if (!response.ok)
      throw new Error(
        `Native Dataset Embeddings query failed (${response.status})`,
      )
    const body = (await response.json()) as { result?: NativeSemanticHit[] }
    return body.result ?? []
  }
}
