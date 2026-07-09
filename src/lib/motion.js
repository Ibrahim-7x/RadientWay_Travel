// Shared Framer Motion variants used across the site.

export const easeOutExpo = [0.16, 1, 0.3, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: easeOutExpo } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
}

export const fromLeft = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: easeOutExpo } },
}

export const fromRight = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: easeOutExpo } },
}

// Container that staggers its children.
export const stagger = (staggerChildren = 0.12, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
})

// Standard viewport config for whileInView reveals.
export const viewportOnce = { once: true, amount: 0.25 }

// Word-by-word reveal for headlines.
export const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

export const wordChild = {
  hidden: { opacity: 0, y: '110%' },
  show: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.8, ease: easeOutExpo },
  },
}
