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

export interface DeviceProfile {
  isMobile: boolean
  isTablet: boolean
  movementScale: number
  enableShadows: boolean
  bloomIntensity: number
  cameraTravel: number
}
