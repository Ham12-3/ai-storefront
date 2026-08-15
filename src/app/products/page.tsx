import { ProductCard } from '@/components/product/product-card'
import { products } from '@/data/catalogue'

export const metadata = { title: 'All objects' }
export default function ProductsPage() {
  return (
    <main className="listing-page">
      <header className="listing-header">
        <p className="eyebrow">The full catalogue</p>
        <h1>
          Objects that
          <br />
          earn their place.
        </h1>
        <p>
          {products.length} considered tools for work, travel, and everyday
          rituals.
        </p>
      </header>
      <div className="filter-bar">
        <span>
          All objects <b>{products.length}</b>
        </span>
        <span>Furniture</span>
        <span>Lighting</span>
        <span>Desk tools</span>
        <span>Carry</span>
        <label>
          Sort{' '}
          <select defaultValue="featured">
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>
      <div className="catalogue-grid">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </main>
  )
}
