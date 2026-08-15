import type { StructureResolver } from 'sanity/structure'

const sections = [
  [
    'Catalogue',
    [
      ['Products', 'product'],
      ['Categories', 'category'],
      ['Collections', 'collection'],
    ],
  ],
  [
    'Merchandising',
    [
      ['Homepage', 'homepage'],
      ['Navigation', 'navigation'],
    ],
  ],
  [
    'Customer information',
    [
      ['Frequently asked questions', 'faq'],
      ['Policies', 'policy'],
    ],
  ],
  [
    'AI knowledge',
    [
      ['Knowledge articles', 'knowledgeArticle'],
      ['Search synonyms', 'searchSynonym'],
      ['Assistant settings', 'assistantSettings'],
    ],
  ],
  ['Store configuration', [['Site settings', 'siteSettings']]],
  [
    'Analytics-generated drafts',
    [['Human-reviewed suggestions', 'analyticsSuggestion']],
  ],
] as const

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Form & Function')
    .items(
      sections.map(([title, items]) =>
        S.listItem()
          .title(title)
          .child(
            S.list()
              .title(title)
              .items(
                items.map(([label, type]) =>
                  S.documentTypeListItem(type).title(label),
                ),
              ),
          ),
      ),
    )
