// Single-process production entry point.
//
// Hostinger's Node hosting boots one file and expects it to serve everything,
// so this runs the Express API and the built frontend in the same process:
// /api and /uploads hit the API, everything else is served from dist/ with a
// SPA fallback. The Docker stack in this repo does it differently — nginx
// serves dist/ and proxies /api to server/src/index.js — and both entry points
// share the same createApp(), so behaviour cannot drift between them.
//
// Requires `npm run build` first: that produces dist/.

import 'dotenv/config'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { requireSecrets } from './server/src/lib/env.js'
import { createApp } from './server/src/app.js'
import db, { checkConnection } from './server/src/db.js'

// Refuse to boot on a published secret. See server/src/lib/env.js.
requireSecrets(['JWT_SECRET'])

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, 'dist')
const PORT = Number(process.env.PORT) || 3000

if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error(`\n  No build found at ${DIST}. Run "npm run build" first.\n`)
  process.exit(1)
}

// Migrations do NOT run here.
//
// `prisma migrate deploy` spawns the schema-engine binary, a second heavyweight
// process. Hostinger caps process count, so that spawn failed with EAGAIN on
// every boot and — being fatal — served a 503 for the whole site. It also only
// ever needed to run when the schema changed, which is not on every restart.
//
// Apply schema changes out of band instead: import
// server/prisma/radiantway_mysql_schema.sql through phpMyAdmin. Prisma is a
// build-time tool here now — nothing at runtime loads it (see server/src/db.js).

// Seeding does not run here either. Run `npm run seed` by hand, once, on a new
// database.
//
// It used to run as a child process on every boot. The hosting account caps
// processes, counting every thread — a dozen or so per Node process — across
// all its sites, and Passenger starts several instances and recycles them, so
// those seed children stacked up, hit the cap and 503'd every site on the
// account. All to print "already populated — skipping".

const app = createApp({ staticDir: DIST })

const server = app.listen(PORT, () => {
  console.log(`\n  RadiantWay listening on port ${PORT}`)
  console.log(`  Frontend: dist/   API: /api   Health: /api/health\n`)
  checkConnection()
})

// The server stops first, so requests already in flight finish against an
// open pool; closing the pool first failed them with "Pool is closed". The
// timer is for a keep-alive socket that never closes — it must not keep a
// dead process, and its slots, around.
const shutdown = () => {
  server.close(() => db.$disconnect().finally(() => process.exit(0)))
  setTimeout(() => process.exit(0), 5_000).unref()
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
