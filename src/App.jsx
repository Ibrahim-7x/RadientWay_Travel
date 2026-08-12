import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollProgress from './components/layout/ScrollProgress'
import WhatsAppFab from './components/layout/WhatsAppFab'
import ScrollToTop from './components/layout/ScrollToTop'
import { ContentProvider } from './context/ContentContext'

// Home is the landing route for nearly every visitor, so it stays in the main
// bundle — lazying it would only add a request waterfall before first paint.
// Every other page is split out and fetched on navigation.
import Home from './pages/Home'

const TourPackages = lazy(() => import('./pages/TourPackages'))
const TourDetail = lazy(() => import('./pages/TourDetail'))
const UmrahPackages = lazy(() => import('./pages/UmrahPackages'))
const VisaServicesPage = lazy(() => import('./pages/VisaServicesPage'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Admin is code-split so its bundle never loads on the public site.
const AdminRoutes = lazy(() => import('./pages/admin/AdminRoutes'))

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3 } },
}

// The Suspense boundary lives here rather than around <Routes> because
// AnimatePresence needs the keyed <Routes> as its direct child — wrapping that
// in Suspense would break page exit animations. min-h-screen holds the footer
// down while a route chunk loads so the page doesn't jump.
function Page({ children }) {
  return (
    <motion.main variants={pageVariants} initial="initial" animate="enter" exit="exit">
      <Suspense fallback={<div className="min-h-screen" />}>{children}</Suspense>
    </motion.main>
  )
}

// The animated public website.
function PublicSite() {
  const location = useLocation()

  // Smooth scroll is a desktop affordance. On touch it replaces the platform's
  // own momentum scrolling with a worse imitation, and costs a permanent rAF
  // loop plus ~20kB on exactly the devices least able to spare either — so it
  // is gated to fine pointers and imported dynamically, keeping it out of the
  // bundle phones download at all.
  useEffect(() => {
    const wants =
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!wants) return

    let lenis
    let raf
    let cancelled = false

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      const loop = (time) => {
        lenis.raf(time)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    })

    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      lenis?.destroy()
    }
  }, [])

  return (
    <ContentProvider>
      <ScrollProgress />
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/tours" element={<Page><TourPackages /></Page>} />
          <Route path="/tours/:slug" element={<Page><TourDetail /></Page>} />
          <Route path="/umrah" element={<Page><UmrahPackages /></Page>} />
          {/* Umrah detail pages share TourDetail — same shape, different tab. */}
          <Route path="/umrah/:slug" element={<Page><TourDetail /></Page>} />
          <Route path="/visa" element={<Page><VisaServicesPage /></Page>} />
          <Route path="/about" element={<Page><About /></Page>} />
          <Route path="/contact" element={<Page><Contact /></Page>} />
          {/* /book retired — all enquiries go through /contact */}
          <Route path="/book" element={<Navigate to="/contact" replace />} />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <WhatsAppFab />
    </ContentProvider>
  )
}

export default function App() {
  const location = useLocation()

  // The admin panel is a self-contained app (no public chrome, no Lenis).
  if (location.pathname.startsWith('/admin')) {
    return (
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-cream" />}>
        <AdminRoutes />
      </Suspense>
    )
  }

  return <PublicSite />
}
