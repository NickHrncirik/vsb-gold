import { useEffect, useState } from 'react'
import type { DeviceProfile } from '../types/jewelry'

function computeProfile(width: number): DeviceProfile {
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024

  return {
    isMobile,
    isTablet,
    movementScale: isMobile ? 0.45 : isTablet ? 0.55 : 0.65,
    enableShadows: !isMobile,
    bloomIntensity: isMobile ? 0.06 : isTablet ? 0.1 : 0.12,
    cameraTravel: isMobile ? 0.8 : isTablet ? 1.0 : 1.2,
  }
}

export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(() =>
    computeProfile(typeof window !== 'undefined' ? window.innerWidth : 1280),
  )

  useEffect(() => {
    const onResize = () => setProfile(computeProfile(window.innerWidth))
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return profile
}
