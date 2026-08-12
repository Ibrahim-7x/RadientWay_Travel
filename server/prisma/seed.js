import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth.js'

// Import the existing frontend content so the DB starts as a faithful mirror
// of the static site. These modules are plain data (no React), so Node can
// import them directly.
import { packages } from '../../src/data/packages.js'
import { destinations } from '../../src/data/destinations.js'
import { visas } from '../../src/data/visas.js'
import { testimonials } from '../../src/data/testimonials.js'
import { faqs } from '../../src/data/faqs.js'
import { services, whyChooseUs } from '../../src/data/services.js'
import { company, stats } from '../../src/data/company.js'

const prisma = new PrismaClient()
const J = (v) => JSON.stringify(v ?? [])

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@radiantwaytravel.com').toLowerCase()
  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    console.log(`  · admin user already exists (${email})`)
    return
  }
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

  // Company settings (always refreshed to match the latest source data).
  const value = JSON.stringify({ ...company, stats })
  await prisma.setting.upsert({
    where: { key: 'company' },
    update: { value },
    create: { key: 'company', value },
  })
  console.log('  ✓ company settings')

  console.log('\nDone.\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
