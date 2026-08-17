import { fetchInstagramPosts } from './_lib/instagram'

export default async function handler(
  req: { method?: string },
  res: {
    setHeader: (name: string, value: string) => void
    status: (code: number) => { json: (body: unknown) => void }
  },
) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed', posts: [] })
    return
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) {
    res.setHeader('Cache-Control', 'no-store')
    res.status(503).json({ error: 'not_configured', posts: [] })
    return
  }

  try {
    const posts = await fetchInstagramPosts(token, process.env.INSTAGRAM_USER_ID)
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400')
    res.status(200).json({ posts })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'instagram_error'
    res.setHeader('Cache-Control', 'no-store')
    res.status(502).json({ error: message, posts: [] })
  }
}
