import { memo, useCallback, useEffect, useRef, useState, Suspense, type Dispatch, type SetStateAction } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  PerformanceMonitor,
  PerspectiveCamera,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { Group, PerspectiveCamera as ThreePerspectiveCamera } from 'three'
import { Pendant, preloadPendantGlb } from './Pendant'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import type { DeviceProfile, JewelryPartMap, QualityTier } from '../types/jewelry'
import { minQuality } from '../utils/detectQuality'

interface SceneProps {
  triggerRef: React.RefObject<HTMLElement | null>
  profile: DeviceProfile
  useGlb: boolean
  onReady: () => void
}

function CameraRig({
  cameraRef,
  onReady,
}: {
  cameraRef: React.MutableRefObject<ThreePerspectiveCamera | null>
  onReady: () => void
}) {
  const { camera } = useThree()
  useEffect(() => {
    cameraRef.current = camera as ThreePerspectiveCamera
    onReady()
  }, [camera, cameraRef, onReady])
  return null
}

function JewelryScene({
  triggerRef,
  profile,
  useGlb,
  onReady,
  quality,
  setQuality,
}: SceneProps & {
  quality: QualityTier
  setQuality: Dispatch<SetStateAction<QualityTier>>
}) {
  const jewelryRootRef = useRef<Group | null>(null)
  const partsRef = useRef<JewelryPartMap>({})
  const cameraRef = useRef<ThreePerspectiveCamera | null>(null)
  const keyLightIntensityRef = useRef({ value: 0.55 })
  const [partsReady, setPartsReady] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const keyLightRef = useRef<THREE.DirectionalLight>(null)
  const readySent = useRef(false)
  const invalidate = useThree((s) => s.invalidate)

  const bloom = quality === 'high'
  const shadows = quality === 'high'
  const contact = quality === 'high'
  const bright = profile.isMobile || profile.isTablet || quality === 'low'
  const lightBoost = bright ? 1.75 : 1

  const onPartsReady = useCallback(
    (root: Group, parts: JewelryPartMap) => {
      jewelryRootRef.current = root
      partsRef.current = parts
      setPartsReady(true)
      if (!readySent.current) {
        readySent.current = true
        onReady()
      }
    },
    [onReady],
  )

  const onCameraReady = useCallback(() => setCameraReady(true), [])

  useScrollAnimation({
    triggerRef,
    jewelryRootRef,
    partsRef,
    cameraRef,
    enabled: partsReady && cameraReady,
    scrollDistance: profile.scrollDistance,
    movementScale: profile.movementScale,
    cameraTravel: profile.cameraTravel,
    keyLightIntensityRef,
    enableMouseParallax: profile.enableMouseParallax,
    isTouch: profile.isTouch,
    onInvalidate: invalidate,
  })

  useFrame(() => {
    if (keyLightRef.current) {
      keyLightRef.current.intensity = keyLightIntensityRef.current.value * lightBoost
    }
  })

  return (
    <>
      <PerformanceMonitor
        ms={250}
        iterations={6}
        step={0.2}
        flipflops={2}
        bounds={(fps) => [Math.min(40, fps * 0.55), fps]}
        onDecline={() => setQuality((q) => (q === 'high' ? 'medium' : 'low'))}
        onFallback={() => setQuality('low')}
      />
      <AdaptiveDpr pixelated={quality === 'low'} />

      <PerspectiveCamera
        makeDefault
        position={[0, 0.05, 6.2]}
        fov={profile.fov}
        near={0.1}
        far={40}
      />
      <CameraRig cameraRef={cameraRef} onReady={onCameraReady} />

      <color attach="background" args={['#fdf5e8']} />
      {!profile.isMobile && <fog attach="fog" args={['#fdf5e8', 12, 28]} />}

      <hemisphereLight args={['#fff6e8', '#d4c4a8', bright ? 0.7 : 0.35]} />
      <ambientLight intensity={bright ? 0.95 : 0.55} color="#fff8ee" />
      <directionalLight
        ref={keyLightRef}
        castShadow={shadows}
        position={[2.8, 5.2, 5]}
        intensity={bright ? 1.05 : 0.55}
        color="#fff4e4"
        shadow-mapSize={shadows ? [1024, 1024] : [256, 256]}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-3.2, 2.2, 1.5]} intensity={bright ? 0.55 : 0.25} color="#e8eef8" />
      <directionalLight position={[0.4, -1.2, 3.5]} intensity={bright ? 0.35 : 0.12} color="#ffe8c8" />
      {quality === 'high' && (
        <spotLight
          position={[-1.2, 4, 2.5]}
          angle={0.35}
          penumbra={0.85}
          intensity={0.3}
          color="#fff0d8"
        />
      )}

      <Environment preset="studio" environmentIntensity={bright ? 0.72 : 0.4} />

      <Suspense fallback={null}>
        <Pendant
          useGlb={useGlb}
          onPartsReady={onPartsReady}
          offset={profile.pendantOffset}
          scale={profile.pendantScale}
          enableShadows={shadows}
        />
      </Suspense>

      {contact && (
        <ContactShadows
          position={[profile.pendantOffset[0] + 0.05, -1.35, 0]}
          opacity={0.22}
          scale={8}
          blur={2.4}
          far={3}
          color="#2a2418"
        />
      )}

      {bloom && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={profile.bloomIntensity}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.55}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.35} darkness={0.18} />
        </EffectComposer>
      )}
    </>
  )
}

function SceneComponent({ triggerRef, profile, useGlb, onReady }: SceneProps) {
  const [quality, setQuality] = useState<QualityTier>(profile.quality)

  useEffect(() => {
    setQuality((q) => minQuality(q, profile.quality))
  }, [profile.quality])

  useEffect(() => {
    if (useGlb) preloadPendantGlb()
  }, [useGlb])

  const demand = quality !== 'high'

  return (
    <Canvas
      dpr={profile.dpr}
      frameloop={demand ? 'demand' : 'always'}
      performance={{ min: 0.4, max: 1, debounce: 200 }}
      gl={{
        antialias: profile.antialias,
        stencil: false,
        depth: true,
        alpha: false,
        powerPreference: profile.quality === 'low' ? 'low-power' : 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: profile.isMobile ? 1.28 : 1.08,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      shadows={profile.enableShadows}
      style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
    >
      <JewelryScene
        triggerRef={triggerRef}
        profile={profile}
        useGlb={useGlb}
        onReady={onReady}
        quality={quality}
        setQuality={setQuality}
      />
    </Canvas>
  )
}

export const Scene = memo(SceneComponent)
