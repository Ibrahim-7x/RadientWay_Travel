import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollProgress from './components/layout/ScrollProgress'
import WhatsAppFab from './components/layout/WhatsAppFab'
import ScrollToTop from './components/layout/ScrollToTop'

import Home from './pages/Home'
import TourPackages from './pages/TourPackages'
import TourDetail from './pages/TourDetail'
import VisaServicesPage from './pages/VisaServicesPage'
import About from './pages/About'
import Contact from './pages/Contact'
import BookNow from './pages/BookNow'
import NotFound from './pages/NotFound'

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
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.main>
  )
}

export default function App() {
  const location = useLocation()

  // Smooth scrolling via Lenis (respecting reduced-motion preference).
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
    <>
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
    </>
  )
}
