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
import { execFile } from 'node:child_process'
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

// Seeding runs AFTER the port is open, never before.
//
// It spawns a second Node process, and a spawn is exactly what this host is
// short of. A synchronous spawn ahead of listen() turned any failure or stall
// there into a site-wide 503: the process was alive but had never bound the
// port, so the proxy had nothing to talk to. Nothing about creating an admin
// account needs to block the marketing site from serving, so it no longer does.
// The timeout is the backstop for a stall; failure is only ever a warning.
//
// It is launched as `node <script>` rather than through the npm or npx
// wrappers. Those are .cmd shims on Windows, and since the fix for
// CVE-2024-27980 Node refuses to spawn a .cmd without shell:true — which is
// itself deprecated for passing arguments (DEP0190). Calling the JS entry
// point with process.execPath sidesteps both and needs no shell on any
// platform.
const SEED = path.join(__dirname, 'server', 'prisma', 'seed.js')

const app = createApp({ staticDir: DIST })

const server = app.listen(PORT, async () => {
  console.log(`\n  RadiantWay listening on port ${PORT}`)
  console.log(`  Frontend: dist/   API: /api   Health: /api/health\n`)

  // Seeding needs the database, so there is nothing to learn from spawning a
  // process that will only fail the same way the check just did.
  if (!(await checkConnection())) return

  execFile(process.execPath, [SEED], { env: process.env, timeout: 60_000 }, (err, stdout) => {
    if (stdout) process.stdout.write(stdout)
    if (err) console.warn(`\n  Seed skipped or failed (${err.message}). Site is up.\n`)
  })
})

const shutdown = async () => {
  await db.$disconnect()
  server.close(() => process.exit(0))
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
