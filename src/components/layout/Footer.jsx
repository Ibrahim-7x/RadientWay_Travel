import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react'
import { navLinks } from '../../data/navigation'
import { getIcon } from '../../lib/icons'
import Logo from './Logo'
import { useContent } from '../../context/ContentContext'

const serviceLinks = [
  { label: 'Tour Packages', to: '/tours' },
  { label: 'Visa Services', to: '/visa' },
  { label: 'Umrah Packages', to: '/umrah' },
  { label: 'Dubai Activities', to: '/tours/dubai-city-experience' },
]

export default function Footer() {
  const { company } = useContent()
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-navy-100">
      <div className="pointer-events-none absolute inset-0 bg-radiant-glow opacity-30" />
      <div className="container-x relative py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link to="/" className="flex items-center">
              <Logo className="h-16 w-auto" markColor="#E0A82E" travelColor="#ffffff" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-navy-200">
              {company.intro}
            </p>
            <div className="flex gap-3">
              {(company.socials || []).map((s) => {
                const Icon = getIcon(s.icon)
                return (
                  <motion.a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    whileHover={{ y: -4, scale: 1.1 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-gold-400 hover:text-gold-400"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
              Explore
            </h4>
            <ul className="flex flex-col gap-3 text-sm">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="link-underline text-navy-200 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
              Services
            </h4>
            <ul className="flex flex-col gap-3 text-sm">
              {serviceLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="link-underline text-navy-200 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
              Get in Touch
            </h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li>
                <a href={company.phoneHref} className="flex items-start gap-3 text-navy-200 hover:text-white">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  {company.phone}
                </a>
              </li>
              <li>
                <a href={company.emailHref} className="flex items-start gap-3 text-navy-200 hover:text-white">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-navy-200">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                {company.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-navy-300 sm:flex-row">
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <p className="max-w-md text-center sm:text-right">
            Visa issuance is at the sole discretion of the respective authorities. RadiantWay Travel
            assists with applications but cannot guarantee approval.
          </p>
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-gold-gradient text-navy-950 shadow-gold transition-transform hover:-translate-y-1"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  )
}
