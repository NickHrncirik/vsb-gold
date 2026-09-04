import { Seo } from '../components/seo/Seo'
import { Hero } from '../components/Hero'
import { SiteFooter } from '../components/layout/SiteFooter'
import { SiteHeader } from '../components/layout/SiteHeader'
import { SITE } from '../config/site'

export function HomePage() {
  return (
    <>
      <Seo
        path="/"
        description={SITE.description}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: SITE.name,
          url: SITE.url,
          description: SITE.description,
          email: SITE.email,
          logo: `${SITE.url}/brand/logo.png`,
        }}
      />
      <SiteHeader transparent />
      <main className="relative bg-[var(--bg-deep)]">
        <Hero />
        <SiteFooter />
      </main>
    </>
  )
}
