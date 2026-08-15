import { describe, expect, it } from 'vitest'
import {
  buildSearchFilters,
  dedupeProducts,
  hybridSearch,
  inferFilters,
  keywordSearch,
} from '@/search/catalogue'
import { products } from '@/data/catalogue'
import {
  UnavailableSemanticProvider,
  type SemanticSearchProvider,
} from '@/sanity/embeddings/provider'

describe('hybrid catalogue search', () => {
  it('constructs parameterised filters rather than interpolating input', () => {
    const built = buildSearchFilters({
      category: 'desk-tools',
      maxPriceMinor: 5000,
    })
    expect(built.filter).toContain('$category')
    expect(built.filter).toContain('$maxPriceMinor')
    expect(built.params).toEqual({
      active: 'active',
      category: 'desk-tools',
      maxPriceMinor: 5000,
    })
  })
  it('infers and applies exact budgets', () => {
    expect(inferFilters('portable desk tools under £50').maxPriceMinor).toBe(
      5000,
    )
    expect(
      keywordSearch(
        'portable desk tools under £50',
        inferFilters('portable desk tools under £50'),
      ).every(
        (product) => (product.salePriceMinor ?? product.basePriceMinor) <= 5000,
      ),
    ).toBe(true)
  })
  it('deduplicates products by stable document ID', () => {
    expect(
      dedupeProducts([products[0]!, products[0]!, products[1]!]),
    ).toHaveLength(2)
  })
  it('falls back when semantic search is unavailable', async () => {
    const result = await hybridSearch(
      'desk lamp',
      new UnavailableSemanticProvider(),
    )
    expect(result.fallbackUsed).toBe(true)
    expect(result.products[0]?.title).toMatch(/lamp/i)
  })
  it('freshly resolves semantic IDs and excludes hidden products', async () => {
    const provider: SemanticSearchProvider = {
      status: async () => 'ready',
      search: async () => [
        { productId: products[0]!.id, score: 1 },
        { productId: 'missing', score: 0.9 },
      ],
    }
    const result = await hybridSearch('light for work', provider)
    expect(
      result.products.some((product) => product.id === products[0]!.id),
    ).toBe(true)
    expect(result.products.some((product) => product.id === 'missing')).toBe(
      false,
    )
  })
})
