// Run after `pnpm db:generate` and `pnpm db:migrate`.
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { products } from '../src/data/catalogue'

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://storefront:storefront_local_only@localhost:5432/ai_storefront',
})
const prisma = new PrismaClient({ adapter })
try {
  for (const product of products)
    for (const variant of product.variants)
      await prisma.inventoryItem.upsert({
        where: { variantId: variant.variantId },
        update: { stockQuantity: variant.stock, sku: variant.sku },
        create: {
          variantId: variant.variantId,
          sku: variant.sku,
          stockQuantity: variant.stock,
          reservedQuantity: 0,
        },
      })
  console.log(
    `Seeded inventory for ${products.reduce((sum, product) => sum + product.variants.length, 0)} variants.`,
  )
} finally {
  await prisma.$disconnect()
}
