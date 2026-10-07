// Full API surface check — run with: node server/src/api.test.mjs
//
// Boots the real app on an ephemeral port against the real database, then
// walks every route: public reads, the three public form posts, auth, and a
// create/read/update/delete round trip for each admin resource. Everything it
// creates it deletes again, so it is safe to run against a dev database.
import './lib/loadenv.js'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { createApp } from './app.js'
import db from './db.js'

const server = createServer(createApp({ staticDir: null })).listen(0)
await new Promise((r) => server.once('listening', r))
const base = `http://127.0.0.1:${server.address().port}/api`

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

let token = ''
const call = async (method, path, body, { auth = false } = {}) => {
  const headers = {}
  if (auth) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['content-type'] = 'application/json'
  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }
  return { status: res.status, data }
}

const expect = (res, status, what) =>
  assert.equal(
    res.status,
    status,
    `${what}: expected ${status}, got ${res.status} ${JSON.stringify(res.data).slice(0, 160)}`,
  )

const rowsOf = (data) => (Array.isArray(data) ? data : data?.items || data?.rows || [])

// Fetches a contact-form captcha and answers it the way a person would.
const solvedCaptcha = async () => {
  const { data } = await call('GET', '/captcha')
  const [a, b] = data.question.match(/\d+/g).map(Number)
  return { captchaToken: data.token, captchaAnswer: a + b }
}

// ── Public reads ────────────────────────────────────────────────────────────
await check('GET /health', async () => {
  const r = await call('GET', '/health')
  expect(r, 200, 'health')
  assert.equal(r.data.ok, true)
})

for (const path of ['packages', 'destinations', 'visas', 'testimonials', 'faqs', 'services']) {
  await check(`GET /${path} returns rows`, async () => {
    const r = await call('GET', `/${path}`)
    expect(r, 200, path)
    assert.ok(Array.isArray(r.data), `${path} did not return an array`)
    assert.ok(r.data.length > 0, `${path} is empty — the site would render blank sections`)
  })
}

await check('GET /settings has the contact fields the site renders', async () => {
  const r = await call('GET', '/settings')
  expect(r, 200, 'settings')
  for (const k of ['name', 'phone', 'email', 'address', 'socials'])
    assert.ok(r.data[k], `settings.${k} is missing`)
  assert.ok(Array.isArray(r.data.socials), 'settings.socials is not an array')
})

await check('GET /packages/:slug resolves a real package', async () => {
  const list = (await call('GET', '/packages')).data
  const r = await call('GET', `/packages/${encodeURIComponent(list[0].slug)}`)
  expect(r, 200, 'package by slug')
  assert.equal(r.data.slug, list[0].slug)
})

await check('GET /packages/:slug 404s on an unknown slug', async () => {
  expect(await call('GET', '/packages/no-such-package-xyz'), 404, 'unknown slug')
})

await check('GET /reviews/google responds', async () => {
  const r = await call('GET', '/reviews/google')
  assert.ok([200, 204].includes(r.status), `got ${r.status}`)
})

// ── Auth ────────────────────────────────────────────────────────────────────
await check('POST /auth/login rejects a bad password', async () => {
  const r = await call('POST', '/auth/login', {
    email: process.env.ADMIN_EMAIL,
    password: 'definitely-wrong',
  })
  expect(r, 401, 'bad password')
})

await check('POST /auth/login issues a token', async () => {
  const r = await call('POST', '/auth/login', {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  })
  expect(r, 200, 'login')
  assert.ok(r.data.token, 'no token in the login response')
  token = r.data.token
})

await check('GET /auth/me needs a token', async () => {
  expect(await call('GET', '/auth/me'), 401, 'me without token')
  expect(await call('GET', '/auth/me', undefined, { auth: true }), 200, 'me with token')
})

await check('admin routes are closed without a token', async () => {
  for (const p of ['/admin/dashboard', '/admin/packages', '/admin/settings', '/admin/leads'])
    expect(await call('GET', p), 401, `unauthenticated ${p}`)
})

// ── Admin: dashboard + settings ─────────────────────────────────────────────
await check('GET /admin/dashboard', async () => {
  const r = await call('GET', '/admin/dashboard', undefined, { auth: true })
  expect(r, 200, 'dashboard')
  assert.ok(r.data && typeof r.data === 'object', 'dashboard returned nothing')
})

await check('PUT /admin/settings round-trips without changing anything', async () => {
  const before = (await call('GET', '/admin/settings', undefined, { auth: true })).data
  expect(await call('PUT', '/admin/settings', before, { auth: true }), 200, 'settings update')
  const after = (await call('GET', '/admin/settings', undefined, { auth: true })).data
  assert.equal(after.phone, before.phone, 'settings phone changed on a no-op write')
  assert.equal(after.email, before.email, 'settings email changed on a no-op write')
})

