'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { products } from '@/data/catalogue'
import { inferFilters, keywordSearch } from '@/search/catalogue'
import { ProductCard } from '@/components/product/product-card'

export function SearchExperience({ initial = '' }: { initial?: string }) {
  const [query, setQuery] = useState(initial)
  const deferredQuery = useDeferredValue(query)
  const router = useRouter()
  const pathname = usePathname()
  const results = useMemo(
    () =>
      deferredQuery.trim()
        ? keywordSearch(deferredQuery, inferFilters(deferredQuery))
        : products,
    [deferredQuery],
  )
  return (
    <div>
      <form
        className="search-box"
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
          const value = query.trim()
          router.replace(
            value ? `${pathname}?q=${encodeURIComponent(value)}` : pathname,
            { scroll: false },
          )
        }}
      >
        <Search aria-hidden="true" />
        <label className="sr-only" htmlFor="catalogue-search">
          Search products
        </label>
        <input
          id="catalogue-search"
          type="search"
          name="catalogue-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “a portable desk setup under £100”…"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            className="search-clear"
            aria-label="Clear search"
            onClick={() => {
              setQuery('')
              router.replace(pathname, { scroll: false })
            }}
          >
            <X aria-hidden="true" />
          </button>
        )}
      </form>
      {query && (
        <p className="search-summary" aria-live="polite">
          {results.length} {results.length === 1 ? 'result' : 'results'} for “
          {query}”
        </p>
      )}
      <div className="catalogue-grid">
        {results.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
      {query && results.length === 0 && (
        <div className="empty-state">
          <h2>No products match that search</h2>
          <p>Try a product type, material, or a broader price range.</p>
        </div>
      )}
    </div>
  )
}
