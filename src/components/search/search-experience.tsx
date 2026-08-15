'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { products } from '@/data/catalogue'
import { inferFilters, keywordSearch } from '@/search/catalogue'
import { ProductCard } from '@/components/product/product-card'

export function SearchExperience({ initial = '' }: { initial?: string }) {
  const [query, setQuery] = useState(initial)
  const results = useMemo(
    () => (query.trim() ? keywordSearch(query, inferFilters(query)) : products),
    [query],
  )
  return (
    <div>
      <form className="search-box" onSubmit={(event) => event.preventDefault()}>
        <Search />
        <input
          name="catalogue-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “a portable desk setup under £100”…"
          autoComplete="off"
          aria-label="Search the catalogue"
        />
        <button type="button">
          <SlidersHorizontal /> Filters
        </button>
      </form>
      {query && (
        <div className="search-summary">
          <p>
            <Sparkles /> Interpreting “{query}”
          </p>
          <span>{results.length} current matches · keyword fallback ready</span>
        </div>
      )}
      <div className="catalogue-grid">
        {results.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
      {query && results.length === 0 && (
        <div className="empty-state">
          <h2>No useful matches yet.</h2>
          <p>
            Try a broader material, use case, or budget. The query has been
            recorded without personal details so the team can improve the
            catalogue.
          </p>
        </div>
      )}
    </div>
  )
}
