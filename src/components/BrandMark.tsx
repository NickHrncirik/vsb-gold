import { memo } from 'react'

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg' | 'hero'
  className?: string
  align?: 'center' | 'end' | 'start'
}

const sizeMap = {
  sm: 'h-11 w-auto sm:h-12',
  md: 'h-16 w-auto',
  lg: 'h-24 w-auto md:h-28',
  hero: 'h-[4.75rem] w-auto sm:h-32 md:h-40 lg:h-48',
}

/** Official lockup PNG — cream plate + black #VSB GOLD. */
function BrandMarkComponent({
  size = 'md',
  className = '',
  align = 'center',
}: BrandMarkProps) {
  const alignCls =
    align === 'end'
      ? 'items-end'
      : align === 'start'
        ? 'items-start'
        : 'items-center'

  return (
    <div className={`flex ${alignCls} ${className}`}>
      <img
        src="/brand/logo.png?v=3"
        alt="#VSB GOLD"
        className={`${sizeMap[size]} max-w-none select-none`}
        draggable={false}
      />
    </div>
  )
}

export const BrandMark = memo(BrandMarkComponent)
