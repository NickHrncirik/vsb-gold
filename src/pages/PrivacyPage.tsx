import { Seo } from '../components/seo/Seo'
import { SITE } from '../config/site'

export function PrivacyPage() {
  return (
    <>
      <Seo
        title="Privacy"
        path="/privacy"
        description="Privacy policy for #VSB GOLD — how we handle enquiries and technical site data."
      />

      <main className="pt-28 pb-20 md:pt-32">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <p className="mb-4 text-[10px] tracking-[0.4em] uppercase text-[var(--muted)]">Legal</p>
          <h1 className="font-brand text-[clamp(2.5rem,8vw,4rem)] leading-none">Privacy</h1>
          <div className="mt-10 space-y-6 text-sm font-light leading-relaxed tracking-[0.04em] text-[var(--ink-soft)]">
            <p>
              #VSB GOLD respects your privacy. This site is informational and does not require an
              account.
            </p>
            <p>
              <strong className="font-medium text-[var(--ink)]">Enquiries.</strong> When you contact
              us via the form or email ({SITE.email}), we use the details you send only to reply.
            </p>
            <p>
              <strong className="font-medium text-[var(--ink)]">Hosting.</strong> The site may be
              served by Vercel or similar infrastructure, which can process standard technical logs
              (IP, user agent) for security and performance.
            </p>
            <p>
              <strong className="font-medium text-[var(--ink)]">Cookies.</strong> We do not set
              marketing cookies. Essential host cookies may apply.
            </p>
            <p>
              Questions:{' '}
              <a className="underline underline-offset-4" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
