import { memo, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Scene } from './Scene'
import { BrandMark } from './BrandMark'
import { probePendantGlb } from '../utils/probePendantGlb'
import type { DeviceProfile } from '../types/jewelry'

gsap.registerPlugin(ScrollTrigger)

interface HeroProps {
  profile: DeviceProfile
  onSceneReady: () => void
  onLoadProgress: (n: number) => void
}

const CHAPTERS = [
  {
    id: 'intro',
    kicker: 'Collection 01',
    title: 'Skull pendant.',
    body: 'Cast weight. Quiet luxury.',
  },
  {
    id: 'closer',
    kicker: 'Detail',
    title: 'Closer.',
    body: 'Every ridge catches the light.',
  },
  {
    id: 'turn',
    kicker: 'Form',
    title: 'Full turn.',
    body: 'Three hundred sixty degrees of gold.',
  },
  {
    id: 'settle',
    kicker: '#VSB GOLD',
    title: 'Wear it.',
    body: 'No noise. Only presence.',
  },
] as const

function HeroComponent({ profile, onSceneReady, onLoadProgress }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([])
  const [modelReady, setModelReady] = useState(false)
  const [useGlb, setUseGlb] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      onLoadProgress(15)
      const hasGlb = await probePendantGlb()
      if (cancelled) return
      setUseGlb(hasGlb)
      setModelReady(true)
      onLoadProgress(45)
    })()
    return () => {
      cancelled = true
    }
  }, [onLoadProgress])

  useEffect(() => {
    const section = sectionRef.current
    const intro = introRef.current
    if (!section || !intro || !modelReady) return

    const SCROLL = 3200
    // Non-overlapping windows — only one chapter visible at a time
    const windows = [
      [0.14, 0.30],
      [0.34, 0.50],
      [0.54, 0.70],
      [0.74, 0.92],
    ] as const

    const setChapterVisibility = (progress: number) => {
      chapterRefs.current.forEach((el, i) => {
        if (!el) return
        const [start, end] = windows[i]
        const span = end - start
        const fade = Math.min(0.18, span * 0.35)
        let opacity = 0
        if (progress > start && progress < end) {
          if (progress < start + fade) opacity = (progress - start) / fade
          else if (progress > end - fade) opacity = (end - progress) / fade
          else opacity = 1
        }
        opacity = Math.max(0, Math.min(1, opacity))
        el.style.opacity = String(opacity)
        el.style.transform = `translate3d(0, ${(1 - opacity) * 18}px, 0)`
        el.style.visibility = opacity < 0.02 ? 'hidden' : 'visible'
      })
    }

    // Reset chapters
    chapterRefs.current.forEach((el) => {
      if (!el) return
      el.style.opacity = '0'
      el.style.visibility = 'hidden'
      el.style.transform = 'translate3d(0, 18px, 0)'
    })

    const ctx = gsap.context(() => {
      gsap.to(intro, {
        opacity: 0,
        y: -28,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${SCROLL * 0.12}`,
          scrub: true,
        },
      })

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${SCROLL}`,
        scrub: true,
        onUpdate: (self) => setChapterVisibility(self.progress),
        onRefresh: (self) => setChapterVisibility(self.progress),
      })
    }, section)

    return () => ctx.revert()
  }, [modelReady])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 85% 70% at 38% 48%, #ffffff 0%, var(--bg) 48%, var(--bg-deep) 100%)',
      }}
    >
      <div className="absolute inset-0 z-0">
        {modelReady && (
          <Scene
            triggerRef={sectionRef}
            profile={profile}
            useGlb={useGlb}
            onReady={() => {
              onLoadProgress(100)
              onSceneReady()
            }}
          />
        )}
      </div>

      {/* Opening brand */}
      <div
        ref={introRef}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-end justify-center pr-8 sm:pr-14 md:pr-[10vw]"
      >
        <BrandMark size="hero" align="end" className="mb-8" />
        <p className="font-light text-sm md:text-base tracking-[0.08em] text-[var(--ink-soft)] max-w-xs text-right">
          Crafted light.
        </p>
        <div className="mt-12 flex flex-col items-end gap-2 opacity-60">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--muted)]">
            Scroll
          </span>
          <span className="block w-px h-8 mr-5 bg-gradient-to-b from-[var(--ink)] to-transparent" />
        </div>
      </div>

      {/* Scroll chapters */}
      {CHAPTERS.map((ch, i) => (
        <div
          key={ch.id}
          ref={(el) => {
            chapterRefs.current[i] = el
          }}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-end justify-end pb-[14vh] pr-8 sm:pr-14 md:pr-[10vw] opacity-0"
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--muted)] mb-3">
            {ch.kicker}
          </p>
          <h2 className="font-brand text-4xl sm:text-5xl md:text-6xl text-[var(--ink)] leading-none">
            {ch.title}
          </h2>
          <p className="mt-4 max-w-xs text-right text-sm md:text-base font-light tracking-[0.06em] text-[var(--ink-soft)]">
            {ch.body}
          </p>
        </div>
      ))}
    </section>
  )
}

export const Hero = memo(HeroComponent)
