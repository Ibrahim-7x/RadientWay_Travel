import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import SmartImage from '../ui/SmartImage'
import Counter from '../ui/Counter'
import { useContent } from '../../context/ContentContext'
import { getIcon } from '../../lib/icons'
import { useParallax } from '../../hooks/useParallax'
import { img } from '../../data/packages'
import { stagger, fadeUp, viewportOnce } from '../../lib/motion'

export default function WhyChooseUs() {
  const { whyChooseUs } = useContent()
  const { ref, y } = useParallax(50)

  return (
    <section className="relative overflow-hidden bg-navy-gradient py-24 text-white sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-radiant-glow opacity-40" />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
        {/* Image collage */}
        <div ref={ref} className="relative order-last h-[460px] lg:order-first">
          <motion.div
            style={{ y }}
            className="absolute left-0 top-0 h-72 w-56 overflow-hidden rounded-3xl shadow-navy ring-4 ring-white/10 sm:w-64"
          >
            <SmartImage src={img('1520250497591-112f2f40a3f4')} alt="Happy travellers" label="Adventure" className="h-full w-full" />
          </motion.div>
          <motion.div
            style={{ y: y }}
            className="absolute bottom-0 right-0 h-64 w-52 overflow-hidden rounded-3xl shadow-navy ring-4 ring-white/10 sm:w-60"
          >
            <SmartImage src={img('1488646953014-85cb44e25828')} alt="Explore the world" label="Explore" className="h-full w-full" />
          </motion.div>
          {/* Floating stat card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 16 }}
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/10 px-6 py-5 text-center backdrop-blur-md ring-1 ring-white/20"
          >
            <div className="font-display text-4xl font-bold text-gold-400">
              <Counter value={50} suffix="k+" />
            </div>
            <p className="text-xs font-medium text-navy-100">Happy travellers</p>
          </motion.div>
        </div>

        {/* Content */}
        <div>
          <SectionHeading
            align="left"
            light
            eyebrow="Why RadiantWay"
            title="Travel with people who genuinely care"
            subtitle="We are not a faceless booking engine. We are a team of travel lovers obsessed with getting every detail right for you."
          />

          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-10 grid gap-5 sm:grid-cols-2"
          >
            {whyChooseUs.map((item) => {
              const Icon = getIcon(item.icon)
              return (
                <motion.div key={item.title} variants={fadeUp} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-400 ring-1 ring-white/15">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-semibold text-white">{item.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-navy-200">{item.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
