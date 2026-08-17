import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Group, PerspectiveCamera } from 'three'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

const DEG = Math.PI / 180
const TAU = Math.PI * 2

interface UseScrollAnimationArgs {
  triggerRef: React.RefObject<HTMLElement | null>
  jewelryRootRef: React.RefObject<Group | null>
  /** kept for API compatibility — unused (no explode) */
  partsRef?: React.RefObject<unknown>
  cameraRef: React.RefObject<PerspectiveCamera | null>
  enabled: boolean
  scrollDistance?: number
  movementScale?: number
  cameraTravel?: number
  keyLightIntensityRef?: React.RefObject<{ value: number }>
  enableMouseParallax?: boolean
  isTouch?: boolean
  onInvalidate?: () => void
}

function clamp01(t: number) {
  return t < 0 ? 0 : t > 1 ? 1 : t
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function smoothstep(t: number) {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}

/** Piecewise sample — reverse is the same function as forward. */
function sample(times: number[], values: number[], t: number, smooth = true) {
  if (t <= times[0]) return values[0]
  const last = times.length - 1
  if (t >= times[last]) return values[last]
  for (let i = 0; i < last; i++) {
    const t1 = times[i + 1]
    if (t <= t1) {
      const u = (t - times[i]) / (t1 - times[i])
      return lerp(values[i], values[i + 1], smooth ? smoothstep(u) : u)
    }
  }
  return values[last]
}

/**
 * Cinematic product scroll:
 * zoom in → full 360° turn right → zoom out.
 * Driven by a single progress sampler so reverse scroll cannot jump.
 */
export function useScrollAnimation({
  triggerRef,
  jewelryRootRef,
  cameraRef,
  enabled,
  scrollDistance = 3200,
  movementScale = 0.65,
  cameraTravel = 1.35,
  keyLightIntensityRef,
  enableMouseParallax = true,
  isTouch = false,
  onInvalidate,
}: UseScrollAnimationArgs) {
  const mouseTargetRef = useRef({ x: 0, y: 0 })
  const mouseCurrentRef = useRef({ x: 0, y: 0 })
  const progressRef = useRef(0)
  const invalidateRef = useRef(onInvalidate)
  invalidateRef.current = onInvalidate

  useEffect(() => {
    if (!enabled) return

    const trigger = triggerRef.current
    const root = jewelryRootRef.current
    const camera = cameraRef.current
    if (!trigger || !root || !camera) return

    const s = movementScale
    const z0 = 6.2
    const y0 = 0.08

    const camT = [0, 0.16, 0.36, 0.56, 0.78, 1]
    const camX = [0, -0.12 * s, 0.18 * s, -0.22 * s, 0.16 * s, -0.05 * s]
    const camY = [y0, y0 + 0.04, y0 - 0.02, y0 + 0.06, y0, y0 + 0.05]
    const camZ = [
      z0,
      z0 - cameraTravel * 0.45,
      z0 - cameraTravel,
      z0 - cameraTravel * 0.92,
      z0 - cameraTravel * 0.35,
      z0 + 0.15,
    ]

    const liftT = [0, 0.14, 0.78, 1]
    const liftY = [0, 0.08 * s, 0.04 * s, 0]

    const apply = (p: number) => {
      const t = clamp01(p)
      camera.position.set(
        sample(camT, camX, t),
        sample(camT, camY, t),
        sample(camT, camZ, t),
      )

      root.position.y = sample(liftT, liftY, t)

      const spin = smoothstep(clamp01((t - 0.06) / 0.9))
      const ry = spin * (TAU + 18 * DEG)
      const rx =
        lerp(0, -8 * DEG, smoothstep(clamp01(t / 0.55))) +
        lerp(0, 4 * DEG, smoothstep(clamp01((t - 0.72) / 0.28)))

      let mx = 0
      let my = 0
      if (enableMouseParallax) {
        const mouseMix = 1 - smoothstep(clamp01(t / 0.05))
        const cur = mouseCurrentRef.current
        const tgt = mouseTargetRef.current
        if (mouseMix < 0.01) {
          tgt.x = 0
          tgt.y = 0
        }
        cur.x += (tgt.x * mouseMix - cur.x) * 0.08
        cur.y += (tgt.y * mouseMix - cur.y) * 0.08
        mx = cur.x
        my = cur.y
      }

      root.rotation.x = rx + mx
      root.rotation.y = ry + my
      root.rotation.z = 0

      if (keyLightIntensityRef?.current) {
        keyLightIntensityRef.current.value = sample([0, 0.22, 1], [0.55, 0.78, 0.6], t)
      }

      invalidateRef.current?.()
    }

    apply(0)

    const st = ScrollTrigger.create({
      trigger,
      start: 'top top',
      end: `+=${scrollDistance}`,
      scrub: isTouch ? 0.15 : 0.4,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progressRef.current = self.progress
        apply(self.progress)
      },
      onRefresh: (self) => {
        progressRef.current = self.progress
        apply(self.progress)
      },
    })

    if (!enableMouseParallax) {
      return () => {
        st.kill()
        root.position.set(0, 0, 0)
        root.rotation.set(0, 0, 0)
        camera.position.set(0, y0, z0)
      }
    }

    const onMove = (e: MouseEvent) => {
      if (progressRef.current > 0.06) return
      const max = 4 * DEG
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      mouseTargetRef.current.x = -ny * max
      mouseTargetRef.current.y = nx * max
      apply(progressRef.current)
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      st.kill()
      root.position.set(0, 0, 0)
      root.rotation.set(0, 0, 0)
      camera.position.set(0, y0, z0)
    }
  }, [
    enabled,
    triggerRef,
    jewelryRootRef,
    cameraRef,
    scrollDistance,
    movementScale,
    cameraTravel,
    keyLightIntensityRef,
    enableMouseParallax,
    isTouch,
  ])
}