// ── Admin: CRUD round trip per resource ─────────────────────────────────────
const stamp = Date.now()
const fixtures = {
  packages: {
    create: {
      slug: `zz-test-${stamp}`,
      name: 'ZZ Test Package',
      country: 'Testland',
      region: 'Test',
      city: 'Testville',
      price: 1234,
      published: false,
      tags: ['a', 'b'],
      itinerary: [{ day: 1, title: 'Arrive' }],
    },
    patch: { name: 'ZZ Test Package (edited)' },
    field: 'name',
  },
  destinations: {
    create: {
      name: `ZZ Test Dest ${stamp}`,
      blurb: 'test blurb',
      image: 'https://example.com/x.jpg',
      priceFrom: 999,
      published: false,
    },
    patch: { blurb: 'edited blurb' },
    field: 'blurb',
  },
  visas: {
    create: {
      country: `ZZ Testland ${stamp}`,
      type: 'Tourist',
      processing: '1 day',
      published: false,
      documentsRequired: ['Passport'],
    },
    patch: { processing: '2 days' },
    field: 'processing',
  },
  testimonials: {
    create: { name: `ZZ Tester ${stamp}`, quote: 'test quote', published: false },
    patch: { quote: 'edited quote' },
    field: 'quote',
  },
  faqs: {
    create: { question: `ZZ test question ${stamp}?`, answer: 'test answer', published: false },
    patch: { answer: 'edited answer' },
    field: 'answer',
  },
  services: {
    create: { title: `ZZ Test Service ${stamp}`, description: 'test description', published: false },
    patch: { description: 'edited description' },
    field: 'description',
  },
}

for (const [path, fx] of Object.entries(fixtures)) {
  await check(`admin CRUD /${path}`, async () => {
    const created = await call('POST', `/admin/${path}`, fx.create, { auth: true })
    assert.ok(
      [200, 201].includes(created.status),
      `create: got ${created.status} ${JSON.stringify(created.data).slice(0, 200)}`,
    )
    const id = created.data.id
    assert.ok(id, 'create returned no id')
    try {
      const list = await call('GET', `/admin/${path}`, undefined, { auth: true })
      expect(list, 200, 'list')
      assert.ok(
        rowsOf(list.data).some((r) => r.id === id),
        'the new row is missing from the admin list',
      )

      const one = await call('GET', `/admin/${path}/${id}`, undefined, { auth: true })
      expect(one, 200, 'getById')
      assert.equal(one.data.id, id)

      const updated = await call('PUT', `/admin/${path}/${id}`, { ...fx.create, ...fx.patch }, { auth: true })
      expect(updated, 200, 'update')
      assert.equal(updated.data[fx.field], fx.patch[fx.field], 'the update did not persist')

      // Unpublished rows must not leak onto the public site.
      const pub = await call('GET', `/${path}`)
      assert.ok(
        !rowsOf(pub.data).some((r) => r.id === id),
        `an unpublished ${path} row is visible on the public endpoint`,
      )
    } finally {
      const del = await call('DELETE', `/admin/${path}/${id}`, undefined, { auth: true })
      assert.ok([200, 204].includes(del.status), `delete: got ${del.status}`)
      expect(
        await call('GET', `/admin/${path}/${id}`, undefined, { auth: true }),
        404,
        'row still readable after delete',
      )
    }
  })
}

await check('admin create rejects a payload missing required fields', async () => {
  expect(
    await call('POST', '/admin/faqs', { question: 'no answer given' }, { auth: true }),
    400,
    'missing required field',
  )
})

// ── Public forms land in the admin inboxes ──────────────────────────────────
await check('POST /contact creates a lead the admin can read, patch and delete', async () => {
  const email = `zz-test-${stamp}@example.com`
  const r = await call('POST', '/contact', {
    name: 'ZZ Test Contact',
    email,
    phone: '+971500000000',
    adults: '2',
    children: '3',
    message: 'automated test message',
    ...(await solvedCaptcha()),
  })
  assert.ok(
    [200, 201].includes(r.status),
    `contact post got ${r.status} ${JSON.stringify(r.data).slice(0, 200)}`,
  )
  const leads = await call('GET', '/admin/leads', undefined, { auth: true })
  expect(leads, 200, 'leads list')
  const mine = rowsOf(leads.data).find((l) => l.email === email)
  assert.ok(mine, 'the submitted enquiry never reached the admin leads list')
  try {
    assert.deepEqual([mine.adults, mine.children], [2, 3], 'adults/children were not stored')
    expect(await call('PATCH', `/admin/leads/${mine.id}`, { status: 'read' }, { auth: true }), 200, 'lead status patch')
    expect(
      await call('PATCH', `/admin/leads/${mine.id}`, { status: 'nonsense' }, { auth: true }),
      400,
      'invalid lead status',
    )
  } finally {
    const del = await call('DELETE', `/admin/leads/${mine.id}`, undefined, { auth: true })
    assert.ok([200, 204].includes(del.status), `lead delete got ${del.status}`)
  }
})

