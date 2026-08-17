import { Link } from 'react-router-dom'
import { Seo } from '../components/seo/Seo'
import { SITE } from '../config/site'

export function AboutPage() {
  return (
    <>
      <Seo
        title="About"
        path="/about"
        description={SITE.description}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About — #VSB GOLD',
          url: `${SITE.url}/about`,
          mainEntity: {
            '@type': 'Organization',
            name: SITE.name,
            url: SITE.url,
            email: SITE.email,
          },
        }}
      />

      <main className="pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="mb-4 text-[10px] tracking-[0.4em] uppercase text-[var(--muted)]">
            House of Madness
          </p>
          <h1 className="font-brand text-[clamp(2.75rem,10vw,5rem)] leading-none">About</h1>

          <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
            <div className="space-y-6 text-sm font-light leading-relaxed tracking-[0.05em] text-[var(--ink-soft)] md:col-span-7 md:text-base">
              <p>{SITE.description}</p>
              <p>
                Craft and culture fused into jewelry that means something. Not a trend. Not noise.
                Gold, diamonds, and street — in a piece that can carry its story.
              </p>
              <p>
                Every jewel has to hold in the hand and on the street. If it only works in a photo,
                it does not leave the house of madness.
              </p>
            </div>
            <aside className="border-t border-[var(--line)] pt-8 md:col-span-4 md:col-start-9 md:border-t-0 md:border-l md:pt-0 md:pl-10">
              <p className="mb-4 text-[10px] tracking-[0.35em] uppercase text-[var(--muted)]">
                Principles
              </p>
              <ul className="space-y-4 text-sm tracking-[0.04em] text-[var(--ink)]">
                <li>Weight over trend</li>
                <li>Craft over gloss</li>
                <li>Culture over décor</li>
                <li>Fewer pieces, more meaning</li>
              </ul>
              <Link
                to="/collection"
                className="mt-10 inline-flex border-b border-[var(--ink)] pb-1 text-[10px] tracking-[0.35em] uppercase hover:opacity-60"
              >
                See collection
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
