import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Group, PerspectiveCamera } from 'three'

gsap.registerPlugin(ScrollTrigger)

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
}

/**
 * Cinematic product scroll:
 * zoom in → full 360° turn right → zoom out.
 * No object disassembly.
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
}: UseScrollAnimationArgs) {
  const mouseActiveRef = useRef(true)
  const mouseTargetRef = useRef({ x: 0, y: 0 })
  const mouseCurrentRef = useRef({ x: 0, y: 0 })
  const baseRotationRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled) return

    const trigger = triggerRef.current
    const root = jewelryRootRef.current
    const camera = cameraRef.current
    if (!trigger || !root || !camera) return

    const s = movementScale
    const startCam = { x: 0, y: 0.08, z: 6.2 }
    const startRot = {
      x: root.rotation.x,
      y: root.rotation.y,
      z: root.rotation.z,
    }
    const startPos = {
      x: root.position.x,
      y: root.position.y,
      z: root.position.z,
    }

    camera.position.set(startCam.x, startCam.y, startCam.z)
    baseRotationRef.current = { x: startRot.x, y: startRot.y }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: 'top top',
        end: `+=${scrollDistance}`,
        scrub: 0.85,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          mouseActiveRef.current = self.progress < 0.03
        },
      },
      defaults: { ease: 'none' },
    })

    // —— 1. Ease in: slight lift + begin zoom ——
    tl.to(
      root.position,
      {
        y: startPos.y + 0.08 * s,
        duration: 0.8,
        ease: 'power1.inOut',
      },
      0,
    )

    tl.to(
      camera.position,
      {
        z: startCam.z - cameraTravel * 0.45,
        x: -0.12 * s,
        y: startCam.y + 0.04,
        duration: 1.0,
        ease: 'power1.inOut',
      },
      0,
    )

    if (keyLightIntensityRef?.current) {
      tl.to(keyLightIntensityRef.current, { value: 0.78, duration: 1.2 }, 0)
    }

    // —— 2. Zoom in (hero close-up) ——
    tl.to(
      camera.position,
      {
        z: startCam.z - cameraTravel,
        x: 0.18 * s,
        y: startCam.y - 0.02,
        duration: 1.4,
        ease: 'power2.inOut',
      },
      0.7,
    )

    // —— 3. Full 360° turn to the right (positive Y) ——
    // Sync rotation across the mid scroll so the spin feels continuous.
    tl.to(
      root.rotation,
      {
        y: startRot.y + TAU,
        x: startRot.x - 8 * DEG,
        z: startRot.z,
        duration: 3.2,
        ease: 'power1.inOut',
        onUpdate: () => {
          baseRotationRef.current.x = root.rotation.x
          baseRotationRef.current.y = root.rotation.y
        },
      },
      0.5,
    )

    // Soft camera drift while spinning (keeps depth alive)
    tl.to(
      camera.position,
      {
        x: -0.22 * s,
        y: startCam.y + 0.06,
        duration: 1.6,
        ease: 'sine.inOut',
      },
      1.8,
    )
    tl.to(
      camera.position,
      {
        x: 0.2 * s,
        y: startCam.y,
        duration: 1.4,
        ease: 'sine.inOut',
      },
      3.2,
    )

    // —— 4. Zoom out to composed product shot ——
    tl.to(
      camera.position,
      {
        z: startCam.z + 0.15,
        x: -0.05 * s,
        y: startCam.y + 0.05,
        duration: 1.35,
        ease: 'power2.inOut',
      },
      3.8,
    )

    tl.to(
      root.position,
      {
        x: startPos.x,
        y: startPos.y,
        z: startPos.z,
        duration: 1.2,
        ease: 'power1.inOut',
      },
      3.9,
    )

    // Settle upright after full turn (facing slightly toward brand copy on the right)
    tl.to(
      root.rotation,
      {
        y: startRot.y + TAU + 18 * DEG,
        x: startRot.x - 4 * DEG,
        z: 0,
        duration: 1.0,
        ease: 'sine.out',
        onUpdate: () => {
          baseRotationRef.current.x = root.rotation.x
          baseRotationRef.current.y = root.rotation.y
        },
      },
      4.0,
    )

    if (keyLightIntensityRef?.current) {
      tl.to(keyLightIntensityRef.current, { value: 0.6, duration: 1.0 }, 4.0)
    }

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
      root.position.set(startPos.x, startPos.y, startPos.z)
      root.rotation.set(startRot.x, startRot.y, startRot.z)
      baseRotationRef.current = { x: startRot.x, y: startRot.y }
      camera.position.set(startCam.x, startCam.y, startCam.z)
      ScrollTrigger.refresh()
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
  ])

  // Gentle mouse parallax only at the very start
  useEffect(() => {
    const max = 4 * DEG
    const onMove = (e: MouseEvent) => {
      if (!mouseActiveRef.current) return
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      mouseTargetRef.current.x = -ny * max
      mouseTargetRef.current.y = nx * max
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    let raf = 0
    const tick = () => {
      const root = jewelryRootRef.current
      if (root && mouseActiveRef.current) {
        const cur = mouseCurrentRef.current
        const tgt = mouseTargetRef.current
        cur.x += (tgt.x - cur.x) * 0.06
        cur.y += (tgt.y - cur.y) * 0.06
        root.rotation.x = baseRotationRef.current.x + cur.x
        root.rotation.y = baseRotationRef.current.y + cur.y
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [jewelryRootRef])
}
