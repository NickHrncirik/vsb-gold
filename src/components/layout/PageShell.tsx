import { Outlet } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'

/** Layout for content pages only — home stays outside to protect the 3D pin. */
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
