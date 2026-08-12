import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, MoonStar, Stamp, BedDouble, HeartHandshake } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import TourCard from '../components/ui/TourCard'
import SectionHeading from '../components/ui/SectionHeading'
import AnimatedButton from '../components/ui/AnimatedButton'
import { img } from '../data/packages'
import { useContent } from '../context/ContentContext'
import { easeOutExpo, fadeUp, stagger, viewportOnce } from '../lib/motion'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'duration', label: 'Duration' },
]

// Assurances that apply to every Umrah journey we operate.
const assurances = [
  { icon: Stamp, title: 'Umrah visa handled', detail: 'Complete application and documentation, start to finish.' },
  { icon: BedDouble, title: 'Hotels near the Haram', detail: 'Walking distance in both Makkah and Madinah.' },
  { icon: MoonStar, title: 'Guided Ziyarat', detail: 'Visits to the holy sites with knowledgeable guides.' },
  { icon: HeartHandshake, title: 'Group & family plans', detail: 'Quad, triple or twin sharing with installment options.' },
]

export default function UmrahPackages() {
  const { umrahPackages } = useContent()
  const [sort, setSort] = useState('featured')

  const sorted = useMemo(() => {
    const list = [...umrahPackages]
    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price)
      case 'duration':
        return list.sort((a, b) => b.nights - a.nights)
      default:
        return list.sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1))
    }
  }, [sort, umrahPackages])

  return (
    <>
      <PageHero
        title="Umrah Packages"
        subtitle="Spiritually focused journeys to Makkah and Madinah — visa, hotels near the Haram, transfers and Ziyarat, faultlessly organised."
        image={img('1591604129939-f1efa4d9f7fa', 1920)}
        crumb="Umrah"
      />

      <section className="py-16 sm:py-20">
        <div className="container-x">
          {/* Sort bar */}
          <div className="mb-10 flex flex-col gap-5 rounded-3xl bg-white p-5 shadow-card ring-1 ring-navy-950/5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-navy-500">
              Showing <span className="font-semibold text-navy-900">{sorted.length}</span>{' '}
              {sorted.length === 1 ? 'Umrah package' : 'Umrah packages'}
            </p>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-navy-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-navy-950/10 bg-cream px-4 py-2 text-sm font-medium text-navy-800 outline-none focus:border-gold-400"
                aria-label="Sort Umrah packages"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {sorted.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {sorted.map((pkg, i) => (
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
          ) : (
            <div className="rounded-3xl bg-white p-12 text-center shadow-card ring-1 ring-navy-950/5">
              <MoonStar className="mx-auto h-10 w-10 text-gold-500" />
              <h2 className="mt-4 font-display text-2xl font-semibold text-navy-950">
                New Umrah dates coming soon
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-navy-500">
                Tell us your preferred travel window and group size, and we’ll put together an
                Umrah itinerary for you.
              </p>
              <AnimatedButton to="/contact?enquiry=Umrah%20package" showArrow className="mt-7">
                Request an Umrah quote
              </AnimatedButton>
            </div>
          )}
        </div>
      </section>

      {/* What every journey includes */}
      <section className="bg-sand py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Peace of mind"
            title="What every Umrah journey includes"
            subtitle="Whichever package you choose, the essentials are arranged before you travel."
            align="center"
          />
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {assurances.map(({ icon: Icon, title, detail }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy-950/5 sm:p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-gradient text-navy-950">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-navy-950">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-500">{detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
