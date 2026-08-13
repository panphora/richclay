#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const workspace = path.join(rootDir, '..')

const distFile = path.join(rootDir, 'dist', 'richclay.min.js')

const WRAPPER_CODE = `
// Auto-export to window unless suppressed by loader. The self-contained bundle
// above also installs globalThis.Squire / globalThis.DOMPurify when absent.
if (!window.__hyperclayNoAutoExport) {
  window.hyperclay = window.hyperclay || {};
  window.hyperclay.RichClay = richclay.default;
  window.RichClay = window.RichClay || richclay.default;
  window.h = window.hyperclay;
}

export const RichClay = richclay.default;
export default richclay.default;
`

// Every copy of richclay in the workspace, in one list. A fix that reaches one
// destination and not the other is how a whole bug class stayed invisible: the
// clayjs copy was refreshed by hand while this script wrote only hyperclayjs.
// A missing path is a failure, not a destination to skip quietly.
const DESTINATIONS = [
  { path: 'clayjs/src/vendor/richclay.vendor.js', form: 'vendor' },
  { path: 'hyperclayjs/src/vendor/richclay.vendor.js', form: 'vendor' },
  { path: 'clayjs/website/vendor/richclay.min.js', form: 'bundle' },
  { path: 'hyperclay-actual-website/assets/vendor/richclay.min.js', form: 'bundle' }
]

const isCheck = process.argv.includes('--check')

if (!fs.existsSync(distFile)) {
  if (isCheck) process.exit(1)
  console.error('Error: dist/richclay.min.js not found. Run "npm run build" first.')
  process.exit(1)
}

const bundle = fs.readFileSync(distFile, 'utf8')
const contentFor = form => (form === 'vendor' ? `${bundle.trim()}\n${WRAPPER_CODE}` : bundle)

if (isCheck) {
  const stale = DESTINATIONS.some(destination => {
    const file = path.join(workspace, destination.path)
    if (!fs.existsSync(file)) return true
    return fs.readFileSync(file, 'utf8') !== contentFor(destination.form)
  })
  process.exit(stale ? 1 : 0)
}

const missing = DESTINATIONS.filter(
  destination => !fs.existsSync(path.dirname(path.join(workspace, destination.path)))
)
if (missing.length) {
  missing.forEach(destination => {
    console.error(`Error: destination folder not found for ${destination.path}`)
  })
  console.error(`Every destination is resolved against ${workspace}.`)
  process.exit(1)
}

DESTINATIONS.forEach(destination => {
  fs.writeFileSync(path.join(workspace, destination.path), contentFor(destination.form), 'utf8')
  console.log(`✓ Updated ${destination.path}`)
})
