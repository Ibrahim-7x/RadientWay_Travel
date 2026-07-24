import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { useContent } from '../../context/ContentContext'
import { getIcon } from '../../lib/icons'
import { stagger, viewportOnce } from '../../lib/motion'

export default function ServiceLines() {
  const { services } = useContent()
  return (
    <section className="relative py-24 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="What we do"
          title="Everything your journey needs, in one place"
          subtitle="From the first spark of an idea to your safe return home, we handle every detail so you can simply enjoy the ride."
        />

        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => {
            const Icon = getIcon(service.icon)
            return (
              <motion.div
                key={service.title}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border border-navy-950/5 bg-white p-7 shadow-card transition-shadow duration-500 hover:shadow-card-hover"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gold-100 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-gradient text-gold-400 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="relative mb-2 font-display text-xl font-semibold text-navy-950">
                  {service.title}
                </h3>
                <p className="relative text-sm leading-relaxed text-navy-500">
                  {service.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
