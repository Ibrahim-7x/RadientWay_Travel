export const company = {
  name: 'RadiantWay Travel',
  shortName: 'RadiantWay',
  tagline: 'Effortless Journeys. Lasting Memories.',
  intro:
    'UAE-based travel experts with global reach. We craft tailored tour packages, handle your visas, and take care of every detail — so all you have to do is travel.',
  phone: '+971 54 786 1293',
  phoneHref: 'tel:+971547861293',
  // Department contact numbers shown in the navbar dropdown. Editable from
  // Admin → Settings. Defaults to the main number until you set real ones.
  holidaysPhone: '+971 54 786 1293',
  visaPhone: '+971 54 786 1293',
  whatsapp: 'https://wa.me/971547861293',
  email: 'info@radiantwaytravel.com',
  emailHref: 'mailto:info@radiantwaytravel.com',
  address:
    'Office No: 17, 28th Floor, Aspin Commercial Tower, Sheikh Zayed Road, Dubai, UAE',
  hours: 'Open 24/7 — we never stop for our travellers',
  reviewUrl: 'https://share.google/6Yg4AJOHDoq0k574Q',
  socials: [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/radiantwaytravel?igsh=MW90NXQyaGl0bWZwdg==',
      icon: 'Instagram',
    },
    { name: 'Facebook', href: 'https://www.facebook.com/share/19qorzUXsM/', icon: 'Facebook' },
    { name: 'WhatsApp', href: 'https://wa.me/971547861293', icon: 'MessageCircle' },
  ],
  rating: 5.0,
  reviewCount: 640,
}

// Build a WhatsApp chat link, optionally with a prefilled message.
export const waLink = (text) =>
  text ? `${company.whatsapp}?text=${encodeURIComponent(text)}` : company.whatsapp

// Turn a display phone number into a tel: href (keeps digits and leading +).
export const telHref = (phone) => `tel:${String(phone || '').replace(/[^\d+]/g, '')}`

export const stats = [
  { value: 8, suffix: '+', label: 'Years of expertise' },
  { value: 50, suffix: 'k+', label: 'Happy travellers' },
  { value: 40, suffix: '+', label: 'Destinations worldwide' },
  { value: 5.0, suffix: '★', label: `Rated by ${company.reviewCount}+ reviews`, decimals: 1 },
]
