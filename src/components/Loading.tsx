import { memo, useEffect, useState } from 'react'
import { BrandMark } from './BrandMark'

interface LoadingProps {
  progress: number
  visible: boolean
}

function LoadingComponent({ progress, visible }: LoadingProps) {
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    if (!visible) {
      const t = window.setTimeout(() => setShouldRender(false), 700)
      return () => window.clearTimeout(t)
    }
    setShouldRender(true)
  }, [visible])

  if (!shouldRender) return null

  const pct = Math.min(100, Math.max(0, Math.round(progress)))

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{ background: 'var(--bg)' }}
      aria-live="polite"
      aria-busy={visible}
    >
      <BrandMark size="lg" className="mb-16" />

      <div className="w-48 md:w-64 h-px bg-[var(--line)] overflow-hidden">
        <div
          className="h-full origin-left transition-[width] duration-300 ease-out bg-[var(--ink)]"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="mt-5 text-[10px] tracking-[0.35em] uppercase text-[var(--muted)] font-light">
        {pct}%
      </p>
    </div>
  )
}

export const Loading = memo(LoadingComponent)
