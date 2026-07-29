/** Drop production jewelry model at `public/models/pendant.glb`. */
export const PENDANT_GLB_PATH = '/models/pendant.glb'

/**
 * Confirm a real GLB exists.
 * Vite SPA fallback returns 200 + HTML for missing files — verify glTF magic.
 */
export async function probePendantGlb(): Promise<boolean> {
  try {
    const res = await fetch(PENDANT_GLB_PATH, {
      headers: { Range: 'bytes=0-3' },
      cache: 'no-store',
    })
    if (!res.ok) return false
    const type = res.headers.get('content-type') ?? ''
    if (type.includes('text/html')) return false
    const bytes = new Uint8Array(await res.arrayBuffer())
    if (bytes.length < 4) return false
    const magic = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3])
    return magic === 'glTF'
  } catch {
    return false
  }
}
