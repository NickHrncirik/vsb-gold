import type { Object3D, Mesh } from 'three'
import type { JewelryPartKey, JewelryPartMap } from '../types/jewelry'

const MATCH_ORDER: JewelryPartKey[] = [
  'ChainLeft',
  'ChainRight',
  'BackPlate',
  'Medallion',
  'Setting',
  'Frame',
  'Bail',
  'Gem',
  'Clasp',
]

const ALIASES: Record<JewelryPartKey, string[]> = {
  ChainLeft: ['chainleft', 'chain_left', 'leftchain', 'chain_l'],
  ChainRight: ['chainright', 'chain_right', 'rightchain', 'chain_r'],
  Bail: ['bail', 'loop', 'hanger', 'bale'],
  Frame: ['frame', 'bezel', 'ring', 'rim', 'halo'],
  Gem: ['gem', 'stone', 'diamond', 'crystal', 'sapphire', 'ruby'],
  Setting: ['setting', 'prong', 'prongs', 'mount', 'claw'],
  Medallion: ['medallion', 'pendant', 'face', 'disc', 'center', 'body'],
  BackPlate: ['backplate', 'back', 'rear', 'reverse'],
  Clasp: ['clasp', 'lock', 'buckle', 'closure'],
}

function normalize(name: string): string {
  return name.toLowerCase().replace(/[\s\-_.]/g, '')
}

function isMesh(obj: Object3D): obj is Mesh {
  return (obj as Mesh).isMesh === true
}

/**
 * Map meshes from a GLB to canonical jewelry keys.
 * If the file uses generic names (Cylinder001…), collect every mesh into `extras`
 * so the scroll timeline can still explode the piece.
 */
export function detectJewelryParts(root: Object3D): JewelryPartMap {
  const parts: JewelryPartMap = {}
  const claimed = new Set<JewelryPartKey>()
  const meshes: Object3D[] = []

  root.traverse((child) => {
    if (isMesh(child)) meshes.push(child)
    if (!child.name) return
    const n = normalize(child.name)

    for (const key of MATCH_ORDER) {
      if (claimed.has(key)) continue
      const hit = ALIASES[key].some((alias) => n.includes(normalize(alias)))
      if (hit) {
        parts[key] = child
        claimed.add(key)
        break
      }
    }
  })

  // Prefer exploding whole named nodes when artist grouped them;
  // otherwise explode individual meshes.
  if (claimed.size < 3) {
    parts.extras = meshes.filter((m) => {
      // Skip tiny helper meshes if any
      return m.visible
    })
  }

  return parts
}
