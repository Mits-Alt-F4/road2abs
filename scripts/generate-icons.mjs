// Generates Road2Abs PWA icons from an SVG source using the bundled sharp.
import { createRequire } from 'module'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const sharp = require(join(__dirname, '../node_modules/sharp/lib/index.js'))

const OUT = join(__dirname, '../public/icons')
mkdirSync(OUT, { recursive: true })

// Road2Abs icon SVG — dark charcoal bg, forest-green road stripe, bold R·A wordmark
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- Background -->
  <rect width="512" height="512" rx="96" fill="#1c1917"/>
  <!-- Road stripe (green diagonal) -->
  <path d="M 100 420 Q 256 256 412 120" stroke="#3a6235" stroke-width="72" stroke-linecap="round" fill="none" opacity="0.7"/>
  <path d="M 100 420 Q 256 256 412 120" stroke="#4a7c44" stroke-width="40" stroke-linecap="round" fill="none" opacity="0.5"/>
  <!-- Centre dashes -->
  <line x1="160" y1="360" x2="196" y2="316" stroke="#a3e635" stroke-width="10" stroke-linecap="round" stroke-dasharray="18 14"/>
  <line x1="220" y1="288" x2="280" y2="224" stroke="#a3e635" stroke-width="10" stroke-linecap="round" stroke-dasharray="18 14"/>
  <!-- Wordmark: R -->
  <text x="64" y="320" font-family="system-ui, -apple-system, sans-serif" font-weight="900"
        font-size="220" fill="#f5f5f4" letter-spacing="-8" opacity="0.95">R</text>
  <!-- Wordmark: A (offset right) -->
  <text x="256" y="340" font-family="system-ui, -apple-system, sans-serif" font-weight="900"
        font-size="220" fill="#f5f5f4" letter-spacing="-8" opacity="0.95">A</text>
</svg>`

const svgBuf = Buffer.from(SVG)

async function make(size, name) {
  const buf = await sharp(svgBuf).resize(size, size).png().toBuffer()
  writeFileSync(join(OUT, name), buf)
  console.log(`✓ ${name}`)
}

// Maskable: add safe-zone padding (10% each side = 80% content area)
const SVG_MASKABLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#1c1917"/>
  <rect x="52" y="52" width="408" height="408" rx="72" fill="#1c1917"/>
  <path d="M 130 400 Q 256 256 382 140" stroke="#3a6235" stroke-width="60" stroke-linecap="round" fill="none" opacity="0.7"/>
  <path d="M 130 400 Q 256 256 382 140" stroke="#4a7c44" stroke-width="34" stroke-linecap="round" fill="none" opacity="0.5"/>
  <line x1="172" y1="350" x2="202" y2="310" stroke="#a3e635" stroke-width="8" stroke-linecap="round" stroke-dasharray="16 12"/>
  <line x1="228" y1="278" x2="278" y2="222" stroke="#a3e635" stroke-width="8" stroke-linecap="round" stroke-dasharray="16 12"/>
  <text x="80" y="300" font-family="system-ui,-apple-system,sans-serif" font-weight="900"
        font-size="180" fill="#f5f5f4" opacity="0.95">R</text>
  <text x="264" y="318" font-family="system-ui,-apple-system,sans-serif" font-weight="900"
        font-size="180" fill="#f5f5f4" opacity="0.95">A</text>
</svg>`

const maskBuf = Buffer.from(SVG_MASKABLE)

await Promise.all([
  make(192, 'icon-192.png'),
  make(512, 'icon-512.png'),
  sharp(maskBuf).resize(512, 512).png().toBuffer().then(b => {
    writeFileSync(join(OUT, 'icon-maskable-512.png'), b)
    console.log('✓ icon-maskable-512.png')
  }),
  make(180, 'apple-touch-icon.png'),
])
console.log('Icons generated.')
