import Link from 'next/link'
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import { categories, products } from '@/data/catalogue'
import { ProductCard } from '@/components/product/product-card'
import { ProductVisual } from '@/components/product/product-visual'
import { formatMoney, effectivePrice } from '@/commerce/money'
import { GuideButton } from '@/components/common/guide-button'

export default function HomePage() {
  const hero = products[0]!
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">Workspace essentials / The Focus Edit</p>
          <h1>Workspace essentials</h1>
          <p>
            Lighting, furniture and desk tools selected for smaller, calmer
            workspaces.
          </p>
          <div className="hero-actions">
            <Link className="primary-cta" href="/products">
              Shop all products{' '}
              <span>
                <ArrowRight />
              </span>
            </Link>
            <Link className="text-cta" href="/categories/desk-tools">
              Browse desk tools <ArrowRight />
            </Link>
          </div>
        </div>
        <Link href={`/products/${hero.slug}`} className="hero-product">
          <ProductVisual product={hero} />
          <div className="hero-product-meta">
            <span>Featured object</span>
            <div>
              <strong>{hero.title}</strong>
              <p>{formatMoney(effectivePrice(hero))}</p>
            </div>
          </div>
        </Link>
        <div className="hero-rail">
          <span>{hero.materials.join(' / ')}</span>
          <span>{hero.features[1]}</span>
        </div>
      </section>
      <section className="trust-strip">
        <div>
          <Truck />
          <span>
            <b>Free UK delivery</b>
            <small>On orders over £75</small>
          </span>
        </div>
        <div>
          <ShieldCheck />
          <span>
            <b>Built to be kept</b>
            <small>Clear materials &amp; guarantees</small>
          </span>
        </div>
        <div>
          <span aria-hidden="true">?</span>
          <span>
            <b>Useful product help</b>
            <small>Answers checked against the catalogue</small>
          </span>
        </div>
      </section>
      <section className="section categories-section">
        <div className="section-heading">
          <p className="eyebrow">Browse the range</p>
          <h2>Shop by category</h2>
          <p>Start with the part of your workspace that needs attention.</p>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              href={`/categories/${category.slug}`}
              className="category-card"
              style={{ '--category': category.colour } as React.CSSProperties}
              key={category.slug}
            >
              <span>
                {
                  products.filter(
                    (product) => product.category === category.name,
                  ).length
                }{' '}
                objects
              </span>
              <div>
                <h3>{category.name}</h3>
                <p>{category.note}</p>
              </div>
              <ArrowRight />
            </Link>
          ))}
        </div>
      </section>
      <section className="section workbench" id="workbench">
        <div className="workbench-heading">
          <div>
            <p className="eyebrow">Selected for everyday work</p>
            <h2>Featured products</h2>
          </div>
          <Link href="/products">
            View all 12 products <ArrowRight />
          </Link>
        </div>
        <div className="product-grid">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard product={product} index={index} key={product.id} />
          ))}
        </div>
      </section>
      <section className="guide-banner">
        <div>
          <span aria-hidden="true">Product guide</span>
          <p className="eyebrow">Product help</p>
          <h2>Need help choosing?</h2>
          <p>
            Tell us the space, budget, or problem. The guide checks this
            catalogue and returns a short, explainable answer.
          </p>
          <GuideButton light />
        </div>
        <div className="guide-dialogue">
          <p>“I need a compact desk setup under £100.”</p>
          <span>3 objects matched / prices and stock checked</span>
          <div>
            {products
              .filter((p) => effectivePrice(p) < 10000)
              .slice(0, 3)
              .map((p) => (
                <ProductVisual product={p} compact key={p.id} />
              ))}
          </div>
        </div>
      </section>
    </main>
  )
}
