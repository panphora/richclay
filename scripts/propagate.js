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

// Every copy of richclay in the workspace, in one table. A fix that reaches one
// destination and not the other is how a whole bug class stayed invisible: the
// clayjs copy was refreshed by hand while this script wrote only hyperclayjs.
// A missing path is a failure, not a destination to skip quietly.
//
// `--only <client>` narrows the table to one client's destinations; `--check`
// writes nothing and exits 1 naming every destination that is missing or stale.
// Each client owns its own vendor copy, so a release of one client never
// writes into the other's tree.
const DESTINATIONS = [
  { client: 'clayjs', path: 'clayjs/src/vendor/richclay.vendor.js', form: 'vendor' },
  { client: 'hyperclayjs', path: 'hyperclayjs/src/vendor/richclay.vendor.js', form: 'vendor' }
]

const args = process.argv.slice(2)
const isCheck = args.includes('--check')
const onlyIndex = args.indexOf('--only')
const only = onlyIndex === -1 ? null : args[onlyIndex + 1]

const clients = [...new Set(DESTINATIONS.map(destination => destination.client))]

if (onlyIndex !== -1 && !only) {
  console.error(`Error: --only needs a client name. Known clients: ${clients.join(', ')}.`)
  process.exit(1)
}

const targets = only ? DESTINATIONS.filter(destination => destination.client === only) : DESTINATIONS

if (!targets.length) {
  console.error(`Error: no destination for client "${only}". Known clients: ${clients.join(', ')}.`)
  process.exit(1)
}

if (!fs.existsSync(distFile)) {
  console.error('Error: dist/richclay.min.js not found. Run "npm run build" first.')
  process.exit(1)
}

const bundle = fs.readFileSync(distFile, 'utf8')
const contentFor = form => (form === 'vendor' ? `${bundle.trim()}\n${WRAPPER_CODE}` : bundle)

if (isCheck) {
  const stale = targets.filter(destination => {
    const file = path.join(workspace, destination.path)
    if (!fs.existsSync(file)) return true
    return fs.readFileSync(file, 'utf8') !== contentFor(destination.form)
  })
  stale.forEach(destination => {
    const file = path.join(workspace, destination.path)
    console.error(`✗ ${fs.existsSync(file) ? 'stale' : 'missing'}: ${destination.path}`)
  })
  if (stale.length) process.exit(1)
  targets.forEach(destination => console.log(`✓ in sync ${destination.path}`))
  process.exit(0)
}

const missing = targets.filter(
  destination => !fs.existsSync(path.dirname(path.join(workspace, destination.path)))
)
if (missing.length) {
  missing.forEach(destination => {
    console.error(`Error: destination folder not found for ${destination.path}`)
  })
  console.error(`Every destination is resolved against ${workspace}.`)
  process.exit(1)
}

targets.forEach(destination => {
  fs.writeFileSync(path.join(workspace, destination.path), contentFor(destination.form), 'utf8')
  console.log(`✓ Updated ${destination.path}`)
})
