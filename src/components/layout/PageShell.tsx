import { Outlet } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'

/** Shared chrome for every route. */
export function PageShell() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-[var(--bg)]">
      <SiteHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  )
}
