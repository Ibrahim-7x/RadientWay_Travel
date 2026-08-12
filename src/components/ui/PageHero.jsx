import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { wordContainer, wordChild } from '../../lib/motion'
import { imgSrcSet } from '../../data/packages'

// Inner-page banner with a background image, gradient overlay and breadcrumb.
export default function PageHero({ title, subtitle, image, crumb }) {
  return (
    // svh rather than vh: on mobile, vh is measured against the viewport with
    // browser chrome hidden, so the banner resizes as the URL bar collapses.
    <section className="relative flex min-h-[52svh] items-end overflow-hidden bg-navy-950 pb-14 pt-32">
      <img
        src={image}
        srcSet={imgSrcSet(image)}
        sizes="100vw"
        alt=""
        loading="eager"
        fetchpriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full animate-kenburns object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/40" />

      <div className="container-x relative z-10">
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-1.5 text-sm text-navy-200"
        >
          <Link to="/" className="hover:text-gold-400">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gold-400">{crumb || title}</span>
        </motion.nav>

        <motion.h1
          variants={wordContainer}
          initial="hidden"
          animate="show"
          className="max-w-3xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl"
        >
          {title.split(' ').map((word, i) => (
            <span key={i} className="mr-2.5 inline-block overflow-hidden pb-1 align-bottom">
              <motion.span variants={wordChild} className="inline-block">
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 max-w-xl text-lg text-navy-100"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}
