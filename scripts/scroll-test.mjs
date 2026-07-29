import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(__dirname, 'scroll-shots')

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)

const fs = await import('node:fs')
fs.mkdirSync(out, { recursive: true })

await page.screenshot({ path: path.join(out, '01-start.png') })

const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
const steps = [0.25, 0.5, 0.75, 1]
for (const p of steps) {
  await page.evaluate((y) => window.scrollTo(0, y), max * p)
  await page.waitForTimeout(900)
  await page.screenshot({ path: path.join(out, `0${steps.indexOf(p) + 2}-${Math.round(p * 100)}.png`) })
}

console.log(JSON.stringify({ maxScroll: max, shots: fs.readdirSync(out) }, null, 2))
await browser.close()
