import type { Object3D, Group } from 'three'

/** Canonical mesh keys used by the scroll timeline. */
export type JewelryPartKey =
  | 'ChainLeft'
  | 'ChainRight'
  | 'Bail'
  | 'Frame'
  | 'Gem'
  | 'Setting'
  | 'Medallion'
  | 'BackPlate'
  | 'Clasp'

export type JewelryPartMap = Partial<Record<JewelryPartKey, Object3D>> & {
  /** Unnamed meshes — exploded radially when named parts are sparse. */
  extras?: Object3D[]
}

export interface JewelryRefs {
  root: Group | null
  parts: JewelryPartMap
}

export type QualityTier = 'low' | 'medium' | 'high'

export interface DeviceProfile {
  isMobile: boolean
  isTablet: boolean
  isTouch: boolean
  quality: QualityTier
  dpr: [number, number]
  antialias: boolean
  enableShadows: boolean
  enableContactShadows: boolean
  enableBloom: boolean
  enableEnvironment: boolean
  enableMouseParallax: boolean
  movementScale: number
  cameraTravel: number
  bloomIntensity: number
  scrollDistance: number
  fov: number
  pendantOffset: [number, number, number]
  pendantScale: number
}
