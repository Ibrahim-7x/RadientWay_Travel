import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

/**
 * Navbar tab with a hover/focus dropdown. The tab itself stays a real NavLink to
 * the section index, so the dropdown is a shortcut rather than the only way in.
 *
 * Opens on hover and on focus entering the group, so keyboard users can Tab from
 * the tab straight into the panel; Escape closes it.
 */
export default function NavDropdown({ link, items, scrolled, onNavigate }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(e) => {
        // Only close once focus has actually left the group.
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false)
      }}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
    >
      <NavLink
        to={link.to}
        aria-expanded={open}
        className={({ isActive }) =>
          `link-underline flex items-center gap-1 text-sm font-medium tracking-wide transition-colors ${
            isActive
              ? 'text-gold-500'
              : scrolled
              ? 'text-navy-700 hover:text-navy-950'
              : 'text-white/90 hover:text-white'
          }`
        }
      >
        {link.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </NavLink>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full z-50 w-64 pt-4"
          >
            {/* transparent pt-4 above bridges the gap so hover doesn't drop */}
            <div className="max-h-[70vh] overflow-y-auto rounded-2xl bg-white p-2 shadow-card-hover ring-1 ring-navy-950/5">
              {items.map((item, i) => (
                <NavLink
                  key={`${item.to}-${i}`}
                  to={item.to}
                  onClick={() => {
                    setOpen(false)
                    onNavigate?.()
                  }}
                  end
                  className={`block truncate rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gold-50 ${
                    item.muted
                      ? 'font-semibold text-navy-950'
                      : 'text-navy-700 hover:text-navy-950'
                  }`}
                  title={item.label}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
