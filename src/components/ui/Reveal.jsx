import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '../../lib/motion'

/**
 * Scroll-reveal wrapper. Animates children into view once.
 * Accepts a custom `variants` object or uses fadeUp by default.
 */
export default function Reveal({
  children,
  variants = fadeUp,
  className = '',
  delay = 0,
  as = 'div',
  amount,
}) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={amount ? { once: true, amount } : viewportOnce}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  )
}
