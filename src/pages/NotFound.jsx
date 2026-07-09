import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import AnimatedButton from '../components/ui/AnimatedButton'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-navy-gradient text-center text-white">
      <div className="pointer-events-none absolute inset-0 bg-radiant-glow opacity-40" />
      <div className="container-x relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-gold-400 ring-1 ring-white/20"
        >
          <Compass className="h-10 w-10" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-7xl font-bold text-gradient-gold sm:text-8xl"
        >
          404
        </motion.h1>
        <p className="mt-4 text-lg text-navy-100">
          Looks like this route wandered off the map.
        </p>
        <AnimatedButton to="/" showArrow className="mt-8">
          Back to home
        </AnimatedButton>
      </div>
    </section>
  )
}
