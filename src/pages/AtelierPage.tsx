import { Seo } from '../components/seo/Seo'
import { SITE } from '../config/site'

const STEPS = [
  {
    title: 'Form',
    body: 'Sculpture first. Ridges, cavities, and silhouette lock in before the polish — so light has somewhere to travel.',
  },
  {
    title: 'Cast',
    body: 'Weight is the point. The pendant has to sit in the hand before it meets a chain. Street metal with no hollow flex.',
  },
  {
    title: 'Polish',
    body: 'Gold goes to a quiet mirror, not a show shine. Edges stay honest. Planes keep their depth.',
  },
  {
    title: 'Proof',
    body: 'The piece is read in motion: full turn, hard light, soft room. If it only works from one angle, it does not leave the house.',
  },
]

export function AtelierPage() {
  return (
    <>
      <Seo
        title="Atelier"
        path="/atelier"
        description="Inside the #VSB GOLD atelier — form, cast, polish. Craft that builds jewelry with weight."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Atelier — #VSB GOLD',
          url: `${SITE.url}/atelier`,
        }}
      />

      <main className="pt-28 pb-20 md:pt-32">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="mb-4 text-[10px] tracking-[0.4em] uppercase text-[var(--muted)]">Process</p>
          <h1 className="font-brand text-[clamp(2.75rem,10vw,5rem)] leading-none">Atelier</h1>
          <p className="mt-6 max-w-lg text-sm font-light tracking-[0.06em] text-[var(--ink-soft)] md:text-base">
            Craft and culture fused into jewelry that means something. Slow, with intent — until the
            piece holds its own weight.
          </p>

          <section className="mt-16 grid gap-10 md:mt-24 md:grid-cols-2 md:gap-16">
            {STEPS.map((step, i) => (
              <article key={step.title} className="border-t border-[var(--line)] pt-8">
                <p className="mb-3 text-[10px] tracking-[0.35em] uppercase text-[var(--muted)]">
                  0{i + 1}
                </p>
                <h2 className="font-brand text-3xl leading-none md:text-4xl">{step.title}</h2>
                <p className="mt-5 text-sm font-light leading-relaxed tracking-[0.05em] text-[var(--ink-soft)]">
                  {step.body}
                </p>
              </article>
            ))}
          </section>

          <section
            id="materials"
            className="mt-20 scroll-mt-28 border-t border-[var(--line)] pt-12 md:mt-28 md:pt-16"
          >
            <p className="mb-4 text-[10px] tracking-[0.4em] uppercase text-[var(--muted)]">
              Materials
            </p>
            <h2 className="font-brand text-4xl leading-none md:text-5xl">Gold, diamond, form</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {[
                {
                  t: 'Metal',
                  b: 'Warm gold with real density. Jewelry as object — not display ornament.',
                },
                {
                  t: 'Surface',
                  b: 'A controlled polish: enough life for daily wear, no shout.',
                },
                {
                  t: 'Scale',
                  b: 'Around 50mm — visible, not a stage piece. Weight you feel.',
                },
              ].map((m) => (
                <div key={m.t}>
                  <h3 className="text-xs tracking-[0.25em] uppercase text-[var(--ink)]">{m.t}</h3>
                  <p className="mt-3 text-sm font-light leading-relaxed tracking-[0.05em] text-[var(--muted)]">
                    {m.b}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
