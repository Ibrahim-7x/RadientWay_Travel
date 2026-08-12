import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, ArrowRight } from 'lucide-react'
import { navLinks, primaryNavLinks } from '../../data/navigation'
import { telHref, waCallLink } from '../../data/company'
import { packagePath } from '../../data/packages'
import { useContent } from '../../context/ContentContext'
import AnimatedButton from '../ui/AnimatedButton'
import WhatsAppIcon from '../ui/WhatsAppIcon'
import NavDropdown from './NavDropdown'
import Logo from './Logo'

export default function Navbar() {
  const { company, regions, umrahPackages, visas } = useContent()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Submenus for the three catalogue tabs, keyed by the tab's path. Built from
  // the same content the pages use, so anything added in the admin panel shows
  // up here too. The first row is always the section index.
  const submenus = {
    '/tours': [
      { label: 'All tour packages', to: '/tours', muted: true },
      ...regions
        .filter((r) => r !== 'All')
        .map((r) => ({ label: r, to: `/tours?region=${encodeURIComponent(r)}` })),
    ],
    '/umrah': [
      { label: 'All Umrah packages', to: '/umrah', muted: true },
      ...umrahPackages.map((p) => ({ label: p.name, to: packagePath(p) })),
    ],
    '/visa': [
      { label: 'All visa services', to: '/visa', muted: true },
      ...visas.map((v) => ({
        label: `${v.flag ? `${v.flag}  ` : ''}${v.country}`,
        to: `/visa?country=${encodeURIComponent(v.country)}`,
      })),
    ],
  }

  // Department contact numbers, listed in the mobile drawer. The desktop bar
  // shows the single general enquiries number instead.
  const contacts = [
    { label: 'Holidays & Tours', phone: company.holidaysPhone || company.phone },
    { label: 'Visa Services', phone: company.visaPhone || company.phone },
  ]

  // Opens the WhatsApp chat with a call request prefilled — wa.me has no
  // deep link that dials directly, so the caller taps the call icon there.
  const waCallHref = waCallLink(company)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile drawer on navigation. Watches the query string too, since
  // submenu links like /tours?region=Europe don't change the pathname.
  useEffect(() => setOpen(false), [location.pathname, location.search])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-navy-950/10 bg-white/90 py-3 shadow-card backdrop-blur-xl'
            : 'bg-transparent py-5'
        }`}
      >
        {/* Tighter gutter below 360px buys back the room the three contact
            actions need. Written as max-[359px] rather than a min-width
            override: Tailwind emits arbitrary media variants after the named
            sm:/lg: ones, so a min-[360px] rule would also win at desktop and
            collapse the container gutter. A max-width query can't leak up. */}
        <nav className="container-x flex items-center justify-between gap-1.5 max-[359px]:px-3 sm:gap-3">
          <Link to="/" className="flex shrink-0 items-center" aria-label="RadiantWay Travel home">
            <Logo
              className="h-9 w-auto sm:h-12 lg:h-14"
              markColor={scrolled ? '#0B1A2F' : '#E0A82E'}
              travelColor={scrolled ? '#E0A82E' : '#0B1A2F'}
            />
          </Link>

          {/* Four catalogue tabs only — Home is the logo, About sits in the
              drawer and footer. Fewer tabs means room to breathe at lg. */}
          <ul className="hidden items-center gap-7 lg:flex xl:gap-9">
            {primaryNavLinks.map((link) => (
              <li key={link.to}>
                {submenus[link.to] ? (
                  <NavDropdown link={link} items={submenus[link.to]} scrolled={scrolled} />
                ) : (
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `link-underline text-sm font-medium tracking-wide transition-colors ${
                        isActive
                          ? 'text-gold-500'
                          : scrolled
                          ? 'text-navy-700 hover:text-navy-950'
                          : 'text-white/90 hover:text-white'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          {/* The three contact actions never collapse — they stay on the bar at
              every width, and only scale down. Nav links are what move into the
              drawer instead. shrink-0 keeps them at full size so the logo is
              what yields if space runs out. */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 lg:gap-4">
            {/* A single general enquiries number — one short line, so it fits
                even on a phone. The drawer still lists the two department
                lines, where there's room for both. */}
            {/* py-3 is a tap target, not spacing: the label is 11px tall, so
                without it this dials-out link was an 11px-high hit area on a
                phone. The padding stays inside the 36px button row height, so
                the bar doesn't grow. */}
            <a
              href={telHref(company.phone)}
              aria-label={`Call us for enquiries on ${company.phone}`}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap py-3 leading-none transition-colors lg:gap-2 ${
                scrolled ? 'text-navy-800 hover:text-gold-600' : 'text-white/90 hover:text-gold-300'
              }`}
            >
              <Phone className="hidden h-3.5 w-3.5 shrink-0 text-gold-500 sm:block" />
              <span className="hidden text-[10px] font-medium uppercase tracking-wide opacity-60 lg:block">
                Inquiries
              </span>
              <span className="text-[11px] font-semibold max-[359px]:text-[10px] sm:text-xs">
                {company.phone}
              </span>
            </a>

            {/* Logo-only — the label lives in aria-label/title for screen
                readers and hover, matching the height of the Enquire button. */}
            <AnimatedButton
              href={waCallHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              className="h-9 w-9 shrink-0 p-0 sm:h-10 sm:w-10 lg:h-11 lg:w-11"
              aria-label="Request a WhatsApp call"
              title="Request a WhatsApp call"
            >
              <WhatsAppIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </AnimatedButton>

            {/* The arrow is a child rather than showArrow= so it can be dropped
                on narrow screens without losing it on desktop. */}
            <AnimatedButton
              to="/contact"
              className="px-2.5 py-2.5 text-[11px] sm:px-4 sm:text-sm lg:px-5 lg:py-3"
            >
              Enquire
              <ArrowRight className="hidden h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 lg:block" />
            </AnimatedButton>
          </div>

          {/* The drawer trigger is the only way to reach navigation on a phone,
              so it gets a 44px target instead of the 32px the old p-1.5 gave.
              Below 360px the bar genuinely runs out of room — every item here
              is shrink-0 — so it steps down to 40px, which still clears the
              24px WCAG minimum and keeps the button on screen. */}
          <button
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors min-[360px]:h-11 min-[360px]:w-11 lg:hidden ${
              scrolled ? 'text-navy-900' : 'text-white'
            }`}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[70] bg-navy-950/70 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="fixed right-0 top-0 z-[80] flex h-full w-[82%] max-w-sm flex-col bg-navy-950 p-7 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <Logo className="h-11 w-auto" markColor="#E0A82E" travelColor="#ffffff" />
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-white"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* min-h-0 + overflow lets the list scroll once the submenu chips
                  are expanded, keeping the contact footer pinned in place. */}
              <motion.ul
                className="mt-8 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
              >
                {navLinks.map((link) => (
                  <motion.li
                    key={link.to}
                    variants={{
                      hidden: { opacity: 0, x: 30 },
                      show: { opacity: 1, x: 0 },
                    }}
                  >
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `block rounded-xl px-4 py-3 text-lg font-medium transition-colors ${
                          isActive
                            ? 'bg-white/10 text-gold-400'
                            : 'text-white/90 hover:bg-white/5'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>

                    {/* Same submenu as the desktop dropdown, as chips. The "All …"
                        row is dropped since the parent link above already is it. */}
                    {submenus[link.to] && (
                      <div className="mb-1 mt-1 flex flex-wrap gap-2 px-4">
                        {submenus[link.to]
                          .filter((item) => !item.muted)
                          .map((item, i) => (
                            <NavLink
                              key={`${item.to}-${i}`}
                              to={item.to}
                              className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                            >
                              {item.label}
                            </NavLink>
                          ))}
                      </div>
                    )}
                  </motion.li>
                ))}
              </motion.ul>

              {/* Department lines only. WhatsApp and Enquire are permanently on
                  the bar above, so repeating them here would be dead weight. */}
              <div className="mt-auto flex flex-col gap-4 border-t border-white/10 pt-5">
                <div className="flex flex-col gap-3">
                  {contacts.map((c) => (
                    <a
                      key={c.label}
                      href={telHref(c.phone)}
                      className="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold-400">
                        <Phone className="h-4 w-4" />
                      </span>
                      <span className="leading-tight">
                        <span className="block text-[11px] uppercase tracking-wide text-white/50">
                          {c.label}
                        </span>
                        <span className="block text-sm font-medium text-white">{c.phone}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
