import type { Product } from '@/types/catalogue'

export function ProductVisual({
  product,
  compact = false,
}: {
  product: Product
  compact?: boolean
}) {
  return (
    <div
      className={`product-visual visual-${product.visual} ${compact ? 'compact' : ''}`}
      style={{ '--accent': product.accent } as React.CSSProperties}
      role="img"
      aria-label={`${product.title} product illustration`}
    >
      <span className="visual-shadow" />
      <span className="visual-object">
        <i />
        <b />
        <em />
      </span>
      <span className="visual-code">{product.sku}</span>
    </div>
  )
}
