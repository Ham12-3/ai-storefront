import { defineArrayMember, defineField, defineType } from 'sanity'
import { MoneyInput } from '@/sanity/components/money-input'

const slug = defineField({
  name: 'slug',
  title: 'Slug',
  type: 'slug',
  options: { source: 'title', maxLength: 96 },
  validation: (rule) => rule.required(),
})
const active = defineField({
  name: 'active',
  title: 'Active',
  type: 'boolean',
  initialValue: true,
})
const seo = defineField({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({ name: 'image', type: 'image' }),
  ],
})
const money = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'number',
    components: { input: MoneyInput },
    validation: (rule) => rule.integer().min(0),
    description:
      'Stored as integer minor units; editors enter a normal GBP decimal.',
  })
const portableText = [defineArrayMember({ type: 'block' })]

const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    slug,
    defineField({
      name: 'status',
      type: 'string',
      options: { list: ['active', 'hidden', 'archived'], layout: 'radio' },
      initialValue: 'active',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({ name: 'description', type: 'array', of: portableText }),
    defineField({
      name: 'images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', type: 'string' })],
        }),
      ],
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'collections',
      type: 'array',
      of: [
        defineArrayMember({ type: 'reference', to: [{ type: 'collection' }] }),
      ],
    }),
    defineField({ name: 'brandName', type: 'string' }),
    defineField({
      name: 'features',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'productFacts',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'materials',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'careInstructions', type: 'text' }),
    defineField({
      name: 'useCases',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'searchKeywords',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    money('basePriceMinor', 'Regular price'),
    money('salePriceMinor', 'Sale price'),
    defineField({
      name: 'currency',
      type: 'string',
      initialValue: 'GBP',
      readOnly: true,
    }),
    defineField({ name: 'taxCategory', type: 'string' }),
    defineField({
      name: 'variants',
      type: 'array',
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'productVariant',
          fields: [
            defineField({
              name: 'variantId',
              type: 'string',
              initialValue: () => crypto.randomUUID(),
              readOnly: true,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'sku',
              title: 'SKU',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'optionValues',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
            }),
            defineField({ name: 'size', type: 'string' }),
            defineField({ name: 'colour', type: 'string' }),
            defineField({ name: 'material', type: 'string' }),
            money('priceOverrideMinor', 'Price override'),
            money('salePriceOverrideMinor', 'Sale price override'),
            defineField({ name: 'image', type: 'image' }),
            defineField({ name: 'weightGrams', type: 'number' }),
            defineField({
              name: 'active',
              type: 'boolean',
              initialValue: true,
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'sku' } },
        }),
      ],
    }),
    defineField({ name: 'deliveryInformation', type: 'text' }),
    seo,
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
    defineField({
      name: 'aiSearchEnabled',
      title: 'Include in AI search',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'internalNotes',
      type: 'text',
      description: 'Never included in embeddings or public APIs.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'sku', media: 'images.0' } },
})

