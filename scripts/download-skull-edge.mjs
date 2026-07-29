import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const UID = 'f45e7a8ed6b947c4af6039994e0e6ada'
const DIR = path.resolve('public/models')
const edgeProfile = path.join(os.homedir(), 'AppData/Local/Microsoft/Edge/User Data')
const tmpProfile = path.join(os.tmpdir(), 'vsb-edge-sf-profile')

// Copy Essential cookies/login from Default if possible is heavy; instead use channel msedge
// with a dedicated profile directory that may still be empty — try persistent Default copy of Cookies only.

fs.mkdirSync(DIR, { recursive: true })
fs.mkdirSync(tmpProfile, { recursive: true })

const browser = await chromium.launch({
  channel: 'msedge',
  headless: false,
  args: ['--disable-blink-features=AutomationControlled'],
})
const context = await browser.newContext({ acceptDownloads: true })
const page = await context.newPage()

await page.goto(`https://sketchfab.com/3d-models/skull-pendant-jewellery-50mm-${UID}`, {
  waitUntil: 'domcontentloaded',
  timeout: 90000,
})
await page.waitForTimeout(2000)

const status = await page.evaluate(async (uid) => {
  const r = await fetch(`https://api.sketchfab.com/v3/models/${uid}/download`, { credentials: 'include' })
  return { status: r.status, body: (await r.text()).slice(0, 300) }
}, UID)
console.log('auth check', status)

if (status.status === 401) {
  console.log('NEED_LOGIN')
  // Keep window briefly so user could login — but automation shouldn't wait forever
  await browser.close()
  process.exit(2)
}

const data = JSON.parse(status.body)
// Sketchfab returns { gltf: { url }, usdz?, ... }
const gltfUrl = data.gltf?.url || data.glb?.url
console.log('keys', Object.keys(data))
if (!gltfUrl) {
  console.log('payload', JSON.stringify(data).slice(0, 800))
  await browser.close()
  process.exit(3)
}

// Prefer downloading via page download click for zip
const btn = page.getByText('Download 3D Model').first()
await btn.click()
await page.waitForTimeout(1000)
const gltfOpt = page.getByText(/^glTF/i).first()
const [download] = await Promise.all([
  page.waitForEvent('download', { timeout: 60000 }),
  gltfOpt.click(),
])
const zipPath = path.join(DIR, download.suggestedFilename())
await download.saveAs(zipPath)
console.log('saved', zipPath, fs.statSync(zipPath).size)
await browser.close()
