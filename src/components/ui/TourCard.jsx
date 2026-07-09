import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Moon, Star, ArrowUpRight } from 'lucide-react'
import SmartImage from './SmartImage'

export default function TourCard({ pkg }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
      }}
      className="group h-full"
    >
      <Link
        to={`/tours/${pkg.slug}`}
        className="card-surface flex h-full flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-card-hover"
      >
        <div className="relative h-56 overflow-hidden">
          <SmartImage
            src={pkg.image}
            alt={pkg.name}
            label={pkg.country}
            className="h-full w-full"
            imgClassName="transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />

          {/* Tags */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {pkg.tags?.slice(0, 2).map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy-900 backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Price badge */}
          <div className="absolute bottom-4 right-4 rounded-2xl bg-gold-gradient px-4 py-2 text-navy-950 shadow-gold">
            <span className="block text-[10px] font-semibold uppercase leading-none opacity-80">From</span>
            <span className="text-lg font-bold leading-tight">
              {pkg.currency} {pkg.price.toLocaleString()}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-1 text-sm font-medium text-white">
            <MapPin className="h-4 w-4 text-gold-400" />
            {pkg.city}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-gold-600">
              <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
              <span className="font-semibold">{pkg.rating}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-navy-500">
              <Moon className="h-4 w-4" />
              {pkg.nights}N / {pkg.days}D
            </div>
          </div>

          <h3 className="font-display text-xl font-semibold text-navy-950 transition-colors group-hover:text-gold-700">
            {pkg.name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-navy-500">{pkg.tagline}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {pkg.includes?.slice(0, 3).map((inc) => (
              <span
                key={inc}
                className="rounded-full bg-sand px-2.5 py-1 text-[11px] font-medium text-navy-700"
              >
                {inc}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-navy-950">
            View details
            <ArrowUpRight className="h-4 w-4 text-gold-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
