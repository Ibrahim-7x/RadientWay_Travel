import { motion } from 'framer-motion'
import Counter from '../ui/Counter'
import { stats } from '../../data/company'
import { stagger, fadeUp, viewportOnce } from '../../lib/motion'

export default function Stats() {
  return (
    <section className="relative z-20 -mt-16">
      <div className="container-x">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-navy-950 shadow-navy ring-1 ring-white/10 md:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="group flex flex-col items-center gap-2 bg-navy-950 px-6 py-9 text-center transition-colors hover:bg-navy-900"
            >
              <div className="font-display text-4xl font-bold text-gradient-gold sm:text-5xl">
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
              </div>
              <p className="text-sm font-medium text-navy-200">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
