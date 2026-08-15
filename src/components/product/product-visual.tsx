import Image from 'next/image'
import type { Product } from '@/types/catalogue'

const productImages: Record<string, string> = {
  lamp: 'https://images.unsplash.com/photo-1557930137-1e47d53212ad?auto=format&fit=crop&q=85&w=1600',
  bag: '/images/products/work-bag.png',
  desk: '/images/products/desk-system.png',
  chair:
    'https://images.unsplash.com/photo-1688578735427-994ecdea3ea4?auto=format&fit=crop&q=85&w=1600',
  bottle:
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=85&w=1600',
  tray: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=1600',
}

export function ProductVisual({
  product,
  compact = false,
}: {
  product: Product
  compact?: boolean
}) {
  return (
    <div className={`product-visual ${compact ? 'compact' : ''}`}>
      <Image
        src={productImages[product.visual] ?? productImages.desk!}
        alt={`${product.title} in a workspace setting`}
        fill
        sizes={
          compact
            ? '(max-width: 720px) 50vw, 25vw'
            : '(max-width: 900px) 100vw, 50vw'
        }
        className="product-photo"
        priority={!compact && product.slug === 'arc-task-lamp'}
        unoptimized
      />
      <span className="visual-code">{product.sku}</span>
    </div>
  )
}
