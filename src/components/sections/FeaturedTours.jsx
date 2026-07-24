import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import TourCard from '../ui/TourCard'
import AnimatedButton from '../ui/AnimatedButton'
import { useContent } from '../../context/ContentContext'
import { stagger, viewportOnce } from '../../lib/motion'

export default function FeaturedTours() {
  const { featuredPackages } = useContent()
  return (
    <section className="relative py-24 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Featured tours"
          title="Journeys worth booking twice"
          subtitle="Our most-loved packages, with hotels, transfers and sightseeing bundled into one transparent price."
        />

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {featuredPackages.map((pkg) => (
            <TourCard key={pkg.slug} pkg={pkg} />
          ))}
        </motion.div>

        <div className="mt-12 flex justify-center">
          <AnimatedButton to="/tours" variant="navy" showArrow>
            Browse all packages
          </AnimatedButton>
        </div>
      </div>
    </section>
  )
}
