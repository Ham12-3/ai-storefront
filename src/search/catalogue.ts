import { products } from '@/data/catalogue'
import { effectivePrice } from '@/commerce/money'
import type { Product, SearchFilters } from '@/types/catalogue'
import type { SemanticSearchProvider } from '@/sanity/embeddings/provider'

const synonyms: Record<string, string[]> = {
  trainers: ['sneakers', 'running shoes'],
  'laptop bag': ['computer bag', 'notebook bag', 'commuter backpack'],
  lamp: ['light', 'lighting', 'uplighter'],
  organiser: ['organizer', 'storage', 'tidy', 'catchall'],
}

export function expandQuery(query: string) {
  const lower = query.toLowerCase()
  const additions = Object.entries(synonyms).flatMap(([canonical, values]) =>
    lower.includes(canonical) || values.some((value) => lower.includes(value))
      ? [canonical, ...values]
      : [],
  )
  return Array.from(new Set([lower, ...additions])).join(' ')
}

export function inferFilters(query: string): SearchFilters {
  const lower = query.toLowerCase()
  const budget = lower.match(
    /(?:under|below|less than|max(?:imum)?|up to)\s*£?\s*(\d+(?:\.\d{1,2})?)/,
  )
  const colours = [
    'ink',
    'blue',
    'cobalt',
    'orange',
    'moss',
    'silver',
    'chalk',
    'sand',
  ].filter((colour) => lower.includes(colour))
  const materials = [
    'wood',
    'aluminium',
    'steel',
    'nylon',
    'paper',
    'silicone',
  ].filter((material) => lower.includes(material))
  return {
    maxPriceMinor: budget?.[1]
      ? Math.round(Number(budget[1]) * 100)
      : undefined,
    colours: colours.length ? colours : undefined,
    materials: materials.length ? materials : undefined,
    inStock: true,
  }
}

export function buildSearchFilters(filters: SearchFilters) {
  const clauses = ['status == $active', 'aiSearchEnabled == true']
  const params: Record<string, unknown> = { active: 'active' }
  if (filters.category) {
    clauses.push('category->slug.current == $category')
    params.category = filters.category
  }
  if (filters.maxPriceMinor !== undefined) {
    clauses.push('coalesce(salePriceMinor, basePriceMinor) <= $maxPriceMinor')
    params.maxPriceMinor = filters.maxPriceMinor
  }
  if (filters.minPriceMinor !== undefined) {
    clauses.push('coalesce(salePriceMinor, basePriceMinor) >= $minPriceMinor')
    params.minPriceMinor = filters.minPriceMinor
  }
  return { filter: clauses.join(' && '), params }
}

function searchable(product: Product) {
  return [
    product.title,
    product.shortDescription,
    product.description,
    product.category,
    product.collection,
    ...product.features,
    ...product.materials,
    ...product.useCases,
    ...product.tags,
    ...product.searchKeywords,
  ]
    .join(' ')
    .toLowerCase()
}

export function keywordSearch(
  query: string,
  filters: SearchFilters = {},
  source = products,
) {
  const terms = expandQuery(query)
    .split(/\s+/)
    .filter((term) => term.length > 1)
  return source
    .filter((product) => product.status === 'active' && product.aiSearchEnabled)
    .map((product) => ({
      product,
      score: terms.reduce(
        (score, term) => score + (searchable(product).includes(term) ? 1 : 0),
        0,
      ),
    }))
    .filter(({ product, score }) => {
      const price = effectivePrice(product)
      const variants = product.variants.filter(
        (item) => item.active && (!filters.inStock || item.stock > 0),
      )
      return (
        score > 0 &&
        variants.length > 0 &&
        (filters.maxPriceMinor === undefined ||
          price <= filters.maxPriceMinor) &&
        (filters.minPriceMinor === undefined ||
          price >= filters.minPriceMinor) &&
        (!filters.category ||
          product.category.toLowerCase().replaceAll(' ', '-') ===
            filters.category) &&
        (!filters.colours?.length ||
          variants.some((v) =>
            filters.colours!.some((colour) =>
              v.colour.toLowerCase().includes(colour),
            ),
          )) &&
        (!filters.materials?.length ||
          product.materials.some((material) =>
            filters.materials!.some((filter) =>
              material.toLowerCase().includes(filter),
            ),
          ))
      )
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        effectivePrice(a.product) - effectivePrice(b.product),
    )
    .map(({ product }) => product)
}

export function dedupeProducts(items: Product[]) {
  return [...new Map(items.map((item) => [item.id, item])).values()]
}

export async function hybridSearch(
  query: string,
  provider: SemanticSearchProvider,
  filters = inferFilters(query),
  limit = 6,
) {
  const keyword = keywordSearch(query, filters)
  let semanticIds: string[] = []
  try {
    if ((await provider.status()) === 'ready')
      semanticIds = (await provider.search(query, limit)).map(
        (hit) => hit.productId,
      )
  } catch {
    semanticIds = []
  }

  // Fresh product resolution stands in for the non-CDN Sanity re-fetch in demo mode.
  const freshSemanticProducts = semanticIds.flatMap(
    (id) => products.find((product) => product.id === id) ?? [],
  )
  const validSemanticProducts = freshSemanticProducts.filter((product) => {
    const price = effectivePrice(product)
    return (
      product.status === 'active' &&
      product.variants.some((v) => v.active && v.stock > 0) &&
      (filters.maxPriceMinor === undefined || price <= filters.maxPriceMinor)
    )
  })
  return {
    products: dedupeProducts([...validSemanticProducts, ...keyword]).slice(
      0,
      limit,
    ),
    fallbackUsed: semanticIds.length === 0,
  }
}
