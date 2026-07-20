import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Clock, Wallet, FileText, CheckCircle2 } from 'lucide-react'
import { easeOutExpo } from '../../lib/motion'
import AnimatedButton from './AnimatedButton'

/**
 * Slide-up detail modal for a single visa. Rendered in a portal so it escapes
 * any transformed/overflow-clipped ancestor. Pass `visa` (null = closed).
 */
export default function VisaDetailModal({ visa, onClose }) {
  const open = Boolean(visa)

  // Lock background scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${visa.country} visa details`}
        >
          {/* Backdrop — solid overlay (no backdrop-filter: full-viewport blur
              over the animated page background tanks FPS). */}
          <div className="absolute inset-0 bg-navy-950/80" />

          {/* Panel */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            className="no-scrollbar relative z-10 max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white shadow-navy sm:max-h-[88vh] sm:rounded-3xl"
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-navy-gradient px-7 pb-8 pt-9 text-white">
              <div className="pointer-events-none absolute inset-0 bg-radiant-glow opacity-60" />
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur transition hover:bg-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative flex items-center gap-4">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-4xl ring-1 ring-white/20">
                  {visa.flag}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                    Visa Services
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold leading-tight text-white">
                    {visa.country}
                  </h2>
                  <p className="text-sm text-navy-200">{visa.type}</p>
                </div>
              </div>
            </div>

            <div className="space-y-7 px-7 py-7">
              {/* Price + processing chips */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-gold-300/50 bg-gold-50 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-700">
                    <Wallet className="h-3.5 w-3.5" /> Service Price
                  </div>
                  <p className="mt-1 font-display text-2xl font-bold text-navy-950">{visa.price}</p>
                </div>
                <div className="rounded-2xl border border-navy-950/10 bg-cream p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-500">
                    <Clock className="h-3.5 w-3.5" /> Processing
                  </div>
                  <p className="mt-1 font-display text-2xl font-bold text-navy-950">{visa.processing}</p>
                </div>
              </div>

              {/* About */}
              <section>
                <h3 className="font-display text-lg font-semibold text-navy-950">
                  About {visa.country} Visa
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{visa.about}</p>
              </section>

              {/* Documents */}
              <div className="grid gap-6 sm:grid-cols-2">
                <section>
                  <h4 className="flex items-center gap-2 font-display text-base font-semibold text-navy-950">
                    <FileText className="h-4 w-4 text-gold-600" /> Documents Required
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {visa.documentsRequired.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-navy-600">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h4 className="flex items-center gap-2 font-display text-base font-semibold text-navy-950">
                    <CheckCircle2 className="h-4 w-4 text-gold-600" /> Documents Provided
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {visa.documentsProvided.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-navy-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>

            {/* Sticky CTA footer */}
            <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-navy-950/5 bg-white px-7 py-4">
              <p className="hidden text-xs text-navy-500 sm:block">
                Approval is at the authority's discretion.
              </p>
              <AnimatedButton to="/contact" className="w-full sm:w-auto" showArrow>
                Enquire now
              </AnimatedButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
