export const overview = {
  range: 'Last 30 days',
  updated: '15 Aug 2026 · 09:30 BST',
  metrics: [
    { label: 'Net revenue', value: '£42,680', change: '+12.4%', trend: 'up' },
    { label: 'Completed orders', value: '318', change: '+8.1%', trend: 'up' },
    { label: 'Conversion rate', value: '3.8%', change: '+0.4 pp', trend: 'up' },
    {
      label: 'AI-assisted revenue',
      value: '£9,740',
      change: '22.8% of total',
      trend: 'flat',
    },
  ],
  revenue: [
    { day: '18 Jul', revenue: 980, previous: 820 },
    { day: '22 Jul', revenue: 1440, previous: 1100 },
    { day: '26 Jul', revenue: 1190, previous: 1020 },
    { day: '30 Jul', revenue: 1820, previous: 1330 },
    { day: '03 Aug', revenue: 1580, previous: 1420 },
    { day: '07 Aug', revenue: 2150, previous: 1710 },
    { day: '11 Aug', revenue: 1940, previous: 1620 },
    { day: '15 Aug', revenue: 2320, previous: 1850 },
  ],
  funnel: [
    { label: 'Sessions', value: 8368, rate: 100 },
    { label: 'Product views', value: 5240, rate: 62.6 },
    { label: 'Basket additions', value: 1048, rate: 12.5 },
    { label: 'Checkout starts', value: 516, rate: 6.2 },
    { label: 'Orders', value: 318, rate: 3.8 },
  ],
  sentiment: [
    { label: 'Positive', value: 48, colour: '#55a985' },
    { label: 'Neutral', value: 26, colour: '#8aa6b8' },
    { label: 'Mixed', value: 12, colour: '#ffd36e' },
    { label: 'Negative', value: 9, colour: '#ff5c35' },
    { label: 'Uncertain', value: 5, colour: '#9da6ad' },
  ],
  topProducts: [
    {
      product: 'Arc task lamp',
      views: 1284,
      basket: 241,
      orders: 96,
      revenue: '£7,104',
    },
    {
      product: 'Field work bag',
      views: 1018,
      basket: 184,
      orders: 72,
      revenue: '£8,496',
    },
    {
      product: 'Fold laptop stand',
      views: 922,
      basket: 176,
      orders: 68,
      revenue: '£2,856',
    },
    {
      product: 'Perch desk chair',
      views: 710,
      basket: 92,
      orders: 31,
      revenue: '£9,269',
    },
  ],
}

export const contentGaps = [
  {
    topic: 'Arc lamp bulb replacement',
    source: '18 unanswered questions',
    impact: 'High',
    suggestion: 'FAQ draft ready',
  },
  {
    topic: 'Field bag cabin sizing',
    source: '31 repeated queries',
    impact: 'High',
    suggestion: 'Product copy draft',
  },
  {
    topic: '“Notebook bag” synonym',
    source: '22 zero-result searches',
    impact: 'Medium',
    suggestion: 'Synonym draft',
  },
]
