import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import TourCard from '../components/ui/TourCard'
import { img } from '../data/packages'
import { useContent } from '../context/ContentContext'
import { easeOutExpo } from '../lib/motion'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'duration', label: 'Duration' },
]

export default function TourPackages() {
  // Umrah packages are deliberately excluded — they have their own /umrah page.
  const { tourPackages, regions } = useContent()
  const [params] = useSearchParams()
  const regionParam = params.get('region')
  const [region, setRegion] = useState(regionParam || 'All')
  const [sort, setSort] = useState('featured')

  // The navbar's Tour Packages dropdown links here as /tours?region=Europe, so
  // the filter follows the URL. Re-checked when regions arrive from the API,
  // since an unknown region would otherwise filter everything out.
  useEffect(() => {
    if (!regionParam) return
    setRegion(regions.includes(regionParam) ? regionParam : 'All')
  }, [regionParam, regions])

  const filtered = useMemo(() => {
    let list = tourPackages.filter((p) => region === 'All' || p.region === region)
    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price)
        break
      case 'duration':
        list = [...list].sort((a, b) => b.nights - a.nights)
        break
      default:
        list = [...list].sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1))
    }
    return list
  }, [region, sort, tourPackages])

  return (
    <>
      <PageHero
        title="Tour Packages"
        subtitle="Handcrafted getaways with hotels, transfers and sightseeing — one transparent price, zero hassle."
        image={img('1476514525535-07fb3b4ae5f1', 1920)}
        crumb="Tour Packages"
      />

      <section className="py-16 sm:py-20">
        <div className="container-x">
          {/* Filters */}
          <div className="mb-10 flex flex-col gap-5 rounded-3xl bg-white p-5 shadow-card ring-1 ring-navy-950/5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    region === r
                      ? 'bg-navy-950 text-white shadow-navy'
                      : 'bg-sand text-navy-700 hover:bg-gold-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-navy-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-navy-950/10 bg-cream px-4 py-2 text-sm font-medium text-navy-800 outline-none focus:border-gold-400"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="mb-6 text-sm text-navy-500">
            Showing <span className="font-semibold text-navy-900">{filtered.length}</span> packages
          </p>

          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((pkg, i) => (
                <motion.div
                  key={pkg.slug}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: easeOutExpo, delay: (i % 3) * 0.05 }}
                >
                  <TourCard pkg={pkg} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </>
  )
}
