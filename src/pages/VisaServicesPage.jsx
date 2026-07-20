import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, FileCheck, Info, MessageCircle } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import AnimatedButton from '../components/ui/AnimatedButton'
import VisaDetailModal from '../components/ui/VisaDetailModal'
import { visas, visaSteps } from '../data/visas'
import { waLink } from '../data/company'
import { img } from '../data/packages'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'

export default function VisaServicesPage() {
  const [selected, setSelected] = useState(null)

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
              <motion.div
                key={v.country}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="group rounded-3xl bg-white p-7 shadow-card ring-1 ring-navy-950/5 transition-shadow hover:shadow-card-hover"
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
                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelected(v)}
                    className="group/btn inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-navy-950/15 bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition-all duration-300 hover:border-gold-400 hover:bg-gold-50 hover:-translate-y-0.5"
                  >
                    <Info className="h-4 w-4 text-gold-600 transition-transform duration-300 group-hover/btn:scale-110" />
                    Details
                  </button>
                  <AnimatedButton to="/contact" variant="navy" className="flex-1" showArrow>
                    Enquire
                  </AnimatedButton>
                  <a
                    href={waLink(`Hi RadiantWay, I'd like help with a ${v.country} visa (${v.type}).`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Chat about ${v.country} visa on WhatsApp`}
                    title="Chat on WhatsApp"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform duration-300 hover:scale-110"
                  >
                    <MessageCircle className="h-5 w-5" />
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

      <VisaDetailModal visa={selected} onClose={() => setSelected(null)} />
    </>
  )
}
