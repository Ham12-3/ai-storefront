import Link from 'next/link'
import type { Product } from '@/types/catalogue'
import { formatMoney, effectivePrice } from '@/commerce/money'
import { ProductVisual } from './product-visual'
import { AddToBasket } from './add-to-basket'

export function ProductCard({ product }: { product: Product; index?: number }) {
  const price = effectivePrice(product)
  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-image-link">
        <ProductVisual product={product} compact />
        {product.salePriceMinor && <span className="card-index">Reduced</span>}
      </Link>
      <div className="product-card-body">
        <div>
          <p className="eyebrow">{product.category}</p>
          <h3>
            <Link href={`/products/${product.slug}`}>{product.title}</Link>
          </h3>
        </div>
        <p>{product.shortDescription}</p>
        <div className="price-row">
          <span>{formatMoney(price)}</span>
          {product.salePriceMinor && (
            <del>{formatMoney(product.basePriceMinor)}</del>
          )}
          <AddToBasket product={product} compact />
        </div>
      </div>
    </article>
  )
}
