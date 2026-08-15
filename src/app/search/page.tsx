import { SearchExperience } from '@/components/search/search-experience'
export const metadata = { title: 'Search' }
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  return (
    <main className="listing-page search-page">
      <header className="listing-header">
        <p className="eyebrow">Search the catalogue</p>
        <h1>
          What would make
          <br />
          today work better?
        </h1>
      </header>
      <SearchExperience initial={q} />
    </main>
  )
}
