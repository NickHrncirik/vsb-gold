import { type FormEvent, useState } from 'react'
import { Seo } from '../components/seo/Seo'
import { SITE } from '../config/site'

export function ContactPage() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') || '')
    const email = String(data.get('email') || '')
    const message = String(data.get('message') || '')
    const subject = encodeURIComponent(`#VSB GOLD enquiry — ${name || 'Guest'}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <>
      <Seo
        title="Contact"
        path="/contact"
        description="Contact the #VSB GOLD atelier — made-to-order enquiries, press, and drops. Jewelry that means something."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact — #VSB GOLD',
          url: `${SITE.url}/contact`,
        }}
      />

      <main className="pt-28 pb-20 md:pt-32">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="mb-4 text-[10px] tracking-[0.4em] uppercase text-[var(--muted)]">Atelier</p>
          <h1 className="font-brand text-[clamp(2.75rem,10vw,5rem)] leading-none">Contact</h1>
          <p className="mt-6 max-w-md text-sm font-light tracking-[0.06em] text-[var(--ink-soft)] md:text-base">
            Made-to-order enquiries, press, drop notifications. We read every message.
          </p>

          <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12">
            <form onSubmit={onSubmit} className="space-y-8 md:col-span-7" noValidate>
              <label className="block">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                  Name
                </span>
                <input
                  name="name"
                  required
                  autoComplete="name"
                  className="mt-2 w-full border-b border-[var(--line)] bg-transparent py-3 text-sm tracking-[0.04em] outline-none transition-colors focus:border-[var(--ink)]"
                />
              </label>
              <label className="block">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-2 w-full border-b border-[var(--line)] bg-transparent py-3 text-sm tracking-[0.04em] outline-none transition-colors focus:border-[var(--ink)]"
                />
              </label>
              <label className="block">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                  Message
                </span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="mt-2 w-full resize-y border-b border-[var(--line)] bg-transparent py-3 text-sm tracking-[0.04em] outline-none transition-colors focus:border-[var(--ink)]"
                />
              </label>
              <button
                type="submit"
                className="bg-[var(--ink)] px-8 py-3 text-[10px] tracking-[0.4em] uppercase text-[var(--bg)] transition-opacity hover:opacity-85"
              >
                Send enquiry
              </button>
              {sent && (
                <p className="text-xs tracking-[0.06em] text-[var(--muted)]" role="status">
                  Opening your mail client…
                </p>
              )}
            </form>

            <aside className="md:col-span-4 md:col-start-9">
              <p className="mb-3 text-[10px] tracking-[0.35em] uppercase text-[var(--muted)]">
                Direct
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="text-sm tracking-[0.08em] text-[var(--ink)] hover:opacity-70"
              >
                {SITE.email}
              </a>
              <p className="mt-8 text-xs font-light leading-relaxed tracking-[0.06em] text-[var(--muted)]">
                We reply within a few business days. For made-to-order timing, include preferred
                finish and chain.
              </p>
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
