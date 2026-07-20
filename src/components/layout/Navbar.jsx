import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'
import { navLinks } from '../../data/navigation'
import { company } from '../../data/company'
import AnimatedButton from '../ui/AnimatedButton'
import Logo from './Logo'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile drawer on navigation.
  useEffect(() => setOpen(false), [location.pathname])

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
        <nav className="container-x flex items-center justify-between">
          <Link to="/" className="flex items-center" aria-label="RadiantWay Travel home">
            <Logo
              className="h-12 w-auto sm:h-14"
              markColor={scrolled ? '#0B1A2F' : '#E0A82E'}
              travelColor={scrolled ? '#E0A82E' : '#0B1A2F'}
            />
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <li key={link.to}>
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
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={company.phoneHref}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                scrolled ? 'text-navy-800 hover:text-gold-600' : 'text-white/90 hover:text-gold-400'
              }`}
            >
              <Phone className="h-4 w-4 text-gold-500" />
              {company.phone}
            </a>
            <AnimatedButton to="/book" showArrow>
              Book Now
            </AnimatedButton>
          </div>

          <button
            className={`rounded-full p-2 transition-colors lg:hidden ${
              scrolled ? 'text-navy-900' : 'text-white'
            }`}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
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

              <motion.ul
                className="mt-10 flex flex-col gap-2"
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
                  </motion.li>
                ))}
              </motion.ul>

              <div className="mt-auto flex flex-col gap-4">
                <a
                  href={company.phoneHref}
                  className="flex items-center gap-2 text-sm text-white/80"
                >
                  <Phone className="h-4 w-4 text-gold-400" />
                  {company.phone}
                </a>
                <AnimatedButton to="/book" showArrow className="w-full">
                  Book Now
                </AnimatedButton>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
