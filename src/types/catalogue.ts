export type ProductStatus = 'active' | 'hidden' | 'archived'

export type ProductVariant = {
  variantId: string
  name: string
  sku: string
  size?: string
  colour: string
  material: string
  priceOverrideMinor?: number
  salePriceOverrideMinor?: number
  active: boolean
  stock: number
}

export type Product = {
  id: string
  slug: string
  title: string
  sku: string
  status: ProductStatus
  shortDescription: string
  description: string
  category: string
  collection: string
  features: string[]
  materials: string[]
  useCases: string[]
  tags: string[]
  searchKeywords: string[]
  basePriceMinor: number
  salePriceMinor?: number
  currency: 'GBP'
  featured: boolean
  aiSearchEnabled: boolean
  accent: string
  visual: 'lamp' | 'bag' | 'desk' | 'chair' | 'bottle' | 'tray'
  variants: ProductVariant[]
}

export type SearchFilters = {
  maxPriceMinor?: number
  minPriceMinor?: number
  colours?: string[]
  materials?: string[]
  category?: string
  inStock?: boolean
}
