// End-to-end page check — run with: node browser.test.mjs
//
// Loads every public page and every admin module in real headless Chrome and
// fails on a blank render, a thrown exception or a console error. This is the
// class of bug a build cannot catch: `npm run build` compiled the Contact page
// happily while it crashed the whole app at runtime on a module-scope
// ReferenceError.
//
// It serves the built site and the API from one process (server.js, the same
// entry point production uses), so there is no dev-server or CORS variable in
// the way. Requires `npm run build` first.
//
// Chrome is driven over the DevTools protocol using Node's built-in WebSocket
// (Node 22+). ponytail: no puppeteer — it would pull a second ~150MB Chromium
// to do what the installed browser already does. Swap it in if this harness
// ever needs more than navigate-and-evaluate.

import './server/src/lib/loadenv.js'
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createServer } from 'node:http'
import { createApp } from './server/src/app.js'
import db from './server/src/db.js'

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => existsSync(p))

if (!CHROME) {
  console.error('No Chrome or Edge found — skipping browser tests.')
  process.exit(0)
}
if (!existsSync(new URL('./dist/index.html', import.meta.url))) {
  console.error('\n  No build found in dist/. Run "npm run build" first.\n')
  process.exit(1)
}

// ── Serve the built site + API on one origin ────────────────────────────────
const app = createApp({ staticDir: path.join(process.cwd(), 'dist') })
const server = createServer(app).listen(0)
await new Promise((r) => server.once('listening', r))
const ORIGIN = `http://127.0.0.1:${server.address().port}`

// ── Launch Chrome ───────────────────────────────────────────────────────────
const profile = mkdtempSync(path.join(tmpdir(), 'rw-chrome-'))
const debugPort = 9200 + Math.floor(Math.random() * 500)
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--hide-scrollbars',
    '--window-size=1280,900',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function waitForChrome() {
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${debugPort}/json/version`)
      if (res.ok) return res.json()
    } catch {
      /* not up yet */
    }
    await sleep(200)
  }
  throw new Error('Chrome did not expose its debugging port')
}
await waitForChrome()

// ── Minimal CDP client ──────────────────────────────────────────────────────
function cdp(url) {
  const ws = new WebSocket(url)
  let seq = 0
  const pending = new Map()
  const listeners = []
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data)
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result)
    } else if (msg.method) {
      for (const fn of listeners) fn(msg)
    }
  })
  const ready = new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve)
    ws.addEventListener('error', () => reject(new Error(`cannot connect to ${url}`)))
  })
  return {
    ready,
    on: (fn) => listeners.push(fn),
    send(method, params = {}) {
      const id = ++seq
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject })
        ws.send(JSON.stringify({ id, method, params }))
      })
    },
    close: () => ws.close(),
  }
}

const browser = cdp((await (await fetch(`http://127.0.0.1:${debugPort}/json/version`)).json()).webSocketDebuggerUrl)
await browser.ready
const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' })
const pageWsUrl = (await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json()).find(
  (t) => t.id === targetId,
).webSocketDebuggerUrl

const page = cdp(pageWsUrl)
await page.ready
await page.send('Page.enable')
await page.send('Runtime.enable')
await page.send('Log.enable')

// Collect everything the page complains about.
let problems = []
const IGNORE = [
  /favicon/i,
  /net::ERR_/i, // unsplash images etc. are not what this suite is testing
  /google\.com\/maps/i,
  /Download the React DevTools/i,
  /third-party cookie/i,
]
const noteProblem = (text) => {
  if (!text) return
  if (IGNORE.some((re) => re.test(text))) return
  problems.push(text.slice(0, 300))
}
page.on((msg) => {
  if (msg.method === 'Runtime.exceptionThrown') {
    const d = msg.params.exceptionDetails
    noteProblem('Uncaught: ' + (d.exception?.description || d.text))
  }
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
    noteProblem('console.error: ' + msg.params.args.map((a) => a.description || a.value).join(' '))
  }
  if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
    noteProblem('log: ' + msg.params.entry.text)
  }
})

const evaluate = async (expression) => {
  const r = await page.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text)
  return r.result.value
}

