import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * A card that tilts in 3D toward the cursor. Falls back to a flat card
 * on touch devices (pointer events simply won't fire hover math).
 */
export default function Card3D({ children, className = '', intensity = 10 }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 180, damping: 18 })
  const mouseY = useSpring(y, { stiffness: 180, damping: 18 })

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity])

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={`perspective ${className}`}
    >
      {children}
    </motion.div>
  )
}
