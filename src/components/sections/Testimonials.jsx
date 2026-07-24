import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import StarRating from '../ui/StarRating'
import { useContent } from '../../context/ContentContext'
import { company } from '../../data/company'

export default function Testimonials() {
  const { testimonials } = useContent()
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)

  const go = useCallback(
    (next) => {
      setDir(next > index || (index === testimonials.length - 1 && next === 0) ? 1 : -1)
      setIndex((next + testimonials.length) % testimonials.length)
    },
    [index],
  )

  useEffect(() => {
    const id = setInterval(() => go((index + 1) % testimonials.length), 6000)
    return () => clearInterval(id)
  }, [index, go])

  const t = testimonials[index] || testimonials[0]
  if (!t) return null

  return (
    <section className="relative overflow-hidden bg-navy-950 py-24 text-white sm:py-28">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="container-x relative">
        <SectionHeading
          light
          eyebrow="Loved by travellers"
          title="Stories from the road"
          subtitle="Rated 5.0 across 640+ reviews — here is what our travellers say."
        />

        <div className="relative mx-auto mt-14 max-w-3xl">
          <Quote className="mx-auto mb-6 h-12 w-12 text-gold-400/70" />
          <div className="relative min-h-[220px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.blockquote
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center"
              >
                <p className="font-display text-xl font-medium leading-relaxed text-navy-50 sm:text-2xl">
                  “{t.quote}”
                </p>
                <div className="mt-7 flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient font-display text-xl font-bold text-navy-950">
                    {t.name.charAt(0)}
                  </div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-gold-400">{t.trip}</p>
                  <StarRating value={t.rating} />
                </div>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => go(index - 1)}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === index ? 'w-8 bg-gold-400' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => go(index + 1)}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-10 text-center">
            <a
              href={company.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex items-center gap-2 text-sm font-semibold text-gold-400"
            >
              Loved your trip? Leave us a review
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
