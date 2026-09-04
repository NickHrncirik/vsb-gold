import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BrandMark } from '../BrandMark'
import { NAV, SITE, type NavItem } from '../../config/site'

function isActivePath(pathname: string, to?: string) {
  if (!to) return false
  if (to === '/') return pathname === '/'
  const base = to.split('#')[0]
  return pathname === base || pathname.startsWith(`${base}/`)
}

function MenuSection({
  item,
  onNavigate,
}: {
  item: NavItem
  onNavigate: () => void
}) {
  const location = useLocation()
  const hasChildren = Boolean(item.children?.length)
  const sectionActive =
    isActivePath(location.pathname, item.to) ||
    (item.children?.some((c) => isActivePath(location.pathname, c.to)) ?? false)
  const [open, setOpen] = useState(sectionActive)

  useEffect(() => {
    if (sectionActive) setOpen(true)
  }, [sectionActive])

  if (!hasChildren && item.to) {
    return (
      <NavLink
        to={item.to}
        onClick={onNavigate}
        className={({ isActive }) =>
          `block py-3 text-2xl md:text-3xl font-brand tracking-tight transition-opacity ${
            isActive ? 'opacity-100' : 'opacity-55 hover:opacity-100'
          }`
        }
      >
        {item.label}
      </NavLink>
    )
  }

  return (
    <div className="border-b border-[var(--line)]/80 py-3">
      <div className="flex items-center justify-between gap-4">
        {item.to ? (
          <Link
            to={item.to}
            onClick={onNavigate}
            className={`text-2xl md:text-3xl font-brand tracking-tight transition-opacity ${
              sectionActive ? 'opacity-100' : 'opacity-55 hover:opacity-100'
            }`}
          >
            {item.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`text-left text-2xl md:text-3xl font-brand tracking-tight transition-opacity ${
              sectionActive ? 'opacity-100' : 'opacity-55 hover:opacity-100'
            }`}
          >
            {item.label}
          </button>
        )}
        <button
          type="button"
          aria-expanded={open}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${item.label}`}
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 px-2 py-1 text-[10px] tracking-[0.35em] uppercase text-[var(--muted)]"
        >
          {open ? '−' : '+'}
        </button>
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <ul className="space-y-3 pt-3 pb-1">
            {item.children?.map((child) => (
              <li key={child.to}>
                <Link to={child.to} onClick={onNavigate} className="group block pl-1">
                  <span className="text-sm tracking-[0.08em] text-[var(--ink)] transition-opacity group-hover:opacity-70">
                    {child.label}
                  </span>
                  {child.description && (
                    <span className="mt-1 block text-xs font-light tracking-[0.06em] text-[var(--muted)]">
                      {child.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-[60] ${
          transparent ? '' : 'bg-[var(--bg)]/80 backdrop-blur-sm'
        }`}
        style={{
          paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
        }}
      >
        <div className="pointer-events-auto flex items-start justify-between gap-4">
          <Link to="/" aria-label={`${SITE.name} home`} className="pt-1">
            <BrandMark size="sm" align="start" />
          </Link>

          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(true)}
            className="group flex items-center gap-3 pt-2 pr-1 text-[10px] tracking-[0.4em] uppercase text-[var(--ink)]"
          >
            <span className="opacity-70 transition-opacity group-hover:opacity-100">Menu</span>
            <span className="relative block h-3 w-5" aria-hidden>
              <span className="absolute top-0 right-0 left-0 h-px bg-[var(--ink)]" />
              <span className="absolute top-1/2 right-0 left-0 h-px bg-[var(--ink)]" />
              <span className="absolute right-0 bottom-0 left-0 h-px bg-[var(--ink)]" />
            </span>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[70] bg-[var(--ink)]/25 transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <aside
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed top-0 right-0 z-[80] h-[100dvh] w-full max-w-md bg-[var(--bg)] shadow-[-24px_0_60px_rgba(20,16,10,0.12)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          paddingTop: 'max(1rem, env(safe-area-inset-top))',
          paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
          paddingLeft: '1.75rem',
          paddingRight: 'max(1.25rem, env(safe-area-inset-right))',
        }}
      >
        <div className="mb-10 flex items-center justify-between">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--muted)]">Navigate</p>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => setOpen(false)}
            className="text-[10px] tracking-[0.4em] uppercase text-[var(--ink)] opacity-70 hover:opacity-100"
          >
            Close
          </button>
        </div>

        <nav className="flex flex-col" aria-label="Primary">
          {NAV.map((item) => (
            <MenuSection key={item.label} item={item} onNavigate={() => setOpen(false)} />
          ))}
        </nav>

        <div className="absolute right-0 bottom-0 left-0 border-t border-[var(--line)] p-7">
          <p className="font-gold mb-2 text-[0.65rem] text-[var(--ink)]">{SITE.name}</p>
          <p className="max-w-[16rem] text-xs font-light tracking-[0.06em] text-[var(--muted)]">
            {SITE.tagline}. {SITE.manifesto}
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-4 inline-block text-xs tracking-[0.12em] text-[var(--ink)] opacity-80 hover:opacity-100"
          >
            {SITE.email}
          </a>
        </div>
      </aside>
    </>
  )
}
