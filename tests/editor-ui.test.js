import test from 'node:test'
import assert from 'node:assert/strict'
import { setupRealSquire } from './real-squire.js'
import RichClay from '../src/richclay.js'
import { morph } from '../../hyper-morph/src/hyper-morph.js'

const tick = () => new Promise(resolve => setTimeout(resolve, 10))

test('real Squire ignores editor-ui churn and serializes clean public HTML', async () => {
  const dom = setupRealSquire('<article editable><p>Hello</p><button editor-ui contenteditable="false">Add</button></article>')
  const root = document.querySelector('article')
  const editor = new RichClay(root, {
    Squire: window.Squire,
    inline: true,
    toolbar: false,
    hyperclay: false,
  })
  await tick()
  editor.squire._mutation.takeRecords()
  let inputs = 0
  editor.squire.addEventListener('input', () => { inputs++ })
  const button = root.querySelector('[editor-ui]')
  button.style.width = '120px'
  button.firstChild.data = 'Add row'
  await tick()
  assert.equal(inputs, 0)
  assert.equal(editor.getHTML().includes('Add row'), false)
  root.querySelector('p').firstChild.data = 'Hello!'
  await tick()
  assert.equal(inputs, 1)
  editor.destroy()
  dom.window.close()
})

test('real Squire history keeps no-data-only content', () => {
  const dom = setupRealSquire('<article editable><p no-data>Private API content</p><p>Hello</p></article>')
  const root = document.querySelector('article')
  const editor = new RichClay(root, { Squire: window.Squire, inline: true, toolbar: false, hyperclay: false })
  editor.squire.saveUndoState()
  assert.equal(editor.squire._undoStack.some(html => html.includes('Private API content')), true)
  editor.destroy()
  dom.window.close()
})

test('clipboard HTML and plain text omit editor UI and retain block separators', () => {
  const dom = setupRealSquire('<article editable><div>One</div><button editor-ui contenteditable="false">Add</button><div>Two<br>Three</div></article>')
  const root = document.querySelector('article')
  const editor = new RichClay(root, { Squire: window.Squire, inline: true, toolbar: false, hyperclay: false })
  const range = document.createRange()
  range.selectNodeContents(root)
  editor.squire.setSelection(range)
  const values = {}
  const event = new window.Event('copy', { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'clipboardData', { value: { setData: (type, value) => { values[type] = value } } })
  root.dispatchEvent(event)
  assert.equal(values['text/html'].includes('Add'), false)
  assert.equal(values['text/plain'], 'One\nTwo\nThree')
  editor.destroy()
  dom.window.close()
})

test('nested mutations inside editor UI emit no input event', async () => {
  const dom = setupRealSquire('<article editable><div>Hello</div><div editor-ui><span>Tools</span></div></article>')
  const root = document.querySelector('article')
  const editor = new RichClay(root, { Squire: window.Squire, inline: true, toolbar: false, hyperclay: false })
  await tick()
  editor.squire._mutation.takeRecords()
  let inputs = 0
  editor.squire.addEventListener('input', () => { inputs++ })
  root.querySelector('[editor-ui] span').replaceChildren('Changed')
  await tick()
  assert.equal(inputs, 0)
  editor.destroy()
  dom.window.close()
})

test('public getHTML with bookmarks does not mutate the live root', () => {
  const dom = setupRealSquire('<article editable><div>Hello</div><button editor-ui contenteditable="false">Add</button></article>')
  const root = document.querySelector('article')
  const editor = new RichClay(root, { Squire: window.Squire, inline: true, toolbar: false, hyperclay: false })
  const observer = new window.MutationObserver(() => {})
  observer.observe(root, { subtree: true, childList: true, attributes: true, characterData: true })
  const range = document.createRange()
  range.setStart(root.querySelector('div').firstChild, 2)
  range.collapse(true)
  editor.squire.setSelection(range)
  const html = editor.squire.getHTML(true)
  assert.equal(html.includes('squire-selection-start'), true)
  assert.equal(html.includes('squire-selection-end'), true)
  assert.deepEqual(observer.takeRecords(), [])
  observer.disconnect()
  editor.destroy()
  dom.window.close()
})

test('history projects selection bookmarks out of editor UI', () => {
  const dom = setupRealSquire('<article editable><div>A</div><button editor-ui contenteditable="false">Add</button></article>')
  const root = document.querySelector('article')
  const editor = new RichClay(root, { Squire: window.Squire, inline: true, toolbar: false, hyperclay: false })
  const range = document.createRange()
  range.setStart(root.querySelector('button').firstChild, 1)
  range.collapse(true)
  editor.squire.setSelection(range)
  editor.squire._isInUndoState = false
  editor.squire.saveUndoState()
  const html = editor.squire._undoStack.at(-1)
  assert.equal(html.includes('squire-selection-start'), true)
  assert.equal(html.includes('squire-selection-end'), true)
  assert.equal(html.includes('Add'), false)
  editor.destroy()
  dom.window.close()
})

test('history replay repairs an empty root and inserts bottom lines before trailing UI', () => {
  const dom = setupRealSquire('<article editable><span>Hi</span><button editor-ui contenteditable="false">Add</button></article>')
  const root = document.querySelector('article')
  window.clay = { morph }
  globalThis.DOMParser = window.DOMParser
  globalThis.Element = window.Element
  globalThis.Document = window.Document
  globalThis.HTMLTemplateElement = window.HTMLTemplateElement
  const editor = new RichClay(root, { Squire: window.Squire, inline: true, toolbar: false, hyperclay: false })
  editor.squire._ensureBottomLine()
  assert.equal(root.lastElementChild.hasAttribute('editor-ui'), true)
  editor.squire._setRawHTML('')
  assert.equal(root.firstElementChild.tagName, 'DIV')
  editor.destroy()
  dom.window.close()
})

test('an editor nested in outer editor UI owns its internal content', () => {
  const dom = setupRealSquire('<section editor-ui><article editable><div>Hello</div></article></section>')
  const root = document.querySelector('article')
  const editor = new RichClay(root, { Squire: window.Squire, inline: true, toolbar: false, hyperclay: false })
  assert.equal(editor.getHTML().includes('Hello'), true)
  assert.equal(editor.squire._undoStack.some(html => html.includes('Hello')), true)
  editor.destroy()
  dom.window.close()
})

test('no-undo-only churn after undo keeps redo available and retains local state', async () => {
  const dom = setupRealSquire('<article editable><div class="content">A</div><span no-undo>Local1</span></article>')
  const root = document.querySelector('article')
  window.clay = { morph }
  globalThis.DOMParser = window.DOMParser
  globalThis.Element = window.Element
  globalThis.Document = window.Document
  globalThis.HTMLTemplateElement = window.HTMLTemplateElement
  const editor = new RichClay(root, { Squire: window.Squire, inline: true, toolbar: false, hyperclay: false })
  await tick()
  root.querySelector('.content').textContent = 'B'
  await tick()
  editor.squire.undo()
  assert.equal(root.querySelector('.content').textContent, 'A')
  let inputs = 0
  editor.squire.addEventListener('input', () => { inputs++ })
  root.querySelector('[no-undo]').textContent = 'Local2'
  await tick()
  assert.equal(inputs, 1)
  editor.squire.redo()
  assert.equal(root.querySelector('.content').textContent, 'B')
  assert.equal(root.querySelector('[no-undo]').textContent, 'Local2')
  editor.destroy()
  dom.window.close()
})
