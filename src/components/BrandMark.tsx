import { memo } from 'react'

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg' | 'hero'
  className?: string
  align?: 'center' | 'end' | 'start'
}

const sizeMap = {
  sm: { vsb: 'text-3xl', gold: 'text-[0.6rem] tracking-[0.55em]', gap: 'mt-1.5' },
  md: { vsb: 'text-5xl', gold: 'text-xs tracking-[0.55em]', gap: 'mt-2' },
  lg: { vsb: 'text-6xl md:text-7xl', gold: 'text-sm tracking-[0.58em]', gap: 'mt-2.5' },
  hero: {
    vsb: 'text-6xl sm:text-7xl md:text-[5.5rem]',
    gold: 'text-sm md:text-base tracking-[0.6em]',
    gap: 'mt-3',
  },
}

/**
 * Typographic mark matching the brand lockup:
 * #VSB — blackletter (Textura / Old English feel)
 * GOLD — clean wide-tracked sans
 */
function BrandMarkComponent({
  size = 'md',
  className = '',
  align = 'center',
}: BrandMarkProps) {
  const s = sizeMap[size]
  const alignCls =
    align === 'end' ? 'items-end text-right' : align === 'start' ? 'items-start text-left' : 'items-center text-center'

  return (
    <div className={`flex flex-col leading-none ${alignCls} ${className}`}>
      <span className={`font-brand text-[var(--ink)] ${s.vsb}`}>#VSB</span>
      <span className={`font-gold text-[var(--ink)] ${s.gap} ${s.gold}`}>Gold</span>
    </div>
  )
}

export const BrandMark = memo(BrandMarkComponent)
