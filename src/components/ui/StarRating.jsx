import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function StarRating({ value = 5, size = 16, animate = false }) {
  const stars = Array.from({ length: 5 })
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((_, i) => (
        <motion.span
          key={i}
          initial={animate ? { opacity: 0, scale: 0, rotate: -45 } : false}
          whileInView={animate ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, type: 'spring', stiffness: 260, damping: 14 }}
        >
          <Star
            width={size}
            height={size}
            className={i < Math.round(value) ? 'fill-gold-400 text-gold-400' : 'text-navy-200'}
          />
        </motion.span>
      ))}
    </div>
  )
}
