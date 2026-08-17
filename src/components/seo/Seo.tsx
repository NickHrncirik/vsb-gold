import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { SITE } from '../../config/site'

type JsonLd = Record<string, unknown> | Record<string, unknown>[]

interface SeoProps {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
  jsonLd?: JsonLd
}

function absUrl(path: string) {
  const base = SITE.url.replace(/\/$/, '')
  if (!path || path === '/') return `${base}/`
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function Seo({
  title,
  description = SITE.description,
  path = '/',
  image = SITE.ogImage,
  type = 'website',
  noindex = false,
  jsonLd,
}: SeoProps) {
  const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`
  const url = absUrl(path)
  const imageUrl = image.startsWith('http') ? image : absUrl(image)

  useEffect(() => {
    document.documentElement.lang = SITE.lang
  }, [])

  const graph = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : null

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={SITE.locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      <meta name="theme-color" content={SITE.themeColor} />
      <meta name="author" content={SITE.name} />

      {graph && (
        <script type="application/ld+json">
          {JSON.stringify(
            graph.length === 1 ? graph[0] : { '@context': 'https://schema.org', '@graph': graph },
          )}
        </script>
      )}
    </Helmet>
  )
}
