import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

// Static data doubles as the instant first-paint value AND an offline fallback:
// if the API is unreachable, the site still renders the seeded content.
import { packages as staticPackages, isUmrahPackage } from '../data/packages'
import { destinations as staticDestinations } from '../data/destinations'
import { visas as staticVisas } from '../data/visas'
import { testimonials as staticTestimonials } from '../data/testimonials'
import { faqs as staticFaqs } from '../data/faqs'
import { services as staticServices, whyChooseUs as staticWhy } from '../data/services'
import { company as staticCompany, stats as staticStats } from '../data/company'

const ContentContext = createContext(null)

// ── Normalisers: map API rows onto the shapes the components already expect ──
const normFaqs = (rows) => rows.map((f) => ({ q: f.question, a: f.answer, id: f.id }))
const normDestinations = (rows) => rows.map((d) => ({ ...d, slug: d.packageSlug || '' }))

export function ContentProvider({ children }) {
  const [packages, setPackages] = useState(staticPackages)
  const [destinations, setDestinations] = useState(staticDestinations)
  const [visas, setVisas] = useState(staticVisas)
  const [testimonials, setTestimonials] = useState(staticTestimonials)
  const [faqs, setFaqs] = useState(staticFaqs)
  const [services, setServices] = useState(staticServices)
  const [whyChooseUs, setWhyChooseUs] = useState(staticWhy)
  const [company, setCompany] = useState(staticCompany)
  const [stats, setStats] = useState(staticStats)
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
        if (pkgs?.length) setPackages(pkgs)
        if (dests) setDestinations(normDestinations(dests))
        if (vs?.length) setVisas(vs)
        if (tst?.length) setTestimonials(tst)
        if (fq?.length) setFaqs(normFaqs(fq))
        if (svc?.length) {
          setServices(svc.filter((s) => s.group !== 'why'))
          setWhyChooseUs(svc.filter((s) => s.group === 'why'))
        }
        if (settings && Object.keys(settings).length) {
          setCompany((c) => ({ ...c, ...settings }))
          if (settings.stats) setStats(settings.stats)
        }
      } catch {
        // Keep the static fallback — the site still works offline.
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
