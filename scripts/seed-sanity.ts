import { createClient } from 'next-sanity'
import { products } from '../src/data/catalogue'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

const block = (text: string) => [
  {
    _type: 'block',
    _key: crypto.randomUUID().slice(0, 8),
    style: 'normal',
    markDefs: [],
    children: [
      { _type: 'span', _key: crypto.randomUUID().slice(0, 8), text, marks: [] },
    ],
  },
]
const categoryNames = [...new Set(products.map((product) => product.category))]
const categoryId = (name: string) =>
  `category-${name.toLowerCase().replaceAll(' ', '-')}`

const documents = [
  ...categoryNames.map((title) => ({
    _id: categoryId(title),
    _type: 'category',
    title,
    slug: { _type: 'slug', current: title.toLowerCase().replaceAll(' ', '-') },
    description: `Considered ${title.toLowerCase()} for focused work.`,
    searchKeywords: [title.toLowerCase()],
    active: true,
  })),
  ...products.map((product) => ({
    _id: product.id,
    _type: 'product',
    title: product.title,
    slug: { _type: 'slug', current: product.slug },
    status: product.status,
    sku: product.sku,
    shortDescription: product.shortDescription,
    description: block(product.description),
    category: { _type: 'reference', _ref: categoryId(product.category) },
    brandName: 'Form & Function',
    features: product.features,
    materials: product.materials,
    useCases: product.useCases,
    tags: product.tags,
    searchKeywords: product.searchKeywords,
    basePriceMinor: product.basePriceMinor,
    salePriceMinor: product.salePriceMinor,
    currency: product.currency,
    variants: product.variants.map((variant) => ({
      _key: variant.variantId,
      _type: 'productVariant',
      ...variant,
      stock: undefined,
    })),
    featured: product.featured,
    aiSearchEnabled: product.aiSearchEnabled,
    deliveryInformation: 'UK delivery normally takes 2–4 working days.',
  })),
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    storeName: 'Form & Function',
    defaultCurrency: 'GBP',
    locale: 'en-GB',
    supportEmail: 'hello@formandfunction.example',
    freeDeliveryThresholdMinor: 7500,
    themeSettings: {
      primaryColour: '#4c6fff',
      accentColour: '#ff5c35',
      backgroundColour: '#f4f7f8',
    },
  },
  {
    _id: 'homepage',
    _type: 'homepage',
    announcementBar: 'Free UK delivery over £75 · 30-day considered returns',
    heroHeading: 'Make room for better work.',
    heroText:
      'Useful objects with clear intent—designed for deep focus, gentle routines, and wherever work happens next.',
    trustMessages: [
      'Free UK delivery',
      'Built to be kept',
      'Ask before you buy',
    ],
  },
  {
    _id: 'assistantSettings',
    _type: 'assistantSettings',
    displayName: 'F&F Guide',
    greeting: 'Tell me what you’re making space for.',
    suggestedQuestions: [
      'A desk setup under £100',
      'Compare the task lights',
      'What is the returns policy?',
    ],
    toneGuidance:
      'Clear, considered, concise. Never override grounding or security rules.',
    fallbackResponse:
      'I cannot check that detail right now. You can continue browsing the catalogue.',
    maximumRecommendedProducts: 3,
    allowedPolicyTopics: ['delivery', 'returns', 'privacy', 'terms'],
  },
  {
    _id: 'faq-delivery',
    _type: 'faq',
    question: 'How long does UK delivery take?',
    answer: block(
      'Most UK orders arrive in 2–4 working days. Larger furniture uses a scheduled two-person service.',
    ),
    topic: 'delivery',
    displayOrder: 1,
    aiSearchEnabled: true,
    active: true,
  },
  {
    _id: 'faq-returns',
    _type: 'faq',
    question: 'How do returns work?',
    answer: block(
      'Unused products may be returned within 30 days. Contact support before returning furniture.',
    ),
    topic: 'returns',
    displayOrder: 2,
    aiSearchEnabled: true,
    active: true,
  },
  ...(['delivery', 'returns', 'privacy', 'terms'] as const).map((type) => ({
    _id: `policy-${type}`,
    _type: 'policy',
    title: type[0]!.toUpperCase() + type.slice(1),
    slug: { _type: 'slug', current: type },
    policyType: type,
    summary: `Clear ${type} information for customers.`,
    body: block(
      `This is fictional ${type} policy demo content and requires legal review before production use.`,
    ),
    lastReviewedDate: '2026-08-15',
    aiSearchEnabled: true,
    active: true,
  })),
  {
    _id: 'knowledge-materials',
    _type: 'knowledgeArticle',
    title: 'Materials and care',
    slug: { _type: 'slug', current: 'materials-and-care' },
    summary: 'How Form & Function selects and describes materials.',
    body: block(
      'Product pages list the exact materials and care notes supplied by the catalogue team.',
    ),
    topic: 'materials',
    aiSearchEnabled: true,
    internalOnly: false,
    active: true,
  },
  {
    _id: 'synonym-laptop-bag',
    _type: 'searchSynonym',
    canonicalTerm: 'laptop bag',
    alternatives: ['computer bag', 'notebook bag', 'commuter backpack'],
    active: true,
  },
]

if (!projectId || !token) {
  console.error(
    'Sanity seed is ready but credentials are missing. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN.',
  )
  process.exitCode = 1
} else {
  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2026-08-15',
    token,
    useCdn: false,
  })
  let transaction = client.transaction()
  for (const document of documents as Array<{
    _id: string
    _type: string
    [key: string]: unknown
  }>)
    transaction = transaction.createOrReplace(document)
  await transaction.commit()
  console.log(
    `Seeded ${documents.length} documents, including ${products.length} fictional products, into ${dataset}.`,
  )
}
