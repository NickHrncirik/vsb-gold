import fs from 'node:fs'
import https from 'node:https'
import http from 'node:http'
import { URL } from 'node:url'

function get(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    lib
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(new URL(res.headers.location, url).href).then(resolve, reject)
          return
        }
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }))
      })
      .on('error', reject)
  })
}

const page = await get('https://www.getglb.com/fashion/golden-jewelry-set/')
fs.writeFileSync('tmp-getglb.html', page.body)
const html = page.body.toString('utf8')
const glbs = [...html.matchAll(/https?:[^"'\\\s]+\.glb[^"'\\\s]*/gi)].map((m) => m[0])
const anyDownload = [...html.matchAll(/(?:href|src|data-url|data-src)=["']([^"']+)["']/gi)]
  .map((m) => m[1])
  .filter((u) => /glb|download|cdn|model|asset/i.test(u))
console.log('status', page.status)
console.log('glbs', glbs)
console.log('candidates', [...new Set(anyDownload)].slice(0, 50))

// Also try Sketchfab model info for three gem necklaces + sapphire
for (const uid of [
  '3355abffbbaa44c3a6959b46c90dbd34',
  'f71f5dd016d4415f9c1ea79cb26bdfdc',
  'b7ece6c0d8764b9dbba3b49d9974794f',
  '665b3ad25cad4436b506dbfb4545121b',
]) {
  const info = await get(`https://api.sketchfab.com/v3/models/${uid}`)
  const j = JSON.parse(info.body.toString('utf8'))
  console.log('\nSF', uid, j.name, j.license?.label, 'downloadable=', j.isDownloadable)
  const dl = await get(`https://api.sketchfab.com/v3/models/${uid}/download`)
  console.log('download status', dl.status, dl.body.toString('utf8').slice(0, 200))
}
