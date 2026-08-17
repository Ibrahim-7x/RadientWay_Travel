import { motion } from 'framer-motion'
import { Compass, Globe2, HeartHandshake, Sparkles } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import SmartImage from '../components/ui/SmartImage'
import Counter from '../components/ui/Counter'
import AnimatedButton from '../components/ui/AnimatedButton'
import { img } from '../data/packages'
import { fadeUp, fromRight, stagger, viewportOnce } from '../lib/motion'
import { useContent } from '../context/ContentContext'

const values = [
  { icon: HeartHandshake, title: 'Personal', text: 'A real human consultant who knows your name and your trip.' },
  { icon: Globe2, title: 'Worldly', text: 'Deep destination knowledge across 40+ countries.' },
  { icon: Sparkles, title: 'Meticulous', text: 'Every transfer, hotel and detail checked and double-checked.' },
  { icon: Compass, title: 'Honest', text: 'Transparent pricing and advice that always puts you first.' },
]

export default function About() {
  const { company, stats } = useContent()
  return (
    <>
      <PageHero
        title="About RadiantWay"
        subtitle="Effortless journeys, lasting memories — crafted by a team that lives and breathes travel."
        image={img('1436491865332-7a61a109cc05', 1920)}
        crumb="About"
      />

      {/* Story */}
      <section className="py-16 sm:py-24">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <motion.div variants={fromRight} initial="hidden" whileInView="show" viewport={viewportOnce} className="relative h-[440px]">
            <div className="absolute left-0 top-0 h-72 w-64 overflow-hidden rounded-3xl shadow-navy">
              <SmartImage src={img('1488646953014-85cb44e25828')} alt="Travellers" label="Journeys" className="h-full w-full" />
            </div>
            <div className="absolute bottom-0 right-0 h-64 w-56 overflow-hidden rounded-3xl shadow-navy ring-4 ring-cream">
              <SmartImage src={img('1469854523086-cc02fe5d8800')} alt="Roads" label="Adventures" className="h-full w-full" />
            </div>
          </motion.div>

          <div>
            <SectionHeading
              align="left"
              eyebrow="Our story"
              title="Travel, the way it should feel"
              subtitle={company.intro}
            />
            <p className="mt-5 leading-relaxed text-navy-600">
              Based in the heart of Dubai on Sheikh Zayed Road, RadiantWay Travel was built on a simple
              belief: booking a holiday should feel as good as the holiday itself. We take on the
              logistics — flights, hotels, transfers, sightseeing and visas — so your only job is to
              make memories.
            </p>
            <p className="mt-4 leading-relaxed text-navy-600">
              From weekend city breaks to spiritual Umrah journeys and once-in-a-lifetime honeymoons,
              we design each trip around you, with flexible quad-sharing options and installment plans
              that make premium travel genuinely accessible.
            </p>
            <AnimatedButton to="/tours" showArrow className="mt-8">
              See our packages
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-navy-950 py-14">
        <div className="container-x grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-4xl font-bold text-gradient-gold">
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
              </div>
              <p className="mt-1 text-sm text-navy-200">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container-x">
          <SectionHeading eyebrow="What we stand for" title="The values behind every journey" />
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((v) => (
              <motion.div key={v.title} variants={fadeUp} className="rounded-3xl bg-white p-7 text-center shadow-card ring-1 ring-navy-950/5">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-gradient text-gold-400">
                  <v.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-lg font-semibold text-navy-950">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{v.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
