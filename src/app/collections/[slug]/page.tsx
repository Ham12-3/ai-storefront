import { products } from '@/data/catalogue'
import { ProductCard } from '@/components/product/product-card'
export default function CollectionPage() {
  const matches = products.filter(
    (item) => item.collection === 'The Focus Edit',
  )
  return (
    <main className="listing-page">
      <header className="listing-header">
        <p className="eyebrow">Collection / 01</p>
        <h1>The Focus Edit.</h1>
        <p>
          Light, order, and small ergonomic shifts for uninterrupted stretches.
        </p>
      </header>
      <div className="catalogue-grid">
        {matches.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </main>
  )
}
