import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const UID = 'f45e7a8ed6b947c4af6039994e0e6ada'
const DIR = path.resolve('public/models')
fs.mkdirSync(DIR, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ acceptDownloads: true })
const page = await context.newPage()

const hits = []
page.on('response', (res) => {
  const url = res.url()
  if (/\.(glb|gltf|bin|zip)(\?|$)/i.test(url) || /\/download|gltf|source|archives/i.test(url)) {
    hits.push(`${res.status()} ${url}`)
  }
})

await page.goto(`https://sketchfab.com/3d-models/skull-pendant-jewellery-50mm-${UID}`, {
  waitUntil: 'domcontentloaded',
  timeout: 90000,
})
await page.waitForTimeout(5000)

const apiTry = await page.evaluate(async (uid) => {
  const urls = [
    `https://api.sketchfab.com/v3/models/${uid}/download`,
    `https://sketchfab.com/i/models/${uid}/download`,
  ]
  const out = []
  for (const u of urls) {
    try {
      const r = await fetch(u, { credentials: 'include' })
      out.push({ u, status: r.status, body: (await r.text()).slice(0, 500) })
    } catch (e) {
      out.push({ u, error: String(e) })
    }
  }
  // collect any source urls from page config
  const scripts = [...document.querySelectorAll('script')]
    .map((s) => s.textContent || '')
    .join('\n')
  const m = scripts.match(/https?:[^"']+gltf[^"']+/gi) || []
  return { out, m: m.slice(0, 20), title: document.title }
}, UID)

console.log(JSON.stringify(apiTry, null, 2))
console.log('hits', hits.slice(0, 30))

const btn = page.getByRole('button', { name: /Download/i }).first()
const link = page.getByRole('link', { name: /Download/i }).first()
if ((await btn.count()) || (await link.count())) {
  const target = (await btn.count()) ? btn : link
  console.log('clicking download')
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 20000 }).catch(() => null),
    target.click(),
  ])
  await page.waitForTimeout(2500)
  console.log('after click url', page.url())
  // maybe a modal with glTF option
  const gltf = page.getByText(/glTF/i).first()
  if (await gltf.count()) {
    console.log('found glTF option')
    const [d2] = await Promise.all([
      page.waitForEvent('download', { timeout: 30000 }).catch(() => null),
      gltf.click(),
    ])
    const d = d2 || download
    if (d) {
      const dest = path.join(DIR, d.suggestedFilename())
      await d.saveAs(dest)
      console.log('saved', dest, fs.statSync(dest).size)
    }
  } else if (download) {
    const dest = path.join(DIR, download.suggestedFilename())
    await download.saveAs(dest)
    console.log('saved', dest, fs.statSync(dest).size)
  }
}

await page.screenshot({ path: 'scripts/scroll-shots/sf-skull.png', fullPage: true })
await browser.close()
console.log('done', fs.readdirSync(DIR))
