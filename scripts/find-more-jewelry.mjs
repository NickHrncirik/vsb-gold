import fs from 'node:fs'
import https from 'node:https'

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(res.headers.location).then(resolve, reject)
          return
        }
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }))
      })
      .on('error', reject)
  })
}

const page = await get('https://www.getglb.com/?s=pendant')
const html = page.body.toString('utf8')
const links = [...html.matchAll(/href="(\/fashion\/[^"]+|\/[^"]*pendant[^"]*|\/[^"]*necklace[^"]*|\/[^"]*jewel[^"]*)"/gi)].map(
  (m) => m[1],
)
console.log('search status', page.status)
console.log([...new Set(links)].slice(0, 40).join('\n'))

// Try a few known high-ish quality jewelry pages for .glb links
const pages = [
  'https://www.getglb.com/fashion/golden-jewelry-set/',
  'https://www.getglb.com/?s=gold+necklace',
  'https://www.getglb.com/?s=sapphire+pendant',
]
for (const url of pages) {
  const p = await get(url)
  const h = p.body.toString('utf8')
  const glbs = [...h.matchAll(/https?:[^"'\\\s>]+\.glb/gi)].map((m) => m[0])
  console.log('\n', url, '->', [...new Set(glbs)])
}
