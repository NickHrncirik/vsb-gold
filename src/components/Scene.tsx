import { memo, useCallback, useEffect, useRef, useState, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  PerspectiveCamera,
  AdaptiveDpr,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { Group, PerspectiveCamera as ThreePerspectiveCamera } from 'three'
import { Pendant, preloadPendantGlb } from './Pendant'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import type { DeviceProfile, JewelryPartMap } from '../types/jewelry'

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

function JewelryScene({ triggerRef, profile, useGlb, onReady }: SceneProps) {
  const jewelryRootRef = useRef<Group | null>(null)
  const partsRef = useRef<JewelryPartMap>({})
  const cameraRef = useRef<ThreePerspectiveCamera | null>(null)
  const keyLightIntensityRef = useRef({ value: 0.55 })
  const [partsReady, setPartsReady] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const keyLightRef = useRef<THREE.DirectionalLight>(null)
  const readySent = useRef(false)

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
    scrollDistance: 3200,
    movementScale: profile.movementScale,
    cameraTravel: profile.cameraTravel,
    keyLightIntensityRef,
  })

  useEffect(() => {
    let raf = 0
    const tick = () => {
      if (keyLightRef.current) {
        keyLightRef.current.intensity = keyLightIntensityRef.current.value
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.05, 6.2]} fov={30} near={0.1} far={100} />
      <CameraRig cameraRef={cameraRef} onReady={onCameraReady} />

      <color attach="background" args={['#fdf5e8']} />
      <fog attach="fog" args={['#fdf5e8', 10, 26]} />

      <ambientLight intensity={0.55} color="#ffffff" />
      <directionalLight
        ref={keyLightRef}
        castShadow={profile.enableShadows}
        position={[3.5, 5, 4]}
        intensity={0.55}
        color="#fff8ee"
        shadow-mapSize={[profile.isMobile ? 512 : 1024, profile.isMobile ? 512 : 1024]}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-2.5, 1.5, -1.5]} intensity={0.25} color="#d8e0f0" />
      <spotLight
        position={[-1.2, 4, 2.5]}
        angle={0.35}
        penumbra={0.85}
        intensity={0.3}
        color="#fff0d8"
      />

      <Environment preset="studio" environmentIntensity={0.35} />

      <Suspense fallback={null}>
        <Pendant useGlb={useGlb} onPartsReady={onPartsReady} />
      </Suspense>

      {profile.enableShadows && (
        <ContactShadows
          position={[-1.15, -1.35, 0]}
          opacity={0.22}
          scale={8}
          blur={3.2}
          far={3}
          color="#2a2418"
        />
      )}

      <EffectComposer multisampling={profile.isMobile ? 0 : 4}>
        <Bloom
          intensity={profile.bloomIntensity}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.55}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.35} darkness={0.18} />
      </EffectComposer>

      <AdaptiveDpr />
    </>
  )
}

function SceneComponent({ triggerRef, profile, useGlb, onReady }: SceneProps) {
  useEffect(() => {
    if (useGlb) preloadPendantGlb()
  }, [useGlb])

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: 'high-performance',
      }}
      shadows={profile.enableShadows}
      style={{ width: '100%', height: '100%', touchAction: 'none' }}
    >
      <JewelryScene
        triggerRef={triggerRef}
        profile={profile}
        useGlb={useGlb}
        onReady={onReady}
      />
    </Canvas>
  )
}

export const Scene = memo(SceneComponent)
