import { useEffect, useState } from 'react'
import type { DeviceProfile } from '../types/jewelry'
import { applyLiteDocumentClass, computeDeviceProfile } from '../utils/detectQuality'

function sameProfile(a: DeviceProfile, b: DeviceProfile) {
  return (
    a.quality === b.quality &&
    a.isMobile === b.isMobile &&
    a.isTablet === b.isTablet &&
    a.scrollDistance === b.scrollDistance &&
    a.dpr[1] === b.dpr[1] &&
    a.pendantOffset[0] === b.pendantOffset[0] &&
    a.pendantOffset[1] === b.pendantOffset[1] &&
    a.pendantScale === b.pendantScale
  )
}

export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(() => computeDeviceProfile())

  useEffect(() => {
    applyLiteDocumentClass(profile.quality)
  }, [profile.quality])

  useEffect(() => {
    let timer = 0
    const apply = () => {
      const next = computeDeviceProfile(window.innerWidth)
      setProfile((prev) => (sameProfile(prev, next) ? prev : next))
    }
    const onResize = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(apply, 180)
    }
    window.addEventListener('resize', onResize, { passive: true })
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => apply()
    motion.addEventListener('change', onMotion)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      motion.removeEventListener('change', onMotion)
    }
  }, [])

  return profile
}
