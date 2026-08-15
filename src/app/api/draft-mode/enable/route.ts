import { draftMode } from 'next/headers'
export async function GET(request: Request) {
  const url = new URL(request.url)
  if (
    !process.env.SANITY_API_READ_TOKEN ||
    url.searchParams.get('secret') !== process.env.SANITY_API_READ_TOKEN
  )
    return Response.json({ error: 'Invalid preview secret' }, { status: 401 })
  ;(await draftMode()).enable()
  return Response.redirect(
    new URL(url.searchParams.get('redirect') || '/', request.url),
  )
}
