// Single-process production entry point.
//
// Hostinger's Node hosting boots one file and expects it to serve everything,
// so this runs the Express API and the built frontend in the same process:
// /api and /uploads hit the API, everything else is served from dist/ with a
// SPA fallback. The Docker stack in this repo does it differently — nginx
// serves dist/ and proxies /api to server/src/index.js — and both entry points
// share the same createApp(), so behaviour cannot drift between them.
//
// Requires `npm run build` first: that produces dist/ and generates the Prisma
// client against server/prisma/schema.prisma.

import 'dotenv/config'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { requireSecrets } from './server/src/lib/env.js'
import { createApp } from './server/src/app.js'
import prisma from './server/src/prisma.js'

// Refuse to boot on a published secret. See server/src/lib/env.js.
requireSecrets(['JWT_SECRET'])

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, 'dist')
const SCHEMA = path.join(__dirname, 'server', 'prisma', 'schema.prisma')
const PORT = Number(process.env.PORT) || 3000

if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error(`\n  No build found at ${DIST}. Run "npm run build" first.\n`)
  process.exit(1)
}

// Child processes are launched as `node <script>` rather than through the npm
// or npx wrappers. Those are .cmd shims on Windows, and since the fix for
// CVE-2024-27980 Node refuses to spawn a .cmd without shell:true — which is
// itself deprecated for passing arguments (DEP0190). Calling the JS entry point
// with process.execPath sidesteps both and needs no shell on any platform.
const PRISMA_CLI = path.join(__dirname, 'node_modules', 'prisma', 'build', 'index.js')
const SEED = path.join(__dirname, 'server', 'prisma', 'seed.js')

function prismaCli(args, { fatal }) {
  try {
    if (!existsSync(PRISMA_CLI)) throw new Error(`prisma CLI not found at ${PRISMA_CLI}`)
    execFileSync(process.execPath, [PRISMA_CLI, ...args, '--schema', SCHEMA], {
      stdio: 'inherit',
      env: process.env,
    })
    return true
  } catch (err) {
    const line = `prisma ${args.join(' ')} failed: ${err.message}`
    if (fatal) {
      console.error(`\n  ${line}\n`)
      process.exit(1)
    }
    console.warn(`\n  ${line}\n  Continuing — the public site does not depend on it.\n`)
    return false
  }
}

// Schema first: without it every query fails, so a failure here is fatal.
prismaCli(['migrate', 'deploy'], { fatal: true })

// Seeding is not. It is idempotent and only fills an empty database, and it
// exits non-zero when ADMIN_PASSWORD is still a published default. A marketing
// site should not go down because the admin account is misconfigured — the
// frontend falls back to its bundled content when the API returns nothing.
try {
  execFileSync(process.execPath, [SEED], { stdio: 'inherit', env: process.env })
} catch {
  console.warn('\n  Seed skipped or failed — check ADMIN_PASSWORD. Site still starting.\n')
}

const app = createApp({ staticDir: DIST })

const server = app.listen(PORT, () => {
  console.log(`\n  RadiantWay listening on port ${PORT}`)
  console.log(`  Frontend: dist/   API: /api   Health: /api/health\n`)
})

const shutdown = async () => {
  await prisma.$disconnect()
  server.close(() => process.exit(0))
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
