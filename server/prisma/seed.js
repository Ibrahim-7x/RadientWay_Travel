// Creates the admin account and fills empty tables with the demo content in
// seed-data.js.
//
// Idempotent per table: a table that already holds rows is left alone, so
// running this against a live database will not duplicate or overwrite what
// the admin has entered. To reseed a table, empty it first.
//
// The content itself used to ship inside the frontend bundle; it lives in
// seed-data.js now and reaches the site only by way of the database.
//
// On a host that cannot run this (Hostinger's process cap panics the Prisma
// engine — see server.js), import server/prisma/seed-data.sql through
// phpMyAdmin instead. It is generated from this same data.

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth.js'
import { requireSecrets } from '../src/lib/env.js'

import {
  packages,
  destinations,
  visas,
  testimonials,
  faqs,
  services,
  whyChooseUs,
  company,
  stats,
} from './seed-data.js'

const prisma = new PrismaClient()
const J = (v) => JSON.stringify(v ?? [])

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@radiantwaytravel.com').toLowerCase()
  if (await prisma.adminUser.findUnique({ where: { email } })) {
    console.log(`  · admin user already exists (${email})`)
    return
  }
  // The compose stack runs this on every start, so in production a fallback
  // password would silently publish the admin account.
  requireSecrets(['ADMIN_PASSWORD'])
  const passwordHash = await hashPassword(process.env.ADMIN_PASSWORD || 'ChangeMe123!')
  await prisma.adminUser.create({
    data: { email, passwordHash, name: process.env.ADMIN_NAME || 'RadiantWay Admin', role: 'admin' },
  })
  console.log(`  ✓ created admin user: ${email}`)
}

async function seedIfEmpty(name, count, fn) {
  const n = await count()
  if (n > 0) {
    console.log(`  · ${name} already populated (${n}) — skipping`)
    return
  }
  await fn()
  console.log(`  ✓ seeded ${name}`)
}

async function main() {
  console.log('\nSeeding RadiantWay database…\n')

  await seedAdmin()

  await seedIfEmpty('packages', () => prisma.package.count(), async () => {
    for (const [i, p] of packages.entries()) {
      await prisma.package.create({
        data: {
          slug: p.slug,
          name: p.name,
          category: p.category || 'tour',
          country: p.country,
          region: p.region,
          city: p.city,
          tagline: p.tagline || '',
          nights: p.nights ?? 0,
          days: p.days ?? 0,
          occupancy: p.occupancy || '',
          price: p.price ?? 0,
          currency: p.currency || 'AED',
          hotelStars: p.hotelStars ?? 4,
          rating: p.rating ?? 5,
          featured: !!p.featured,
          published: true,
          order: i,
          image: p.image || '',
          gallery: J(p.gallery),
          tags: J(p.tags),
          includes: J(p.includes),
          highlights: J(p.highlights),
          itinerary: J(p.itinerary),
        },
      })
    }
  })

  await seedIfEmpty('destinations', () => prisma.destination.count(), async () => {
    for (const [i, d] of destinations.entries()) {
      await prisma.destination.create({
        data: {
          name: d.name,
          blurb: d.blurb || '',
          image: d.image || '',
          priceFrom: d.priceFrom ?? 0,
          packageSlug: d.slug || null,
          published: true,
          order: i,
        },
      })
    }
  })

  await seedIfEmpty('visas', () => prisma.visa.count(), async () => {
    for (const [i, v] of visas.entries()) {
      await prisma.visa.create({
        data: {
          country: v.country,
          flag: v.flag || '',
          type: v.type || '',
          processing: v.processing || '',
          note: v.note || '',
          price: v.price || '',
          about: v.about || '',
          documentsRequired: J(v.documentsRequired),
          documentsProvided: J(v.documentsProvided),
          published: true,
          order: i,
        },
      })
    }
  })

  await seedIfEmpty('testimonials', () => prisma.testimonial.count(), async () => {
    for (const [i, t] of testimonials.entries()) {
      await prisma.testimonial.create({
        data: {
          name: t.name,
          trip: t.trip || '',
          rating: t.rating ?? 5,
          quote: t.quote,
          published: true,
          order: i,
        },
      })
    }
  })

  await seedIfEmpty('faqs', () => prisma.faq.count(), async () => {
    for (const [i, f] of faqs.entries()) {
      await prisma.faq.create({
        data: { question: f.q, answer: f.a, published: true, order: i },
      })
    }
  })

  await seedIfEmpty('services', () => prisma.service.count(), async () => {
    for (const [i, s] of services.entries()) {
      await prisma.service.create({
        data: { icon: s.icon, title: s.title, description: s.description, group: 'service', order: i },
      })
    }
    for (const [i, w] of whyChooseUs.entries()) {
      await prisma.service.create({
        data: { icon: w.icon, title: w.title, description: w.description, group: 'why', order: i },
      })
    }
  })

  // Company details are the site's contact chrome — phone numbers, address,
  // socials. Seeded only when absent, so an admin's edits survive a reseed.
  await seedIfEmpty('company settings', () => prisma.setting.count({ where: { key: 'company' } }), async () => {
    await prisma.setting.create({
      data: { key: 'company', value: JSON.stringify({ ...company, stats }) },
    })
  })

  console.log('\nDone.\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
