import { motion } from 'framer-motion'
import { ArrowRight, Clock, FileCheck } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import AnimatedButton from '../components/ui/AnimatedButton'
import { visas, visaSteps } from '../data/visas'
import { img } from '../data/packages'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'

export default function VisaServicesPage() {
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
                <AnimatedButton to="/contact" variant="navy" className="mt-6 w-full" showArrow>
                  Enquire now
                </AnimatedButton>
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
    </>
  )
}
