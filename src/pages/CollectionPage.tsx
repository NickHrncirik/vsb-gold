import { Link } from 'react-router-dom'
import { Seo } from '../components/seo/Seo'
import { COLLECTION } from '../data/collection'
import { SITE } from '../config/site'

const statusLabel = {
  available: 'Available',
  'made-to-order': 'Made to order',
  'coming-soon': 'Coming soon',
} as const

export function CollectionPage() {
  return (
    <>
      <Seo
        title="Collection"
        path="/collection"
        description="The #VSB GOLD collection — gold jewelry with weight. Craft and street culture in pieces made to order."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Collection — #VSB GOLD',
          url: `${SITE.url}/collection`,
          isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
        }}
      />

      <main className="pt-28 pb-20 md:pt-32">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="mb-4 text-[10px] tracking-[0.4em] uppercase text-[var(--muted)]">
            House of Madness
          </p>
          <h1 className="font-brand text-[clamp(2.75rem,10vw,5rem)] leading-none text-[var(--ink)]">
            Collection
          </h1>
          <p className="mt-6 max-w-md text-sm font-light tracking-[0.06em] text-[var(--ink-soft)] md:text-base">
            Craft and culture fused into jewelry that means something. Every piece carries weight —
            on the neck and in life.
          </p>

          <div className="mt-16 space-y-0 md:mt-24">
            {COLLECTION.map((piece, i) => (
              <article
                key={piece.id}
                id={piece.id}
                className="scroll-mt-28 grid items-center gap-8 border-t border-[var(--line)] py-12 md:grid-cols-12 md:gap-10 md:py-16"
              >
                <div className="md:col-span-4">
                  <p className="mb-3 text-[10px] tracking-[0.35em] uppercase text-[var(--muted)]">
                    {piece.kicker}
                  </p>
                  <h2 className="font-brand text-3xl leading-none md:text-4xl">{piece.name}</h2>
                  <p className="mt-4 text-[10px] tracking-[0.3em] uppercase text-[var(--gold-dim)]">
                    {statusLabel[piece.status]}
                  </p>
                </div>

                <div className="overflow-hidden bg-black md:col-span-5">
                  <img
                    src={piece.image}
                    alt={piece.name}
                    className="mx-auto max-h-[min(52vh,28rem)] w-full object-contain object-center"
                  />
                </div>

                <div className="md:col-span-3 md:flex md:h-full md:flex-col md:items-end md:justify-between">
                  <span className="text-[10px] tracking-[0.35em] uppercase text-[var(--muted)]">
                    0{i + 1}
                  </span>
                  <Link
                    to="/contact"
                    className="mt-8 inline-flex border-b border-[var(--ink)] pb-1 text-[10px] tracking-[0.35em] uppercase text-[var(--ink)] transition-opacity hover:opacity-60 md:mt-0"
                  >
                    {piece.status === 'coming-soon' ? 'Notify me' : 'Enquire'}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
