# RadiantWay Travel — Frontend

A fully animated travel website for **RadiantWay Travel** — _Effortless Journeys. Lasting Memories._

Built with **React + Vite**, **Tailwind CSS**, **Framer Motion**, and **Lenis** smooth scroll.
Modeled on the structure of greenappletourism.com, populated with RadiantWay content, and styled
with a premium **Radiant Gold + Deep Navy** identity.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build to /dist
npm run preview  # preview the production build
```

## What's inside

- **Home** — animated hero (rotating destinations + word-reveal headline), count-up stats,
  service grid, 3D-tilt destination cards, featured tours, parallax "why us", visa flags,
  testimonial slider, animated CTA + newsletter.
- **Tour Packages** — filterable / sortable grid with animated layout transitions.
- **Tour Detail** — hero, quick facts, highlights, day-by-day itinerary timeline, sticky booking card.
- **Visa Services** — visa cards + 4-step process.
- **About**, **Contact** (animated enquiry form + map — all enquiries land here), **404**.

Global: Lenis smooth scroll, top scroll-progress bar, page transitions, WhatsApp FAB,
`prefers-reduced-motion` support, fully responsive.

## Structure

```
src/
  data/         # helpers only — img/srcset, packagePath, WhatsApp + tel links, nav links
  components/
    layout/     # Navbar, Footer, ScrollProgress, WhatsAppFab, Logo
    ui/         # reusable animated primitives (Reveal, Counter, Card3D, TourCard, ...)
    sections/   # Home page sections
  pages/        # routed pages
  hooks/        # useParallax
  lib/          # motion variants, icon map
server/
  prisma/
    schema.prisma              # MySQL data model
    seed.js                    # admin account + demo content
    seed-data.js               # the demo content itself
    seed-data.sql              # same rows as SQL, for phpMyAdmin
    radiantway_mysql_schema.sql # tables only, for phpMyAdmin
```

## Seeding

All site content comes from the database. `src/data` holds no content — an empty database
means an empty site.

**Local / Docker.** Needs `DATABASE_URL` pointing at a MySQL database with the tables already
created, and `ADMIN_PASSWORD` set:

```bash
npm run seed          # admin account + all demo content
```

It is idempotent per table: a table that already has rows is skipped, so it will not duplicate
or overwrite anything entered through `/admin`. To reseed one table, empty it first.

**Hostinger.** The Prisma engine cannot reliably start there, so load the database by SQL
import through phpMyAdmin instead, in this order:

1. `server/prisma/radiantway_mysql_schema.sql` — tables, no rows
2. `server/prisma/seed-data.sql` — the demo content
3. an `INSERT` for the admin account (its password must be bcrypt-hashed, so it is not in the
   SQL; generate one with `bcrypt.hash(password, 10)`)

Both files are generated from the schema and `seed-data.js`, so they cannot drift from what the
app expects. Regenerate the content one with `npm run seed:sql` after editing `seed-data.js`.

## Notes

- Content lives in the database. `seed-data.js` is the initial copy of it, not the live source:
  editing it changes nothing until an empty table is reseeded.
- There is no bundled fallback. If the API is unreachable the sections render empty rather than
  showing stale demo content.
- Imagery is hotlinked from Unsplash; `SmartImage` shows a branded gradient fallback if an image
  fails to load.