await check('POST /bookings creates a booking the admin can read, patch and delete', async () => {
  const email = `zz-booking-${stamp}@example.com`
  const r = await call('POST', '/bookings', {
    name: 'ZZ Test Booking',
    email,
    phone: '+971500000001',
    packageName: 'ZZ Test',
    travellers: 2,
  })
  assert.ok(
    [200, 201].includes(r.status),
    `booking post got ${r.status} ${JSON.stringify(r.data).slice(0, 200)}`,
  )
  const list = await call('GET', '/admin/bookings', undefined, { auth: true })
  expect(list, 200, 'bookings list')
  const mine = rowsOf(list.data).find((b) => b.email === email)
  assert.ok(mine, 'the booking never reached the admin bookings list')
  try {
    expect(
      await call('PATCH', `/admin/bookings/${mine.id}`, { status: 'confirmed' }, { auth: true }),
      200,
      'booking status patch',
    )
    expect(
      await call('PATCH', `/admin/bookings/${mine.id}`, { status: 'nonsense' }, { auth: true }),
      400,
      'invalid booking status',
    )
  } finally {
    const del = await call('DELETE', `/admin/bookings/${mine.id}`, undefined, { auth: true })
    assert.ok([200, 204].includes(del.status), `booking delete got ${del.status}`)
  }
})

await check('POST /subscribe stores an email the admin can read and delete', async () => {
  const email = `zz-sub-${stamp}@example.com`
  const r = await call('POST', '/subscribe', { email })
  assert.ok([200, 201].includes(r.status), `subscribe got ${r.status}`)
  const list = await call('GET', '/admin/subscribers', undefined, { auth: true })
  expect(list, 200, 'subscribers list')
  const mine = rowsOf(list.data).find((s) => s.email === email)
  assert.ok(mine, 'the subscriber was not stored')
  try {
    expect(await call('POST', '/subscribe', { email: 'not-an-email' }), 400, 'invalid subscriber email')
  } finally {
    const del = await call('DELETE', `/admin/subscribers/${mine.id}`, undefined, { auth: true })
    assert.ok([200, 204].includes(del.status), `subscriber delete got ${del.status}`)
  }
})

await check('POST /contact rejects an incomplete submission', async () => {
  expect(await call('POST', '/contact', { name: 'only a name' }), 400, 'incomplete contact form')
})

await check('POST /contact rejects a wrong or missing captcha and bad passenger counts', async () => {
  const base = { name: 'ZZ', email: 'zz@example.com', phone: '+971500000003', message: 'x' }
  const { captchaToken, captchaAnswer } = await solvedCaptcha()
  expect(await call('POST', '/contact', { ...base, phone: ' ', captchaToken, captchaAnswer }), 400, 'blank contact number')
  expect(await call('POST', '/contact', base), 400, 'missing captcha')
  expect(await call('POST', '/contact', { ...base, captchaToken, captchaAnswer: captchaAnswer + 1 }), 400, 'wrong captcha')
  expect(await call('POST', '/contact', { ...base, captchaToken: `1.${captchaToken.split('.')[1]}`, captchaAnswer }), 400, 'tampered expiry')
  expect(await call('POST', '/contact', { ...base, captchaToken, captchaAnswer, adults: 0 }), 400, 'zero adults')
  expect(await call('POST', '/contact', { ...base, captchaToken, captchaAnswer, children: 1.5 }), 400, 'fractional children')
})

// ── Admin image upload ──────────────────────────────────────────────────────
await check('POST /admin/upload accepts an image', async () => {
  // Smallest valid PNG (1x1, transparent).
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64',
  )
  const form = new FormData()
  form.append('image', new Blob([png], { type: 'image/png' }), 'zz-test.png')
  const res = await fetch(`${base}/admin/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })
  const data = await res.json().catch(() => ({}))
  assert.ok(
    [200, 201].includes(res.status),
    `upload got ${res.status} ${JSON.stringify(data).slice(0, 200)}`,
  )
  assert.ok(data.url, 'upload returned no url')
})

// ── Report ──────────────────────────────────────────────────────────────────
console.log(results.join('\n'))
console.log(`\nAPI: ${pass} passed, ${failures.length} failed`)
server.close()
await db.$disconnect()
if (failures.length) {
  console.error('\nFailures:\n' + failures.map((f) => '  - ' + f).join('\n'))
  process.exit(1)
}
