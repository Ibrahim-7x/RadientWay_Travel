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
- **About**, **Contact** (animated form + map), **Book Now** (multi-step animated form), **404**.

Global: Lenis smooth scroll, top scroll-progress bar, page transitions, WhatsApp FAB,
`prefers-reduced-motion` support, fully responsive.

## Structure

```
src/
  data/         # all site content (packages, destinations, services, visas, testimonials, company)
  components/
    layout/     # Navbar, Footer, ScrollProgress, WhatsAppFab, Logo
    ui/         # reusable animated primitives (Reveal, Counter, Card3D, TourCard, ...)
    sections/   # Home page sections
  pages/        # routed pages
  hooks/        # useParallax
  lib/          # motion variants, icon map
```

## Notes

- Content lives in `src/data/*` so a future **Express backend** can serve it via an API with
  minimal changes to components.
- Forms (contact, newsletter, booking) are currently client-only stubs — they will be wired to
  the Express backend in the next phase.
- Imagery is hotlinked from Unsplash; `SmartImage` shows a branded gradient fallback if an image
  fails to load.
