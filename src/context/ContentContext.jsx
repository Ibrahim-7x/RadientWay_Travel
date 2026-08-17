import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

import { isUmrahPackage } from '../data/packages'

// Every list starts empty and is filled from the API. The site used to ship a
// copy of its own content in the bundle and render that until the API replied
// (and whenever the database was empty), which meant demo packages appeared on
// the live site with no way to remove them. The content now lives only in the
// database — `npm run seed`, or server/prisma/seed-data.sql, puts it there.
//
// `loading` distinguishes "not fetched yet" from "genuinely empty" for
// components that render a skeleton.

const ContentContext = createContext(null)

// ── Normalisers: map API rows onto the shapes the components already expect ──
const normFaqs = (rows) => rows.map((f) => ({ q: f.question, a: f.answer, id: f.id }))
const normDestinations = (rows) => rows.map((d) => ({ ...d, slug: d.packageSlug || '' }))

export function ContentProvider({ children }) {
  const [packages, setPackages] = useState([])
  const [destinations, setDestinations] = useState([])
  const [visas, setVisas] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [faqs, setFaqs] = useState([])
  const [services, setServices] = useState([])
  const [whyChooseUs, setWhyChooseUs] = useState([])
  // Contact chrome — phone, address, socials — read by the navbar, footer and
  // every WhatsApp button. Empty until the settings call lands; components
  // reach for optional fields, so they render without it.
  const [company, setCompany] = useState({})
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [pkgs, dests, vs, tst, fq, svc, settings] = await Promise.all([
          api.get('/packages', { auth: false }),
          api.get('/destinations', { auth: false }),
          api.get('/visas', { auth: false }),
          api.get('/testimonials', { auth: false }),
          api.get('/faqs', { auth: false }),
          api.get('/services', { auth: false }),
          api.get('/settings', { auth: false }),
        ])
        if (!alive) return
        // The database is the only source, so a reply is taken as-is — empty
        // included. An empty table means an empty section.
        if (pkgs) setPackages(pkgs)
        if (dests) setDestinations(normDestinations(dests))
        if (vs) setVisas(vs)
        if (tst) setTestimonials(tst)
        if (fq) setFaqs(normFaqs(fq))
        if (svc) {
          setServices(svc.filter((s) => s.group !== 'why'))
          setWhyChooseUs(svc.filter((s) => s.group === 'why'))
        }
        if (settings && Object.keys(settings).length) {
          setCompany((c) => ({ ...c, ...settings }))
          if (settings.stats) setStats(settings.stats)
        }
      } catch {
        // Nothing to fall back to. Leave the lists empty and let `loading`
        // drop — the sections render as empty rather than spinning forever.
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const value = useMemo(() => {
    // Split by category: /tours shows everything except Umrah, /umrah the rest.
    const umrahPackages = packages.filter(isUmrahPackage)
    const tourPackages = packages.filter((p) => !isUmrahPackage(p))
    const featuredPackages = tourPackages.filter((p) => p.featured)
    const regions = ['All', ...Array.from(new Set(tourPackages.map((p) => p.region)))]
    const getPackageBySlug = (slug) => packages.find((p) => p.slug === slug)
    return {
      loading,
      packages, tourPackages, umrahPackages, featuredPackages, regions, getPackageBySlug,
      destinations, visas, testimonials, faqs, services, whyChooseUs,
      company, stats,
    }
  }, [loading, packages, destinations, visas, testimonials, faqs, services, whyChooseUs, company, stats])

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export const useContent = () => {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within <ContentProvider>')
  return ctx
}
