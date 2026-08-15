import Link from 'next/link'
import { ProductCard } from '@/components/product/product-card'
import { products } from '@/data/catalogue'

export const metadata = { title: 'All objects' }
export default function ProductsPage() {
  return (
    <main className="listing-page">
      <header className="listing-header">
        <p className="eyebrow">Shop all</p>
        <h1>Workspace products</h1>
        <p>
          {products.length} dependable tools for desks, studios, and work on the
          move.
        </p>
      </header>
      <nav className="filter-bar" aria-label="Product categories">
        <Link href="/products">
          All products <b>{products.length}</b>
        </Link>
        <Link href="/categories/furniture">Furniture</Link>
        <Link href="/categories/lighting">Lighting</Link>
        <Link href="/categories/desk-tools">Desk tools</Link>
        <Link href="/categories/carry">Carry</Link>
        <span>{products.length} products · Featured order</span>
      </nav>
      <div className="catalogue-grid">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </main>
  )
}
