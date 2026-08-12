import { motion } from 'framer-motion'
import WhatsAppIcon from '../ui/WhatsAppIcon'
import { company } from '../../data/company'

// Floating WhatsApp action button, bottom-right.
export default function WhatsAppFab() {
  return (
    <motion.a
      href={company.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-40" />
      <WhatsAppIcon className="relative h-7 w-7" />
    </motion.a>
  )
}
