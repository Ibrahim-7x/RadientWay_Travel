import { useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

// Returns a ref + a motion value that shifts on scroll for a parallax effect.
export function useParallax(distance = 80) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance])
  return { ref, y, scrollYProgress }
}
