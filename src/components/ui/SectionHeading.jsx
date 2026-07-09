import { motion } from 'framer-motion'
import { fadeUp, stagger, viewportOnce } from '../../lib/motion'

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
}) {
  const alignment =
    align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
  return (
    <motion.div
      variants={stagger(0.12)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={`flex max-w-2xl flex-col gap-4 ${alignment}`}
    >
      {eyebrow && (
        <motion.span variants={fadeUp} className="eyebrow">
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        variants={fadeUp}
        className={`text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem] ${
          light ? 'text-white' : 'text-navy-950'
        }`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className={`text-base leading-relaxed sm:text-lg ${
            light ? 'text-navy-100' : 'text-navy-600'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
