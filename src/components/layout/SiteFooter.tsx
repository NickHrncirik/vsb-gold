import { Link } from 'react-router-dom'
import { BrandMark } from '../BrandMark'
import { FOOTER_LINKS, SITE } from '../../config/site'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-[var(--line)] bg-[var(--bg-deep)]">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <BrandMark size="md" align="start" />
            <p className="mt-6 max-w-xs text-sm font-light tracking-[0.06em] text-[var(--muted)]">
              {SITE.description}
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-3">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs tracking-[0.2em] uppercase text-[var(--ink-soft)] opacity-70 transition-opacity hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--muted)]">
            © {year} {SITE.shortName}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a
              href={`mailto:${SITE.email}`}
              className="text-[10px] tracking-[0.2em] uppercase text-[var(--muted)] hover:text-[var(--ink)]"
            >
              {SITE.email}
            </a>
            <a
              href={SITE.instagram.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[10px] tracking-[0.2em] uppercase text-[var(--muted)] hover:text-[var(--ink)]"
            >
              @{SITE.instagram.handle}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
