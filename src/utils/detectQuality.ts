import type { DeviceProfile, QualityTier } from '../types/jewelry'

let cachedGpu = ''

function readGpuRenderer(): string {
  if (cachedGpu) return cachedGpu
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl || !(gl instanceof WebGLRenderingContext)) return (cachedGpu = '')
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    cachedGpu = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '') : ''
    const lose = gl.getExtension('WEBGL_lose_context')
    lose?.loseContext()
  } catch {
    cachedGpu = ''
  }
  return cachedGpu
}

function isWeakGpu(renderer: string): boolean {
  const r = renderer.toLowerCase()
  if (!r) return false
  if (/swiftshader|llvmpipe|softpipe|microsoft basic|software/.test(r)) return true
  if (/intel/.test(r) && /(hd|uhd)\s*(graphics)?/.test(r)) return true
  if (/mali-\d|mali-t\d|mali-g3|mali-g5[0-2]/.test(r)) return true
  if (/adreno[^0-9]*[1-5]\d{2}/.test(r)) return true
  if (/powervr|videocore|vivante/.test(r)) return true
  return false
}

function nextQuality(width: number): QualityTier {
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024
  const dpr = window.devicePixelRatio || 1
  const cores = navigator.hardwareConcurrency || 8
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  const saveData = Boolean(
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
  )
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const weakGpu = isWeakGpu(readGpuRenderer())

  if (reducedMotion || saveData || weakGpu || (memory !== undefined && memory <= 2)) {
    return 'low'
  }

  // Phones: fill-rate is the bottleneck — never run bloom/composer at 3x DPR.
  if (isMobile) {
    if (dpr >= 3 || cores <= 4 || (memory !== undefined && memory <= 4)) return 'low'
    return 'medium'
  }

  if (isTablet || dpr >= 2.5 || (memory !== undefined && memory <= 4) || cores <= 4) {
    return 'medium'
  }

  return 'high'
}

export function computeDeviceProfile(width = typeof window !== 'undefined' ? window.innerWidth : 1280): DeviceProfile {
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024
  const isTouch =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  const quality = typeof window === 'undefined' ? 'high' : nextQuality(width)
  const nativeDpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1

  const dprMax =
    quality === 'high' ? Math.min(nativeDpr, 2) : quality === 'medium' ? Math.min(nativeDpr, 1.25) : 1

  return {
    isMobile,
    isTablet,
    isTouch,
    quality,
    dpr: [1, dprMax],
    antialias: quality === 'high',
    enableShadows: quality === 'high',
    enableContactShadows: quality === 'high',
    enableBloom: quality === 'high',
    enableEnvironment: quality !== 'low',
    enableMouseParallax: !isTouch && quality !== 'low',
    movementScale: isMobile ? 0.4 : isTablet ? 0.52 : 0.65,
    cameraTravel: isMobile ? 0.7 : isTablet ? 0.95 : 1.2,
    bloomIntensity: 0.12,
    scrollDistance: isMobile ? 2400 : 3200,
    fov: isMobile ? 34 : 30,
    pendantOffset: width < 1024 ? [0, 0.62, 0] : [-1.2, 0.1, 0],
    pendantScale: isMobile ? 0.78 : isTablet ? 0.88 : 1,
  }
}

export function applyLiteDocumentClass(quality: QualityTier) {
  document.documentElement.classList.toggle('is-lite', quality !== 'high')
}

export function qualityRank(q: QualityTier): number {
  return q === 'high' ? 2 : q === 'medium' ? 1 : 0
}

export function minQuality(a: QualityTier, b: QualityTier): QualityTier {
  return qualityRank(a) <= qualityRank(b) ? a : b
}
