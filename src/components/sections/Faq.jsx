import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MessageCircle } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import AnimatedButton from '../ui/AnimatedButton'
import { faqs } from '../../data/faqs'
import { company } from '../../data/company'
import { stagger, fadeUp, viewportOnce } from '../../lib/motion'

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section className="relative py-24 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Good to know"
          title="Frequently asked questions"
          subtitle="Everything you might want to ask before you book — and if we missed something, just message us."
        />

        <div className="mx-auto mt-14 grid max-w-5xl gap-10 lg:grid-cols-[1.6fr_1fr]">
          {/* Accordion */}
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="flex flex-col gap-3"
          >
            {faqs.map((item, i) => {
              const isOpen = open === i
              return (
                <motion.div
                  key={item.q}
                  variants={fadeUp}
                  className={`overflow-hidden rounded-2xl border transition-colors ${
                    isOpen ? 'border-gold-300 bg-white shadow-card' : 'border-navy-950/10 bg-white'
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-lg font-semibold text-navy-950">
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isOpen ? 'bg-gold-gradient text-navy-950' : 'bg-sand text-navy-700'
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-navy-500">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Help card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="relative flex h-fit flex-col items-start gap-4 overflow-hidden rounded-3xl bg-navy-gradient p-8 text-white"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold-500/20 blur-2xl" />
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-gold-400 ring-1 ring-white/15">
              <MessageCircle className="h-6 w-6" />
            </span>
            <h3 className="font-display text-2xl font-semibold">Still have a question?</h3>
            <p className="text-sm leading-relaxed text-navy-100">
              Our travel consultants reply within a few hours, any time of day. Reach out and we’ll
              help you plan every detail.
            </p>
            <AnimatedButton href={company.whatsapp} className="mt-2">
              Chat on WhatsApp
            </AnimatedButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
