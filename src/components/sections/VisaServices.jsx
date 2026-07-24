import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import AnimatedButton from '../ui/AnimatedButton'
import { useContent } from '../../context/ContentContext'
import { stagger, viewportOnce } from '../../lib/motion'

export default function VisaServices() {
  const { visas } = useContent()
  return (
    <section className="relative overflow-hidden bg-cream py-24 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Visa assistance"
          title="Your visa, handled with care"
          subtitle="Complete, honest support for the world's most-wanted visas — from document prep to appointment booking."
        />

        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {visas.map((v) => (
            <motion.div
              key={v.country}
              variants={{
                hidden: { opacity: 0, y: 24, rotateY: 40 },
                show: { opacity: 1, y: 0, rotateY: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -6 }}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-navy-950/5 bg-white p-5 text-center shadow-card transition-shadow hover:shadow-card-hover"
            >
              <span className="text-4xl transition-transform duration-300 group-hover:scale-125">
                {v.flag}
              </span>
              <span className="text-sm font-semibold text-navy-950">{v.country}</span>
              <span className="text-[11px] text-navy-400">{v.processing}</span>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 flex justify-center">
          <AnimatedButton to="/visa" showArrow>
            Explore visa services
          </AnimatedButton>
        </div>
      </div>
    </section>
  )
}
