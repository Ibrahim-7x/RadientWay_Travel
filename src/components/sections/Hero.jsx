import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ChevronDown, Phone } from 'lucide-react'
import AnimatedButton from '../ui/AnimatedButton'
import WhatsAppIcon from '../ui/WhatsAppIcon'
import GoogleRating from '../ui/GoogleRating'
import { telHref, waCallLink } from '../../data/company'
import { useContent } from '../../context/ContentContext'
import { img, imgSrcSet } from '../../data/packages'
import { wordContainer, wordChild } from '../../lib/motion'

const slides = [
  { image: img('1514282401047-d79a71a590e8', 1920), place: 'Maldives' },
  { image: img('1512453979798-5ea266f8880c', 1920), place: 'Dubai' },
  { image: img('1541432901042-2d8bd64b4a9b', 1920), place: 'Istanbul' },
  { image: img('1513326738677-b964603b136d', 1920), place: 'Moscow' },
  { image: img('1585687501004-615dfdfb6f37', 1920), place: 'Armenia' },
]

const headline = ['Effortless', 'Journeys.', 'Lasting', 'Memories.']

export default function Hero() {
  // Company comes from the API (Admin → Settings) with the static data as fallback,
  // so the rating, review count and WhatsApp number stay editable.
  const { company } = useContent()
  const [index, setIndex] = useState(0)

  // wa.me can't dial directly, so the message primes the chat and the caller
  // taps the call icon there.
  const waCallHref = waCallLink(company)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy-950">
      {/* Rotating background */}
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* The first slide is the LCP element: eager + high priority so it
              races ahead of the JS bundle (index.html preloads it too). Decode
              stays async even for it — a sync decode of the 1920w variant would
              block the main thread for tens of ms to win a single frame. */}
          <img
            src={slides[index].image}
            srcSet={imgSrcSet(slides[index].image)}
            sizes="100vw"
            alt={slides[index].place}
            loading="eager"
            fetchpriority={index === 0 ? 'high' : 'low'}
            decoding="async"
            className="h-full w-full origin-center animate-kenburns object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/70 to-navy-950/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/40" />

      <div className="container-x relative z-10 py-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 flex flex-wrap items-center gap-4"
          >
            <span className="eyebrow border-gold-400/40 bg-white/5 text-gold-300">
              ✦ UAE-based · Global reach
            </span>
            {/* Live Google rating — replaces the old static star line that sat
                here, which showed the same numbers a step behind. */}
            <GoogleRating />
          </motion.div>

          {/* Headline with word reveal */}
          <motion.h1
            variants={wordContainer}
            initial="hidden"
            animate="show"
            className="font-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl"
          >
            {/* The tight leading-[1.05] cuts the box off above the glyph descent,
                which both clips the reveal mask and — because text-gradient-gold
                paints via bg-clip-text — leaves the "g" tail in Lasting unfilled.
                Bottom padding in em on the word itself extends the gradient box at
                every breakpoint; the negative margin on the mask takes that extra
                height back out of the line spacing. */}
            {headline.map((word, i) => (
              <span
                key={i}
                className="mr-3 -mb-[0.18em] inline-block overflow-hidden align-bottom"
              >
                <motion.span
                  variants={wordChild}
                  className={`inline-block pb-[0.18em] ${i >= 2 ? 'text-gradient-gold' : ''}`}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100"
          >
            Tailored tour packages, seamless visa assistance and round-the-clock support —
            planned by people who love travel as much as you do.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <AnimatedButton to="/tours" showArrow>
              Explore Packages
            </AnimatedButton>
            {/* Two logo-only circles, both sized to the height of Explore
                Packages. Call is the glass/outline variant so it sits below the
                gold and green in the hierarchy instead of competing with them. */}
            <AnimatedButton
              href={telHref(company.phone)}
              variant="outline"
              className="h-[50px] w-[50px] shrink-0 p-0"
              aria-label={`Call us on ${company.phone}`}
              title={`Call us on ${company.phone}`}
            >
              <Phone className="h-[22px] w-[22px] text-gold-400" />
            </AnimatedButton>
            <AnimatedButton
              href={waCallHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              className="h-[50px] w-[50px] shrink-0 p-0"
              aria-label="Request a WhatsApp call"
              title="Request a WhatsApp call"
            >
              <WhatsAppIcon className="h-6 w-6" />
            </AnimatedButton>
          </motion.div>
        </div>
      </div>

      {/* Current place indicator */}
      <div className="absolute bottom-28 right-8 z-10 hidden items-center gap-2 text-white/90 lg:flex">
        <MapPin className="h-4 w-4 text-gold-400" />
        <AnimatePresence mode="wait">
          <motion.span
            key={slides[index].place}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-display text-lg font-medium"
          >
            {slides[index].place}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-28 left-1/2 z-10 hidden -translate-x-1/2 gap-2 sm:flex">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? 'w-8 bg-gold-400' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1 text-xs uppercase tracking-[0.2em]"
        >
          Scroll
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </section>
  )
}
