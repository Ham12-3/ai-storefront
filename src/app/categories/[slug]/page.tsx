import { notFound } from 'next/navigation'
import { categories, products } from '@/data/catalogue'
import { ProductCard } from '@/components/product/product-card'
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = categories.find((item) => item.slug === slug)
  if (!category) notFound()
  const matches = products.filter(
    (item) => item.category.toLowerCase().replaceAll(' ', '-') === slug,
  )
  return (
    <main className="listing-page">
      <header
        className="listing-header category-hero"
        style={{ '--category': category.colour } as React.CSSProperties}
      >
        <p className="eyebrow">Category</p>
        <h1>{category.name}</h1>
        <p>{category.note}</p>
      </header>
      <div className="catalogue-grid">
        {matches.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </main>
  )
}
