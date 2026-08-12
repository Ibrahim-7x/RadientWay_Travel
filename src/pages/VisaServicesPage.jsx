import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, FileCheck, Info, Phone } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import AnimatedButton from '../components/ui/AnimatedButton'
import WhatsAppIcon from '../components/ui/WhatsAppIcon'
import VisaDetailModal from '../components/ui/VisaDetailModal'
import { visaSteps } from '../data/visas'
import { telHref, waLinkFor } from '../data/company'
import { img } from '../data/packages'
import { useContent } from '../context/ContentContext'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'

export default function VisaServicesPage() {
  const { visas, company } = useContent()
  const [selected, setSelected] = useState(null)
  const [params, setParams] = useSearchParams()
  const countryParam = params.get('country')

  // Visa enquiries go to the Visa Services line — same number the navbar lists,
  // editable in Admin → Settings.
  const callHref = telHref(company.visaPhone || company.phone)

  // The navbar's Visa Services dropdown deep-links a country (/visa?country=Turkey);
  // open that card's detail modal. Runs again when visas arrive from the API.
  useEffect(() => {
    if (!countryParam) return
    const match = visas.find(
      (v) => v.country.toLowerCase() === countryParam.toLowerCase(),
    )
    if (match) setSelected(match)
  }, [countryParam, visas])

  // Clearing the param on close means the same country can be picked again, and
  // stops the effect above from re-opening the modal.
  const closeDetail = () => {
    setSelected(null)
    if (countryParam) {
      const next = new URLSearchParams(params)
      next.delete('country')
      setParams(next, { replace: true })
    }
  }

  return (
    <>
      <PageHero
        title="Visa Services"
        subtitle="Honest, end-to-end visa support for the world's most sought-after destinations."
        image={img('1521295121783-8a321d551ad2', 1920)}
        crumb="Visa Services"
      />

      {/* Visa grid */}
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Where can we take you?"
            title="Visas we handle"
            subtitle="We guide you through documents, forms and appointments for each of these destinations."
          />
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visas.map((v) => (
              // The whole card opens the detail modal; the contact buttons inside
              // stop propagation so they don't trigger it too. The "View details"
              // row below stays a real <button> so keyboard users get a control.
              <motion.div
                key={v.country}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                onClick={() => setSelected(v)}
                className="group cursor-pointer rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy-950/5 transition-shadow hover:shadow-card-hover sm:p-7"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl transition-transform duration-300 group-hover:scale-110">{v.flag}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-navy-950">{v.country}</h3>
                    <p className="text-sm text-navy-500">{v.type}</p>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 text-sm text-navy-600">
                  <Clock className="h-4 w-4 text-gold-600" /> Processing: {v.processing}
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-navy-600">
                  <FileCheck className="h-4 w-4 text-gold-600" /> {v.note}
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(v)}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-navy-950 transition-colors hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
                >
                  <Info className="h-4 w-4 text-gold-600" />
                  View details
                  <ArrowRight className="h-3.5 w-3.5 text-gold-600 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <div className="mt-5 flex items-center gap-2.5">
                  <AnimatedButton
                    href={callHref}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 px-4"
                    aria-label={`Call us about a ${v.country} visa`}
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </AnimatedButton>
                  <AnimatedButton
                    to="/contact"
                    variant="navy"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 px-4"
                  >
                    Enquire
                  </AnimatedButton>
                  <a
                    href={waLinkFor(
                      company,
                      `Hi ${company.shortName || company.name}, I'd like help with a ${v.country} visa (${v.type}).`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Chat about ${v.country} visa on WhatsApp`}
                    title="Chat on WhatsApp"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform duration-300 hover:scale-110"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="relative overflow-hidden bg-navy-gradient py-20 text-white">
        <div className="pointer-events-none absolute inset-0 bg-radiant-glow opacity-40" />
        <div className="container-x relative">
          <SectionHeading light eyebrow="How it works" title="Four simple steps to your visa" />
          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {visaSteps.map((s) => (
              <motion.div key={s.step} variants={fadeUp} className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <span className="font-display text-5xl font-bold text-gold-400/40">{s.step}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-200">{s.detail}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-12 flex justify-center">
            <AnimatedButton to="/contact" showArrow>
              Start your application <ArrowRight className="h-4 w-4" />
            </AnimatedButton>
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-navy-300">
            Visa issuance is at the sole discretion of the respective authorities. RadiantWay Travel
            assists with applications but cannot guarantee approval.
          </p>
        </div>
      </section>

      <VisaDetailModal visa={selected} onClose={closeDetail} />
    </>
  )
}
