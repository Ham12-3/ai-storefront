import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check, RotateCcw, Truck } from 'lucide-react'
import { products } from '@/data/catalogue'
import { ProductVisual } from '@/components/product/product-visual'
import { AddToBasket } from '@/components/product/add-to-basket'
import { ProductCard } from '@/components/product/product-card'
import { effectivePrice, formatMoney } from '@/commerce/money'

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = products.find((item) => item.slug === slug)
  if (!product) notFound()
  const price = effectivePrice(product)
  return (
    <main className="product-page">
      <Link href="/products" className="back-link">
        <ArrowLeft /> Back to all objects
      </Link>
      <section className="product-detail">
        <ProductVisual product={product} />
        <div className="product-info">
          <p className="eyebrow">
            {product.category} / {product.sku}
          </p>
          <h1>{product.title}</h1>
          <p className="lead">{product.shortDescription}</p>
          <div className="detail-price">
            <strong>{formatMoney(price)}</strong>
            {product.salePriceMinor && (
              <del>{formatMoney(product.basePriceMinor)}</del>
            )}
            <small>Tax included</small>
          </div>
          <p>{product.description}</p>
          <fieldset>
            <legend>Finish</legend>
            <div className="variant-options">
              {product.variants.map((variant, index) => (
                <label key={variant.variantId}>
                  <input
                    type="radio"
                    name="variant"
                    defaultChecked={index === 0}
                  />
                  <span
                    style={
                      { '--swatch': product.accent } as React.CSSProperties
                    }
                  >
                    <i />
                    {variant.name}
                    <small>
                      {variant.stock > 0
                        ? `${variant.stock} in stock`
                        : 'Out of stock'}
                    </small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <AddToBasket
            product={product}
            variantId={product.variants[0]?.variantId}
          />
          <div className="fulfilment">
            <span>
              <Truck />
              <b>Free delivery over £75</b>
              <small>Usually 2–4 working days</small>
            </span>
            <span>
              <RotateCcw />
              <b>30-day returns</b>
              <small>Keep the packaging until you decide</small>
            </span>
          </div>
        </div>
      </section>
      <section className="detail-facts">
        <div>
          <p className="eyebrow">Why it works</p>
          <h2>
            Made to make
            <br />
            focus feel easier.
          </h2>
        </div>
        <ul>
          {product.features.map((feature) => (
            <li key={feature}>
              <Check />
              {feature}
            </li>
          ))}
        </ul>
        <div>
          <p className="eyebrow">Materials</p>
          {product.materials.map((material) => (
            <p key={material}>{material}</p>
          ))}
        </div>
      </section>
      <section className="related">
        <h2>Works well with</h2>
        <div className="product-grid">
          {products
            .filter((item) => item.id !== product.id)
            .slice(0, 3)
            .map((item, index) => (
              <ProductCard key={item.id} product={item} index={index} />
            ))}
        </div>
      </section>
    </main>
  )
}
