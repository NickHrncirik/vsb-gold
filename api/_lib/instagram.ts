import type { InstagramPost } from '../../src/types/instagram'

export type { InstagramPost }

type GraphMedia = {
  id: string
  caption?: string
  media_type?: string
  media_url?: string
  permalink?: string
  thumbnail_url?: string
  timestamp?: string
}

type GraphPage = {
  data?: GraphMedia[]
  paging?: { next?: string }
  error?: { message?: string }
}

function coverImage(item: GraphMedia): string | null {
  if (item.media_type === 'VIDEO') return item.thumbnail_url ?? item.media_url ?? null
  return item.media_url ?? item.thumbnail_url ?? null
}

/** Pull every page of the Instagram Graph feed (Business / Creator). */
export async function fetchInstagramPosts(
  token: string,
  userId?: string,
): Promise<InstagramPost[]> {
  const fields =
    'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp'
  const root = userId
    ? `https://graph.instagram.com/v21.0/${encodeURIComponent(userId)}/media`
    : 'https://graph.instagram.com/v21.0/me/media'

  const posts: InstagramPost[] = []
  let url: string | null =
    `${root}?fields=${fields}&limit=50&access_token=${encodeURIComponent(token)}`

  while (url && posts.length < 200) {
    const res = await fetch(url)
    const json = (await res.json()) as GraphPage
    if (json.error?.message) {
      throw new Error(json.error.message)
    }
    for (const item of json.data ?? []) {
      const image = coverImage(item)
      if (!image || !item.permalink) continue
      posts.push({
        id: item.id,
        permalink: item.permalink,
        image,
        mediaType: item.media_type ?? 'IMAGE',
        caption: item.caption ?? '',
        timestamp: item.timestamp ?? '',
      })
    }
    url = json.paging?.next ?? null
  }

  return posts
}
