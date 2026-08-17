// Creates the admin account and nothing else.
//
// This used to mirror src/data/* into the database — packages, visas,
// destinations, testimonials, FAQs, services, company settings — so a fresh
// deployment came up looking like the static site. The live site starts empty
// instead and gets its content entered through /admin, so all of that is gone.
// The frontend still falls back to its bundled content wherever the API
// returns nothing, so an empty database is not a blank site.
//
// Only the admin user is created here: without it there is no way to log in
// and add anything. It is idempotent — an existing account is left alone.

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth.js'
import { requireSecrets } from '../src/lib/env.js'

const prisma = new PrismaClient()

async function main() {
  const email = (process.env.ADMIN_EMAIL || 'admin@radiantwaytravel.com').toLowerCase()
  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    console.log(`\n  · admin user already exists (${email})\n`)
    return
  }
  // The compose stack runs this on every start, so in production a fallback
  // password would silently publish the admin account.
  requireSecrets(['ADMIN_PASSWORD'])
  const passwordHash = await hashPassword(process.env.ADMIN_PASSWORD || 'ChangeMe123!')
  await prisma.adminUser.create({
    data: { email, passwordHash, name: process.env.ADMIN_NAME || 'RadiantWay Admin', role: 'admin' },
  })
  console.log(`\n  ✓ created admin user: ${email}\n`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
