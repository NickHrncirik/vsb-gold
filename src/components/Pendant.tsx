import { Component, memo, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import { detectJewelryParts } from '../utils/detectJewelryParts'
import { PENDANT_GLB_PATH } from '../utils/probePendantGlb'
import type { JewelryPartMap } from '../types/jewelry'

export { PENDANT_GLB_PATH }

/** Force polished gold look for product jewelry. */
function polishJewelryMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    const mesh = child as Mesh
    if (!mesh.isMesh) return
    mesh.castShadow = true
    mesh.receiveShadow = true

    const apply = (mat: THREE.Material) => {
      const m = mat as MeshStandardMaterial
      if (!m.isMeshStandardMaterial && !('metalness' in m)) return
      m.color.set('#c9a84a')
      m.metalness = 0.95
      m.roughness = 0.26
      m.envMapIntensity = 1.15
      m.needsUpdate = true
    }

    if (Array.isArray(mesh.material)) mesh.material.forEach(apply)
    else if (mesh.material) apply(mesh.material)
  })
}

function GlbPendant({
  onPartsReady,
}: {
  onPartsReady: (root: Group, parts: JewelryPartMap) => void
}) {
  const { scene } = useGLTF(PENDANT_GLB_PATH)
  const rootRef = useRef<Group>(null)

  const cloned = useMemo(() => {
    const c = scene.clone(true)
    polishJewelryMaterials(c)

    const box = new THREE.Box3().setFromObject(c)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    c.scale.setScalar(2.1 / maxDim)
    box.setFromObject(c)
    c.position.sub(box.getCenter(new THREE.Vector3()))
    return c
  }, [scene])

  useLayoutEffect(() => {
    if (!rootRef.current) return
    onPartsReady(rootRef.current, detectJewelryParts(rootRef.current))
  }, [cloned, onPartsReady])

  return (
    <group
      ref={rootRef}
      name="PendantRoot"
      position={[-1.2, 0.1, 0]}
      rotation={[0.15, 0.45, -0.08]}
    >
      <primitive object={cloned} />
    </group>
  )
}

/** Minimal fallback only if the GLB fails to load. */
function FallbackOrb({
  onPartsReady,
}: {
  onPartsReady: (root: Group, parts: JewelryPartMap) => void
}) {
  const rootRef = useRef<Group>(null)
  useLayoutEffect(() => {
    if (!rootRef.current) return
    onPartsReady(rootRef.current, detectJewelryParts(rootRef.current))
  }, [onPartsReady])

  return (
    <group ref={rootRef} position={[-1.15, 0, 0]}>
      <mesh name="Medallion" castShadow>
        <torusGeometry args={[0.6, 0.18, 24, 48]} />
        <meshStandardMaterial color="#c9a84a" metalness={0.92} roughness={0.28} />
      </mesh>
      <mesh name="Gem" castShadow position={[0, 0, 0.1]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial color="#1a4a6e" metalness={0.1} roughness={0.1} />
      </mesh>
    </group>
  )
}

class GlbErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

interface PendantProps {
  useGlb: boolean
  onPartsReady: (root: Group, parts: JewelryPartMap) => void
}

function PendantComponent({ useGlb, onPartsReady }: PendantProps) {
  if (!useGlb) return <FallbackOrb onPartsReady={onPartsReady} />
  return (
    <GlbErrorBoundary fallback={<FallbackOrb onPartsReady={onPartsReady} />}>
      <GlbPendant onPartsReady={onPartsReady} />
    </GlbErrorBoundary>
  )
}

export const Pendant = memo(PendantComponent)

export function preloadPendantGlb() {
  useGLTF.preload(PENDANT_GLB_PATH)
}
