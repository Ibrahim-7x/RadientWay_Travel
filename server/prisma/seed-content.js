// Syncs the visas and packages in seed-data.js into an existing database.
//
// `npm run seed` skips any table that already holds rows, so it cannot push a
// new visa or a repriced package to a live site. This can, and is safe to
// re-run: a row that already exists is updated in place (keeping its id,
// `order` and published flag), a new one is appended after the highest
// existing order. Nothing is ever deleted — a row the admin added by hand, or
// one this file no longer lists, is left alone.
//
//   cd server && npm run seed:content
//
// The frontend reads the database, so the change is live on the next request.

import 'dotenv/config'
import db from '../src/db.js'
import { packages, visas } from './seed-data.js'

const J = (v) => JSON.stringify(v ?? [])

async function nextOrderFor(table) {
  const [top] = await table.findMany({ orderBy: { order: 'desc' }, take: 1 })
  return (top?.order ?? -1) + 1
}

// Visa.country is not a unique column, so this is findFirst + update rather
// than db.visa.upsert (which builds ON DUPLICATE KEY UPDATE and, with no
// unique index to collide on, would only ever insert).
async function syncVisas() {
  let order = await nextOrderFor(db.visa)
  for (const v of visas) {
    const data = {
      country: v.country,
      flag: v.flag || '',
      type: v.type || '',
      processing: v.processing || '',
      note: v.note || '',
      price: v.price || '',
      about: v.about || '',
      documentsRequired: J(v.documentsRequired),
      documentsProvided: J(v.documentsProvided),
    }
    const existing = await db.visa.findFirst({ where: { country: v.country } })
    if (existing) {
      await db.visa.update({ where: { id: existing.id }, data })
      console.log(`  ↻ visa    ${v.country}`)
    } else {
      await db.visa.create({ data: { ...data, published: true, order: order++ } })
      console.log(`  + visa    ${v.country}`)
    }
  }
}

// Package.slug *is* unique, so one upsert per row does it. `order` and
// `published` are in `create` only: reordering or unpublishing a package in
// /admin must survive the next sync.
async function syncPackages() {
  let order = await nextOrderFor(db.package)
  for (const p of packages) {
    const data = {
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
      image: p.image || '',
      gallery: J(p.gallery),
      tags: J(p.tags),
      includes: J(p.includes),
      highlights: J(p.highlights),
      itinerary: J(p.itinerary),
    }
    const existing = await db.package.findFirst({ where: { slug: p.slug } })
    await db.package.upsert({
      where: { slug: p.slug },
      update: data,
      create: { ...data, slug: p.slug, published: true, order: order++ },
    })
    console.log(`  ${existing ? '↻' : '+'} package ${p.slug}`)
  }
}

async function main() {
  await syncVisas()
  await syncPackages()
  console.log(`\n${visas.length} visas and ${packages.length} packages in sync.\n`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
