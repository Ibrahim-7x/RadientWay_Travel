// Renders seed-data.js as INSERT statements for import through phpMyAdmin.
//
// Same rows the Node seeder writes. It exists because the Prisma engine cannot
// reliably start on the shared host this site runs on (see server.js), so the
// database is loaded by SQL import rather than by `npm run seed`.
//
//   node server/prisma/gen-seed-sql.mjs > server/prisma/seed-data.sql

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

// MySQL treats backslash as an escape character inside string literals, so both
// it and the quote need doubling. Everything here is our own copy, but a stray
// apostrophe in a tagline would otherwise end the statement early.
const q = (v) =>
  v === null || v === undefined
    ? 'NULL'
    : "'" + String(v).replaceAll('\\', '\\\\').replaceAll("'", "''") + "'"

const J = (v) => q(JSON.stringify(v ?? []))
const N = (v, d = 0) => Number(v ?? d)
const B = (v) => (v ? 1 : 0)
const NOW = 'CURRENT_TIMESTAMP(3)'

const rows = (table, cols, list, fn) =>
  `INSERT INTO \`${table}\` (${cols.map((c) => `\`${c}\``).join(', ')}) VALUES\n` +
  list.map((item, i) => `  (${fn(item, i).join(', ')})`).join(',\n') +
  ';\n'

const out = [
  `-- RadiantWay Travel — demo content, generated from server/prisma/seed-data.js.
--
-- Import AFTER radiantway_mysql_schema.sql, into the same database. Every table
-- must be empty: these are plain INSERTs, so running it twice duplicates rows
-- (and fails on Package.slug, which is unique).
--
-- The admin account is deliberately absent — its password has to be hashed, so
-- it comes from \`npm run seed\` or an INSERT you build yourself.
--
-- Regenerate: node server/prisma/gen-seed-sql.mjs > server/prisma/seed-data.sql

SET NAMES utf8mb4;
`,

  rows(
    'Package',
    ['slug', 'name', 'category', 'country', 'region', 'city', 'tagline', 'nights', 'days',
     'occupancy', 'price', 'currency', 'hotelStars', 'rating', 'featured', 'published', 'order',
     'image', 'gallery', 'tags', 'includes', 'highlights', 'itinerary', 'createdAt', 'updatedAt'],
    packages,
    (p, i) => [
      q(p.slug), q(p.name), q(p.category || 'tour'), q(p.country), q(p.region), q(p.city),
      q(p.tagline || ''), N(p.nights), N(p.days), q(p.occupancy || ''), N(p.price),
      q(p.currency || 'AED'), N(p.hotelStars, 4), N(p.rating, 5), B(p.featured), 1, i,
      q(p.image || ''), J(p.gallery), J(p.tags), J(p.includes), J(p.highlights), J(p.itinerary),
      NOW, NOW,
    ],
  ),

  rows(
    'Destination',
    ['name', 'blurb', 'image', 'priceFrom', 'packageSlug', 'published', 'order', 'createdAt', 'updatedAt'],
    destinations,
    (d, i) => [q(d.name), q(d.blurb || ''), q(d.image || ''), N(d.priceFrom),
               d.slug ? q(d.slug) : 'NULL', 1, i, NOW, NOW],
  ),

  rows(
    'Visa',
    ['country', 'flag', 'type', 'processing', 'note', 'price', 'about',
     'documentsRequired', 'documentsProvided', 'published', 'order', 'createdAt', 'updatedAt'],
    visas,
    (v, i) => [q(v.country), q(v.flag || ''), q(v.type || ''), q(v.processing || ''),
               q(v.note || ''), q(v.price || ''), q(v.about || ''),
               J(v.documentsRequired), J(v.documentsProvided), 1, i, NOW, NOW],
  ),

  rows(
    'Testimonial',
    ['name', 'trip', 'rating', 'quote', 'published', 'order', 'createdAt', 'updatedAt'],
    testimonials,
    (t, i) => [q(t.name), q(t.trip || ''), N(t.rating, 5), q(t.quote), 1, i, NOW, NOW],
  ),

  rows(
    'Faq',
    ['question', 'answer', 'published', 'order', 'createdAt', 'updatedAt'],
    faqs,
    (f, i) => [q(f.q), q(f.a), 1, i, NOW, NOW],
  ),

  // Both groups share the Service table; `group` is what splits them between
  // the services strip and the "why choose us" cards.
  rows(
    'Service',
    ['icon', 'title', 'description', 'group', 'published', 'order', 'createdAt', 'updatedAt'],
    [...services.map((s) => ({ ...s, group: 'service' })),
     ...whyChooseUs.map((w) => ({ ...w, group: 'why' }))],
    (s, i) => [q(s.icon), q(s.title), q(s.description), q(s.group), 1, i, NOW, NOW],
  ),

  rows('Setting', ['key', 'value', 'updatedAt'], [null],
    () => [q('company'), q(JSON.stringify({ ...company, stats })), NOW]),
]

console.log(out.join('\n'))
