// `secondary` links are kept out of the desktop navbar to keep it uncluttered —
// Home is the logo, and About is reachable from the mobile drawer and footer.
// The footer's Explore column and the mobile drawer still list everything.
export const navLinks = [
  { label: 'Home', to: '/', secondary: true },
  { label: 'Tour Packages', to: '/tours' },
  { label: 'Umrah', to: '/umrah' },
  { label: 'Visa Services', to: '/visa' },
  { label: 'About', to: '/about', secondary: true },
  { label: 'Contact', to: '/contact' },
]

// The tabs shown in the desktop bar.
export const primaryNavLinks = navLinks.filter((l) => !l.secondary)
