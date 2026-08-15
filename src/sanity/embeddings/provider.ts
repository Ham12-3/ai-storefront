export type SemanticHit = { productId: string; score: number }

export interface SemanticSearchProvider {
  search(query: string, limit: number): Promise<SemanticHit[]>
  status(): Promise<'ready' | 'updating' | 'unavailable'>
}

export class UnavailableSemanticProvider implements SemanticSearchProvider {
  async search() {
    return []
  }
  async status() {
    return 'unavailable' as const
  }
}
