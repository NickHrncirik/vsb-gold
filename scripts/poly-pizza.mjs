import fs from 'node:fs'
import https from 'node:https'

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(new URL(res.headers.location, url).href).then(resolve, reject)
          return
        }
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () =>
          resolve({ status: res.statusCode, type: res.headers['content-type'], body: Buffer.concat(chunks) }),
        )
      })
      .on('error', reject)
  })
}

// Poly Pizza often serves zips; try model page HTML for asset URLs
const pages = [
  'https://poly.pizza/m/Ui1jIqG4w9',
  'https://poly.pizza/m/mwrYIsWbME',
  'https://poly.pizza/m/Mezewzksj5',
]
for (const url of pages) {
  const p = await get(url)
  const h = p.body.toString('utf8')
  const urls = [...h.matchAll(/https?:[^"'\\\s>]+\.(?:glb|gltf|zip)/gi)].map((m) => m[0])
  const cdn = [...h.matchAll(/https?:\/\/[^"'\\\s>]*poly\.pizza[^"'\\\s>]*/gi)].map((m) => m[0]).slice(0, 20)
  console.log('\n', url, p.status)
  console.log('assets', [...new Set(urls)])
  console.log('cdn sample', [...new Set(cdn)].slice(0, 10))
}
