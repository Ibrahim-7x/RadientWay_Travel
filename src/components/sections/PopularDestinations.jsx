import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Phone, MessageCircle } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import WhatsAppIcon from '../ui/WhatsAppIcon'
import Card3D from '../ui/Card3D'
import SmartImage from '../ui/SmartImage'
import { useContent } from '../../context/ContentContext'
import { telHref, waCallLink } from '../../data/company'
import { stagger, viewportOnce } from '../../lib/motion'

export default function PopularDestinations() {
  const { destinations, company } = useContent()

  // A package enquiry belongs to the Holidays & Tours line; both it and the
  // WhatsApp number come from Admin → Settings.
  const callHref = telHref(company.holidaysPhone || company.phone)
  return (
    <section className="relative overflow-hidden bg-sand py-24 sm:py-28">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Popular destinations"
            title="Handpicked places our travellers love"
            subtitle="Six of our most-booked getaways — each one crafted for unforgettable moments and effortless travel."
          />
          <Link
            to="/tours"
            className="link-underline hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-navy-950 md:flex"
          >
            View all packages <ArrowUpRight className="h-4 w-4 text-gold-600" />
          </Link>
        </div>

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {destinations.map((d) => (
            <motion.div
              key={d.name}
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <Card3D className="h-full">
                <div className="relative h-full" style={{ transform: 'translateZ(0)' }}>
                  <Link
                    to={`/tours/${d.slug}`}
                    className="group relative block h-80 overflow-hidden rounded-3xl shadow-navy"
                  >
                    <SmartImage
                      src={d.image}
                      alt={d.name}
                      label={d.name}
                      className="absolute inset-0 h-full w-full"
                      imgClassName="transition-transform duration-[900ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-6" style={{ transform: 'translateZ(40px)' }}>
                      <span className="mb-2 inline-block rounded-full bg-gold-gradient px-3 py-1 text-xs font-semibold text-navy-950">
                        From {d.priceFrom.toLocaleString()} AED
                      </span>
                      <h3 className="font-display text-2xl font-semibold text-white">{d.name}</h3>
                      <p className="mt-1 flex items-center justify-between text-sm text-navy-100">
                        {d.blurb}
                        <ArrowUpRight className="h-5 w-5 translate-y-2 text-gold-400 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
                      </p>
                    </div>
                  </Link>

                  {/* Contact shortcuts sit above the card link so a tap here
                      doesn't navigate to the package page. */}
                  <div
                    className="absolute right-4 top-4 z-10 flex items-center gap-2"
                    style={{ transform: 'translateZ(60px)' }}
                  >
                    <a
                      href={waCallLink(company, `the ${d.name} package`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Request a WhatsApp call about ${d.name}`}
                      title="Request a WhatsApp call"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow-navy transition-all duration-300 hover:scale-105 hover:bg-[#1EBE5A]"
                    >
                      <WhatsAppIcon className="h-[18px] w-[18px]" />
                    </a>
                    <a
                      href={callHref}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Call us about ${d.name}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gold-gradient px-4 py-2.5 text-xs font-semibold text-navy-950 shadow-navy transition-transform duration-300 hover:scale-105"
                    >
                      <Phone className="h-4 w-4" /> Call
                    </a>
                    {/* Deep-links the contact form with the destination already
                        filled into the message. */}
                    <Link
                      to={`/contact?enquiry=${encodeURIComponent(d.name)}`}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Enquire about ${d.name}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2.5 text-xs font-semibold text-navy-950 shadow-navy backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white"
                    >
                      <MessageCircle className="h-4 w-4 text-gold-600" /> Enquire
                    </Link>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
