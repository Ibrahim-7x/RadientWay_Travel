import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle2 } from 'lucide-react'
import AnimatedButton from '../ui/AnimatedButton'
import GradientBlob from '../ui/GradientBlob'
import { company } from '../../data/company'
import { fadeUp, stagger, viewportOnce } from '../../lib/motion'

export default function CtaBanner() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!email) return
    // Client-only stub — wired to Express backend later.
    setSent(true)
    setEmail('')
    setTimeout(() => setSent(false), 3500)
  }

  return (
    <section className="relative py-24 sm:py-28">
      <div className="container-x">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="relative overflow-hidden rounded-[2.5rem] bg-navy-gradient px-7 py-16 text-center shadow-navy sm:px-16"
        >
          <GradientBlob className="-left-10 -top-10 h-64 w-64" color="gold" />
          <GradientBlob className="-bottom-16 -right-10 h-72 w-72" color="gold" />

          <motion.span variants={fadeUp} className="eyebrow border-gold-400/40 bg-white/5 text-gold-300">
            Ready when you are
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mx-auto mt-5 max-w-2xl font-display text-3xl font-semibold leading-tight text-white sm:text-5xl"
          >
            Let’s plan your next <span className="text-gradient-gold">extraordinary</span> journey
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-xl text-navy-100">
            Tell us where you dream of going. We’ll craft the itinerary, sort the visas and handle
            every detail — you just pack your bags.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <AnimatedButton to="/book" showArrow>
              Start planning
            </AnimatedButton>
            <AnimatedButton href={company.phoneHref} variant="outline">
              Call {company.phone}
            </AnimatedButton>
          </motion.div>

          {/* Newsletter */}
          <motion.form
            variants={fadeUp}
            onSubmit={submit}
            className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for travel deals"
                className="w-full rounded-full border border-white/15 bg-white/10 px-5 py-3.5 text-sm text-white placeholder:text-navy-200 outline-none transition-all focus:border-gold-400 focus:bg-white/15"
              />
            </div>
            <button
              type="submit"
              className="btn-gold shrink-0"
              aria-label="Subscribe"
            >
              {sent ? <CheckCircle2 className="h-5 w-5" /> : <Send className="h-4 w-4" />}
              {sent ? 'Subscribed!' : 'Subscribe'}
            </button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}
