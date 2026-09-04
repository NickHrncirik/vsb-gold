import { memo, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BrandMark } from './BrandMark'
import { HOME_CHAPTERS } from '../data/home'
import { SITE } from '../config/site'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

const SCROLL = 3200

function HeroComponent() {
  const sectionRef = useRef<HTMLElement>(null)
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const windows = [
      [0, 0.22],
      [0.26, 0.48],
      [0.52, 0.74],
      [0.76, 0.98],
    ] as const

    const setVisibility = (progress: number) => {
      chapterRefs.current.forEach((el, i) => {
        if (!el) return
        const [start, end] = windows[i]
        const span = end - start
        const fade = Math.min(0.05, span * 0.35)
        let opacity = 0

        if (progress >= start && progress <= end) {
          if (i === 0 && progress < start + fade) opacity = 1
          else if (progress < start + fade) opacity = (progress - start) / fade
          else if (progress > end - fade) opacity = (end - progress) / fade
          else opacity = 1
        }

        opacity = Math.max(0, Math.min(1, opacity))
        el.style.opacity = String(opacity)
        el.style.transform = opacity > 0.02 ? `translate3d(0, ${(1 - opacity) * 12}px, 0)` : 'none'
        el.style.visibility = opacity < 0.02 ? 'hidden' : 'visible'
        el.style.pointerEvents = 'none'
        el.setAttribute('aria-hidden', opacity < 0.2 ? 'true' : 'false')
      })
    }

    chapterRefs.current.forEach((el, i) => {
      if (!el) return
      el.style.opacity = i === 0 ? '1' : '0'
      el.style.visibility = i === 0 ? 'visible' : 'hidden'
      el.style.transform = 'none'
    })

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${SCROLL}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => setVisibility(self.progress),
        onRefresh: (self) => setVisibility(self.progress),
      })
    }, section)

    setVisibility(0)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-[100lvh] min-h-[100dvh] w-full overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-deep)',
        backgroundImage:
          'radial-gradient(ellipse 90% 70% at 50% 40%, #ffffff 0%, var(--bg) 52%, var(--bg-deep) 100%)',
      }}
    >
      {HOME_CHAPTERS.map((ch, i) => (
        <div
          key={ch.id}
          ref={(el) => {
            chapterRefs.current[i] = el
          }}
          className={`absolute inset-0 flex items-start px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(env(safe-area-inset-top)+5.75rem)] sm:px-8 md:items-center md:px-12 md:pt-0 lg:px-16 ${
            i === 0 ? 'opacity-100' : 'invisible opacity-0'
          }`}
        >
          <div
            className={`mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:items-center md:gap-16 lg:gap-24 ${
              ch.imageLeft ? '' : 'md:flex-row-reverse'
            }`}
          >
            <figure className="w-full md:w-[min(46%,28rem)]">
              <div className="relative mx-auto aspect-[4/5] h-[min(42dvh,19rem)] overflow-hidden bg-[#0c0c0c] shadow-[0_28px_80px_rgba(18,12,6,0.16)] ring-1 ring-black/10 md:h-auto md:w-full">
                <img
                  src={ch.image}
                  alt={ch.title}
                  decoding={i === 0 ? 'sync' : 'async'}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
            </figure>

            <div
              className={`flex w-full flex-col items-center text-center md:w-[min(46%,26rem)] ${
                ch.imageLeft ? 'md:items-start md:text-left' : 'md:items-end md:text-right'
              }`}
            >
              {'variant' in ch && ch.variant === 'brand' ? (
                <>
                  <BrandMark
                    size="lg"
                    align={ch.imageLeft ? 'start' : 'end'}
                    className="mb-6 md:mb-8"
                  />
                  <p className="font-gold mb-3 text-[0.6rem] sm:text-xs text-[var(--ink)]">
                    {SITE.tagline}
                  </p>
                  <p className="max-w-xs text-sm font-light tracking-[0.06em] text-[var(--ink-soft)] md:text-base">
                    {SITE.manifesto}
                  </p>
                  <p className="mt-5 max-w-[18rem] text-xs font-light leading-relaxed tracking-[0.04em] text-[var(--muted)] md:text-sm">
                    {SITE.description}
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-3 text-[10px] tracking-[0.35em] uppercase text-[var(--muted)]">
                    {ch.kicker}
                  </p>
                  <h2 className="font-brand text-[2.4rem] leading-none text-[var(--ink)] sm:text-5xl md:text-6xl">
                    {ch.title}
                  </h2>
                  <p className="mt-4 max-w-xs text-sm font-light tracking-[0.06em] text-[var(--ink-soft)] md:text-base">
                    {ch.body}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

export const Hero = memo(HeroComponent)
