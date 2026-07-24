import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollProgress from './components/layout/ScrollProgress'
import WhatsAppFab from './components/layout/WhatsAppFab'
import ScrollToTop from './components/layout/ScrollToTop'
import { ContentProvider } from './context/ContentContext'

import Home from './pages/Home'
import TourPackages from './pages/TourPackages'
import TourDetail from './pages/TourDetail'
import VisaServicesPage from './pages/VisaServicesPage'
import About from './pages/About'
import Contact from './pages/Contact'
import BookNow from './pages/BookNow'
import NotFound from './pages/NotFound'

// Admin is code-split so its bundle never loads on the public site.
const AdminRoutes = lazy(() => import('./pages/admin/AdminRoutes'))

function usePrefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3 } },
}

function Page({ children }) {
  return (
    <motion.main variants={pageVariants} initial="initial" animate="enter" exit="exit">
      {children}
    </motion.main>
  )
}

// The animated public website.
function PublicSite() {
  const location = useLocation()

  useEffect(() => {
    if (usePrefersReducedMotion()) return
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
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
          <Route path="/visa" element={<Page><VisaServicesPage /></Page>} />
          <Route path="/about" element={<Page><About /></Page>} />
          <Route path="/contact" element={<Page><Contact /></Page>} />
          <Route path="/book" element={<Page><BookNow /></Page>} />
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