const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    slug,
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'image', type: 'image' }),
    defineField({
      name: 'searchKeywords',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    seo,
    active,
  ],
})
const collection = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    slug,
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'heroImage', type: 'image' }),
    defineField({
      name: 'products',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
    }),
    defineField({ name: 'startDate', type: 'datetime' }),
    defineField({ name: 'endDate', type: 'datetime' }),
    active,
    seo,
  ],
})
const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({ name: 'announcementBar', type: 'string' }),
    defineField({ name: 'heroHeading', type: 'string' }),
    defineField({ name: 'heroText', type: 'text' }),
    defineField({ name: 'heroImage', type: 'image' }),
    defineField({
      name: 'heroCallToAction',
      type: 'object',
      fields: [
        defineField({ name: 'label', type: 'string' }),
        defineField({ name: 'href', type: 'string' }),
      ],
    }),
    defineField({
      name: 'featuredCategories',
      type: 'array',
      of: [
        defineArrayMember({ type: 'reference', to: [{ type: 'category' }] }),
      ],
    }),
    defineField({
      name: 'featuredProducts',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
    }),
    defineField({
      name: 'featuredCollections',
      type: 'array',
      of: [
        defineArrayMember({ type: 'reference', to: [{ type: 'collection' }] }),
      ],
    }),
    defineField({
      name: 'trustMessages',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'promotionalSections',
      type: 'array',
      of: portableText,
    }),
    seo,
  ],
})
const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: ['headerLinks', 'footerLinks', 'supportLinks', 'socialLinks'].map(
    (name) =>
      defineField({
        name,
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            fields: [
              defineField({ name: 'label', type: 'string' }),
              defineField({ name: 'href', type: 'string' }),
            ],
          }),
        ],
      }),
  ),
})
const faq = defineType({
  name: 'faq',
  title: 'Frequently asked question',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'answer', type: 'array', of: portableText }),
    defineField({ name: 'topic', type: 'string' }),
    defineField({ name: 'displayOrder', type: 'number' }),
    defineField({
      name: 'aiSearchEnabled',
      type: 'boolean',
      initialValue: true,
    }),
    active,
  ],
})
const policy = defineType({
  name: 'policy',
  title: 'Policy',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    slug,
    defineField({
      name: 'policyType',
      type: 'string',
      options: { list: ['delivery', 'returns', 'privacy', 'terms'] },
    }),
    defineField({ name: 'summary', type: 'text' }),
    defineField({ name: 'body', type: 'array', of: portableText }),
    defineField({ name: 'lastReviewedDate', type: 'date' }),
    defineField({
      name: 'aiSearchEnabled',
      type: 'boolean',
      initialValue: true,
    }),
    active,
  ],
})
const knowledgeArticle = defineType({
  name: 'knowledgeArticle',
  title: 'Knowledge article',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    slug,
    defineField({ name: 'summary', type: 'text' }),
    defineField({ name: 'body', type: 'array', of: portableText }),
    defineField({ name: 'topic', type: 'string' }),
    defineField({
      name: 'relatedProducts',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
    }),
    defineField({
      name: 'searchKeywords',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'aiSearchEnabled',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'internalOnly', type: 'boolean', initialValue: false }),
    active,
  ],
})
const searchSynonym = defineType({
  name: 'searchSynonym',
  title: 'Search synonym',
  type: 'document',
  fields: [
    defineField({ name: 'canonicalTerm', type: 'string' }),
    defineField({
      name: 'alternatives',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    active,
  ],
})
const assistantSettings = defineType({
  name: 'assistantSettings',
  title: 'AI assistant settings',
  type: 'document',
  fields: [
    defineField({ name: 'displayName', type: 'string' }),
    defineField({ name: 'greeting', type: 'text' }),
    defineField({
      name: 'suggestedQuestions',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'toneGuidance',
      type: 'text',
      description: 'Cannot override grounding or security rules.',
    }),
    defineField({ name: 'fallbackResponse', type: 'text' }),
    defineField({
      name: 'maximumRecommendedProducts',
      type: 'number',
      validation: (rule) => rule.integer().min(1).max(6),
    }),
    defineField({
      name: 'allowedPolicyTopics',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'storeSpecificGuidance', type: 'text' }),
  ],
})
const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'storeName', type: 'string' }),
    defineField({ name: 'logo', type: 'image' }),
    defineField({ name: 'favicon', type: 'image' }),
    defineField({
      name: 'defaultCurrency',
      type: 'string',
      initialValue: 'GBP',
    }),
    defineField({ name: 'locale', type: 'string', initialValue: 'en-GB' }),
    defineField({ name: 'supportEmail', type: 'string' }),
    defineField({ name: 'supportTelephone', type: 'string' }),
    defineField({ name: 'businessAddress', type: 'text' }),
    money('freeDeliveryThresholdMinor', 'Free delivery threshold'),
    seo,
    defineField({
      name: 'socialLinks',
      type: 'array',
      of: [defineArrayMember({ type: 'url' })],
    }),
    defineField({
      name: 'themeSettings',
      type: 'object',
      fields: [
        defineField({ name: 'primaryColour', type: 'string' }),
        defineField({ name: 'accentColour', type: 'string' }),
        defineField({ name: 'backgroundColour', type: 'string' }),
      ],
    }),
  ],
})
const analyticsSuggestion = defineType({
  name: 'analyticsSuggestion',
  title: 'Analytics content suggestion',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({
      name: 'suggestionType',
      type: 'string',
      options: {
        list: ['faq', 'knowledgeArticle', 'productContent', 'searchSynonym'],
      },
    }),
    defineField({ name: 'sourceInsightId', type: 'string', readOnly: true }),
    defineField({ name: 'dateRange', type: 'string', readOnly: true }),
    defineField({
      name: 'relatedProduct',
      type: 'reference',
      to: [{ type: 'product' }],
    }),
    defineField({ name: 'relatedTopic', type: 'string' }),
    defineField({
      name: 'evidenceSummary',
      type: 'text',
      readOnly: true,
      description: 'Anonymised evidence only.',
    }),
    defineField({ name: 'proposedContent', type: 'array', of: portableText }),
    defineField({ name: 'reason', type: 'text' }),
    defineField({
      name: 'confidence',
      type: 'number',
      validation: (rule) => rule.min(0).max(1),
    }),
    defineField({
      name: 'reviewStatus',
      type: 'string',
      options: { list: ['pending', 'accepted', 'rejected', 'edited'] },
      initialValue: 'pending',
    }),
    defineField({ name: 'reviewerNotes', type: 'text' }),
    defineField({ name: 'createdAt', type: 'datetime', readOnly: true }),
  ],
})

export const schemaTypes = [
  product,
  category,
  collection,
  homepage,
  navigation,
  faq,
  policy,
  knowledgeArticle,
  searchSynonym,
  assistantSettings,
  siteSettings,
  analyticsSuggestion,
]
