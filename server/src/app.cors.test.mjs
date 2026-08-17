// CORS boundary check — run with: node server/src/app.cors.test.mjs
//
// The live site rejected its own admin login ("Origin not allowed by CORS:
// https://radiantwaytravel.com") because PUBLIC_URL was unset. Same-origin must
// pass without configuration; a foreign origin must still be refused.

import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { createApp } from './app.js'

process.env.CLIENT_ORIGIN = 'https://allowed.example'
delete process.env.PUBLIC_URL // the production state that caused the outage

const server = createServer(createApp({ staticDir: null })).listen(0)
await new Promise((r) => server.once('listening', r))
const port = server.address().port
const base = `http://127.0.0.1:${port}`

const post = (origin) =>
  fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin, host: `127.0.0.1:${port}` },
    body: JSON.stringify({ email: 'nobody@example.com', password: 'wrong' }),
  })

// Same-origin: the Origin matches the host being requested. Must not be a CORS
// refusal — 401 for the bad credentials is the correct outcome.
const same = await post(`http://127.0.0.1:${port}`)
assert.notEqual(same.status, 403, 'same-origin request was refused by CORS')
assert.equal(same.status, 401, `expected 401 for bad credentials, got ${same.status}`)

// Explicitly allowlisted origin still works.
const listed = await post('https://allowed.example')
assert.equal(listed.status, 401, `allowlisted origin got ${listed.status}`)

// A genuine third-party origin is still refused.
const foreign = await post('https://evil.example')
assert.equal(foreign.status, 403, `foreign origin got ${foreign.status}, expected 403`)

// No Origin header at all (curl, health checks).
const none = await fetch(`${base}/api/health`)
assert.equal(none.status, 200, `health check got ${none.status}`)

server.close()
console.log('CORS: same-origin allowed, allowlist allowed, foreign refused, no-origin allowed ✓')