// A crashed React app leaves #root empty and the Suspense fallback is a single
// div, so anything in double figures is a real render. The admin sign-in card
// is only 28 nodes — the bar has to clear that, not the marketing pages.
const MIN_NODES = 10

// innerText alone misses form field values, which is most of what the admin
// edit screens actually show — the settings page renders every company detail
// into an <input value>, and asserting on innerText would call it blank.
const SNAPSHOT = `(() => {
  const root = document.getElementById('root')
  if (!root) return { ready: document.readyState, text: '', nodes: 0 }
  const fields = [...root.querySelectorAll('input, textarea, select')]
    .map((el) => el.value)
    .filter(Boolean)
    .join(' | ')
  return {
    ready: document.readyState,
    text: (root.innerText + ' | ' + fields).trim(),
    nodes: root.querySelectorAll('*').length,
  }
})()`

// Navigate, then wait until the SPA has actually painted something.
async function goto(pathname) {
  problems = []
  await page.send('Page.navigate', { url: ORIGIN + pathname })
  for (let i = 0; i < 60; i++) {
    await sleep(250)
    const state = await evaluate(SNAPSHOT).catch(() => null)
    if (state && state.ready === 'complete' && state.nodes >= MIN_NODES && state.text.length > 40) return state
  }
  return evaluate(SNAPSHOT)
}

// ── Test runner ─────────────────────────────────────────────────────────────
let pass = 0
const failures = []
const results = []

async function check(name, fn) {
  try {
    await fn()
    pass++
    results.push(`  PASS  ${name}`)
  } catch (err) {
    failures.push(`${name}: ${err.message}`)
    results.push(`  FAIL  ${name} — ${err.message}`)
  }
}

// Asserts the page rendered, is not blank, threw nothing, and shows `expect`.
async function pageRenders(name, pathname, expect = []) {
  await check(name, async () => {
    const state = await goto(pathname)
    if (state.nodes < MIN_NODES || state.text.length < 40)
      throw new Error(`blank render (${state.nodes} nodes, ${state.text.length} chars of text)`)
    for (const needle of expect) {
      const re = needle instanceof RegExp ? needle : new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      if (!re.test(state.text)) throw new Error(`page never showed ${needle}`)
    }
    if (problems.length) throw new Error(problems.join(' | '))
  })
}

// ── Public pages ────────────────────────────────────────────────────────────
const api = async (p) => (await fetch(`${ORIGIN}/api${p}`)).json()
const packages = await api('/packages')
const tour = packages.find((p) => p.category !== 'umrah')
const umrah = packages.find((p) => p.category === 'umrah')
const visas = await api('/visas')
const settings = await api('/settings')

await pageRenders('page /  (home)', '/', [settings.phone, 'RadiantWay'])
await pageRenders('page /tours', '/tours', [tour.name])
await pageRenders(`page /tours/:slug (${tour.slug})`, `/tours/${tour.slug}`, [tour.name])
await pageRenders('page /umrah', '/umrah', umrah ? [umrah.name] : [])
if (umrah) await pageRenders(`page /umrah/:slug (${umrah.slug})`, `/umrah/${umrah.slug}`, [umrah.name])
await pageRenders('page /visa', '/visa', [visas[0].country])
await pageRenders('page /about', '/about', ['About'])
await pageRenders('page /contact', '/contact', ['Send us a message', settings.email])
await pageRenders('page /book redirects to /contact', '/book', ['Send us a message'])
await pageRenders('page /nonsense (404 page)', '/definitely-not-a-page', [/not found|404/i])

