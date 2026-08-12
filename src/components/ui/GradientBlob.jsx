import { motion } from 'framer-motion'

/**
 * Softly drifting gradient blobs used as animated section backgrounds.
 */
export default function GradientBlob({ className = '', color = 'gold' }) {
  const fill =
    color === 'gold'
      ? 'from-gold-400/40 to-gold-600/10'
      : 'from-navy-400/30 to-navy-700/10'
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute rounded-full bg-gradient-to-br blur-3xl ${fill} ${className}`}
      // Translation only. Animating scale alongside blur-3xl forced the browser
      // to re-rasterise a 64px blur every frame, forever — the single most
      // expensive thing on the page on a mid-range phone. A pure translate stays
      // on the compositor and the drift reads the same behind that much blur.
      animate={{
        x: [0, 30, 0],
        y: [0, -20, 0],
      }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
