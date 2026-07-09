import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Moon, Users, Star, Check, Phone, ArrowLeft, Building2,
} from 'lucide-react'
import { getPackageBySlug } from '../data/packages'
import { company } from '../data/company'
import SmartImage from '../components/ui/SmartImage'
import AnimatedButton from '../components/ui/AnimatedButton'
import StarRating from '../components/ui/StarRating'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'

export default function TourDetail() {
  const { slug } = useParams()
  const pkg = getPackageBySlug(slug)

  if (!pkg) return <Navigate to="/tours" replace />

  const facts = [
    { icon: Moon, label: 'Duration', value: `${pkg.nights} Nights / ${pkg.days} Days` },
    { icon: Users, label: 'Occupancy', value: pkg.occupancy },
    { icon: Building2, label: 'Hotel', value: `${pkg.hotelStars}★ Standard` },
    { icon: MapPin, label: 'Location', value: `${pkg.city}, ${pkg.country}` },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-navy-950 pb-14 pt-32">
        <img src={pkg.image} alt={pkg.name} className="absolute inset-0 h-full w-full animate-kenburns object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/30" />

        <div className="container-x relative z-10">
          <Link to="/tours" className="mb-5 inline-flex items-center gap-2 text-sm text-navy-100 hover:text-gold-400">
            <ArrowLeft className="h-4 w-4" /> Back to all packages
          </Link>
          <div className="flex flex-wrap gap-2">
            {pkg.tags?.map((t) => (
              <span key={t} className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-900">
                {t}
              </span>
            ))}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 max-w-3xl font-display text-4xl font-semibold text-white sm:text-6xl"
          >
            {pkg.name}
          </motion.h1>
          <p className="mt-3 max-w-xl text-lg text-navy-100">{pkg.tagline}</p>
          <div className="mt-4 flex items-center gap-3 text-white">
            <StarRating value={pkg.rating} />
            <span className="text-sm text-navy-100">{pkg.rating} rating</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-3">
          {/* Main column */}
          <div className="lg:col-span-2">
            {/* Quick facts */}
            <motion.div
              variants={stagger(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {facts.map((f) => (
                <motion.div key={f.label} variants={fadeUp} className="rounded-2xl bg-white p-4 text-center shadow-card ring-1 ring-navy-950/5">
                  <f.icon className="mx-auto mb-2 h-6 w-6 text-gold-600" />
                  <p className="text-[11px] uppercase tracking-wide text-navy-400">{f.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-navy-950">{f.value}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Highlights */}
            <div className="mt-12">
              <h2 className="font-display text-2xl font-semibold text-navy-950">Trip highlights</h2>
              <motion.div
                variants={stagger(0.06)}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className="mt-5 grid gap-3 sm:grid-cols-2"
              >
                {pkg.highlights.map((h) => (
                  <motion.div key={h} variants={fadeUp} className="flex items-center gap-3 rounded-xl bg-sand px-4 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-navy-950">
                      <Star className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-navy-800">{h}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Itinerary timeline */}
            <div className="mt-12">
              <h2 className="font-display text-2xl font-semibold text-navy-950">Day-by-day itinerary</h2>
              <div className="relative mt-6 border-l-2 border-dashed border-gold-300 pl-8">
                {pkg.itinerary.map((day, i) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="relative mb-9 last:mb-0"
                  >
                    <span className="absolute -left-[42px] flex h-8 w-8 items-center justify-center rounded-full bg-navy-950 text-xs font-bold text-gold-400 ring-4 ring-cream">
                      {day.day}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-navy-950">{day.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-navy-500">{day.detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div className="mt-12">
              <h2 className="font-display text-2xl font-semibold text-navy-950">What’s included</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {pkg.includes.map((inc) => (
                  <div key={inc} className="flex items-center gap-3 text-sm text-navy-700">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <Check className="h-4 w-4" />
                    </span>
                    {inc}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky booking card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 rounded-3xl bg-white p-7 shadow-card-hover ring-1 ring-navy-950/5">
              <p className="text-sm text-navy-400">Starting from</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="font-display text-4xl font-bold text-navy-950">
                  {pkg.currency} {pkg.price.toLocaleString()}
                </span>
                <span className="mb-1 text-sm text-navy-400">/ person</span>
              </div>
              <p className="mt-1 text-xs text-navy-400">{pkg.occupancy} · installment plans available</p>

              <div className="my-6 h-px bg-navy-950/10" />

              <ul className="space-y-3 text-sm text-navy-600">
                {pkg.includes.map((inc) => (
                  <li key={inc} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-gold-600" /> {inc}
                  </li>
                ))}
              </ul>

              <AnimatedButton to="/book" showArrow className="mt-7 w-full">
                Book this package
              </AnimatedButton>
              <a
                href={company.whatsapp}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-navy-950/10 py-3 text-sm font-semibold text-navy-900 transition-colors hover:border-gold-400 hover:text-gold-700"
              >
                <Phone className="h-4 w-4" /> Enquire on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