await check('contact form submits and confirms', async () => {
  await goto('/contact')
  const stamp = Date.now()
  for (let i = 0; i < 40 && !(await evaluate(`/What is \\d+ \\+ \\d+/.test(document.querySelector('form').innerText)`)); i++)
    await sleep(250)
  await evaluate(`(() => {
    const set = (el, v) => {
      const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement : HTMLInputElement
      Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(el, v)
      el.dispatchEvent(new Event('input', { bubbles: true }))
    }
    const form = document.querySelector('form')
    const [name, email, phone] = form.querySelectorAll('input')
    set(name, 'ZZ Browser Test')
    set(email, 'zz-browser-${stamp}@example.com')
    set(phone, '+971500000002')
    set(form.querySelector('textarea'), 'automated browser test')
    const [a, b] = form.innerText.match(/What is (\\d+) \\+ (\\d+)/).slice(1).map(Number)
    set([...form.querySelectorAll('input')].pop(), String(a + b))
    form.querySelector('button[type=submit]').click()
    return true
  })()`)
  let confirmed = false
  for (let i = 0; i < 40 && !confirmed; i++) {
    await sleep(250)
    confirmed = await evaluate(`/message sent/i.test(document.getElementById('root').innerText)`)
  }
  if (!confirmed) throw new Error('the form never confirmed the submission')
  if (problems.length) throw new Error(problems.join(' | '))

  // Clean up the lead this created.
  const login = await fetch(`${ORIGIN}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }),
  }).then((r) => r.json())
  const leads = await fetch(`${ORIGIN}/api/admin/leads`, {
    headers: { Authorization: `Bearer ${login.token}` },
  }).then((r) => r.json())
  const mine = (Array.isArray(leads) ? leads : leads.items || []).find(
    (l) => l.email === `zz-browser-${stamp}@example.com`,
  )
  if (mine)
    await fetch(`${ORIGIN}/api/admin/leads/${mine.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${login.token}` },
    })
})

// ── Admin panel ─────────────────────────────────────────────────────────────
await pageRenders('admin /admin/login renders', '/admin/login', [/sign in|log in|password/i])

await check('admin /admin redirects to login when signed out', async () => {
  await goto('/admin')
  const url = await evaluate('location.pathname')
  if (!url.includes('/admin/login')) throw new Error(`expected a redirect to the login page, landed on ${url}`)
})

await check('admin login form signs in', async () => {
  await goto('/admin/login')
  await evaluate(`(() => {
    const set = (el, v) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, v)
      el.dispatchEvent(new Event('input', { bubbles: true }))
    }
    const form = document.querySelector('form')
    const [email, password] = form.querySelectorAll('input')
    set(email, ${JSON.stringify(process.env.ADMIN_EMAIL)})
    set(password, ${JSON.stringify(process.env.ADMIN_PASSWORD)})
    form.querySelector('button[type=submit]').click()
    return true
  })()`)
  let landed = false
  for (let i = 0; i < 40 && !landed; i++) {
    await sleep(250)
    landed = await evaluate(`location.pathname === '/admin' || !!localStorage.getItem('rw_admin_token')`)
  }
  if (!landed) throw new Error('login did not sign in')
  if (problems.length) throw new Error(problems.join(' | '))
})

// Every module in the admin nav.
const adminModules = [
  ['dashboard', '/admin', [/dashboard|packages|leads/i]],
  ['packages', '/admin/packages', [tour.name]],
  ['destinations', '/admin/destinations', []],
  ['visas', '/admin/visas', [visas[0].country]],
  ['testimonials', '/admin/testimonials', []],
  ['faqs', '/admin/faqs', []],
  ['services', '/admin/services', []],
  ['bookings', '/admin/bookings', [/booking/i]],
  ['leads', '/admin/leads', [/lead|enquir|message/i]],
  ['subscribers', '/admin/subscribers', [/subscriber|email/i]],
  ['settings', '/admin/settings', [settings.phone]],
]
for (const [name, pathname, expect] of adminModules) {
  await pageRenders(`admin module: ${name}`, pathname, expect)
}

// The edit form for each resource, on a real row and on "new".
for (const [resource, list] of [
  ['packages', packages],
  ['visas', visas],
]) {
  const row = list[0]
  await pageRenders(`admin edit form: ${resource}/${row.id}`, `/admin/${resource}/${row.id}`, [])
  await pageRenders(`admin new form: ${resource}/new`, `/admin/${resource}/new`, [])
}

// ── Report ──────────────────────────────────────────────────────────────────
console.log(results.join('\n'))
console.log(`\nBrowser: ${pass} passed, ${failures.length} failed`)

page.close()
browser.close()
chrome.kill()
server.close()
await db.$disconnect()
try {
  rmSync(profile, { recursive: true, force: true })
} catch {
  /* Chrome may still hold a handle; the temp dir is disposable either way */
}
if (failures.length) {
  console.error('\nFailures:\n' + failures.map((f) => '  - ' + f).join('\n'))
  process.exit(1)
}
process.exit(0)
