import { Badge } from '../../components/admin/ui'

// Drives the generic ResourceList / ResourceForm pages.
// Field types: text | textarea | number | toggle | select | image | array | itinerary
// Each resource: { key, path, singular, title, subtitle, columns, fields, defaults }

const publishedCol = {
  key: 'published',
  label: 'Status',
  render: (r) => <Badge tone={r.published ? 'published' : 'draft'}>{r.published ? 'Published' : 'Draft'}</Badge>,
}

// Decides which public listing a package appears on: /tours or /umrah.
const categoryOptions = [
  { value: 'tour', label: 'Tour package (/tours)' },
  { value: 'umrah', label: 'Umrah package (/umrah)' },
]

const iconOptions = [
  'Map', 'Stamp', 'Plane', 'BedDouble', 'CarFront', 'Camera', 'CreditCard',
  'FerrisWheel', 'MoonStar', 'HeartHandshake', 'ShieldCheck', 'Clock', 'Wallet', 'Globe',
].map((v) => ({ value: v, label: v }))

export const resources = {
  packages: {
    key: 'packages',
    path: 'packages',
    singular: 'Package',
    title: 'Packages',
    subtitle: 'Create and manage the tour and Umrah packages shown across the site.',
    columns: [
      { key: 'name', label: 'Name', render: (r) => (
        <div className="flex items-center gap-3">
          {r.image && <img src={r.image} alt="" className="h-10 w-14 rounded-lg object-cover" />}
          <div>
            <p className="font-semibold text-navy-900">{r.name}</p>
            <p className="text-xs text-navy-400">{r.city}, {r.country}</p>
          </div>
        </div>
      ) },
      { key: 'category', label: 'Type', render: (r) => (
        <Badge tone={r.category === 'umrah' ? 'contacted' : 'new'}>
          {r.category === 'umrah' ? 'Umrah' : 'Tour'}
        </Badge>
      ) },
      { key: 'region', label: 'Region' },
      { key: 'price', label: 'Price', render: (r) => `${r.currency} ${Number(r.price).toLocaleString()}` },
      { key: 'featured', label: 'Featured', render: (r) => (r.featured ? <Badge tone="confirmed">Featured</Badge> : '—') },
      publishedCol,
    ],
    defaults: {
      slug: '', name: '', category: 'tour', country: '', region: '', city: '', tagline: '',
      nights: 3, days: 4, occupancy: 'Twin sharing', price: 1000, currency: 'AED',
      hotelStars: 4, rating: 5, featured: false, published: true, order: 0,
      image: '', gallery: [], tags: [], includes: [], highlights: [], itinerary: [],
    },
    fields: [
      { name: 'name', label: 'Package name', type: 'text', required: true, colSpan: 2 },
      { name: 'slug', label: 'Slug (URL)', type: 'text', required: true, hint: 'lowercase-with-dashes — used in /tours/<slug> or /umrah/<slug>' },
      { name: 'category', label: 'Package type', type: 'select', options: categoryOptions, hint: 'Umrah packages appear on the Umrah tab only' },
      { name: 'tagline', label: 'Tagline', type: 'text', colSpan: 2 },
      { name: 'country', label: 'Country', type: 'text', required: true },
      { name: 'region', label: 'Region', type: 'text', required: true, hint: 'e.g. Caucasus, Europe, Middle East' },
      { name: 'city', label: 'City', type: 'text', required: true },
      { name: 'nights', label: 'Nights', type: 'number' },
      { name: 'days', label: 'Days', type: 'number' },
      { name: 'occupancy', label: 'Occupancy', type: 'select', options: ['Quad sharing', 'Triple sharing', 'Twin sharing', 'Single'].map((v) => ({ value: v, label: v })) },
      { name: 'price', label: 'Price (per person)', type: 'number', required: true },
      { name: 'currency', label: 'Currency', type: 'text' },
      { name: 'hotelStars', label: 'Hotel stars', type: 'number' },
      { name: 'rating', label: 'Rating (0–5)', type: 'number', step: 0.1 },
      { name: 'order', label: 'Sort order', type: 'number' },
      { name: 'featured', label: 'Featured on homepage', type: 'toggle' },
      { name: 'published', label: 'Published (visible on site)', type: 'toggle' },
      { name: 'image', label: 'Main image', type: 'image', colSpan: 2 },
      { name: 'tags', label: 'Tags', type: 'array', colSpan: 2, placeholder: 'e.g. Culture, Beach, Best Seller' },
      { name: 'includes', label: 'What’s included', type: 'array', colSpan: 2, placeholder: 'e.g. Return flights from UAE' },
      { name: 'highlights', label: 'Trip highlights', type: 'array', colSpan: 2, placeholder: 'e.g. Lake Sevan day trip' },
      { name: 'gallery', label: 'Gallery image URLs', type: 'array', colSpan: 2, placeholder: 'Paste an image URL' },
      { name: 'itinerary', label: 'Day-by-day itinerary', type: 'itinerary', colSpan: 2 },
    ],
  },

  destinations: {
    key: 'destinations',
    path: 'destinations',
    singular: 'Destination',
    title: 'Popular Destinations',
    subtitle: 'The destination showcase cards on the homepage.',
    columns: [
      { key: 'name', label: 'Destination', render: (r) => (
        <div className="flex items-center gap-3">
          {r.image && <img src={r.image} alt="" className="h-10 w-14 rounded-lg object-cover" />}
          <span className="font-semibold text-navy-900">{r.name}</span>
        </div>
      ) },
      { key: 'blurb', label: 'Blurb' },
      { key: 'priceFrom', label: 'From', render: (r) => `AED ${Number(r.priceFrom).toLocaleString()}` },
      publishedCol,
    ],
    defaults: { name: '', blurb: '', image: '', priceFrom: 1000, packageSlug: '', published: true, order: 0 },
    fields: [
      { name: 'name', label: 'Destination name', type: 'text', required: true },
      { name: 'priceFrom', label: 'Price from (AED)', type: 'number', required: true },
      { name: 'blurb', label: 'Short blurb', type: 'text', required: true, colSpan: 2 },
      { name: 'packageSlug', label: 'Links to package slug', type: 'text', hint: 'Optional — clicking the card opens /tours/<slug>' },
      { name: 'order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'toggle' },
      { name: 'image', label: 'Image', type: 'image', colSpan: 2 },
    ],
  },

  visas: {
    key: 'visas',
    path: 'visas',
    singular: 'Visa Service',
    title: 'Visa Services',
    subtitle: 'Per-country visa assistance offerings.',
    columns: [
      { key: 'country', label: 'Country', render: (r) => <span className="font-semibold text-navy-900">{r.flag} {r.country}</span> },
      { key: 'type', label: 'Type' },
      { key: 'processing', label: 'Processing' },
      { key: 'price', label: 'Price' },
      publishedCol,
    ],
    defaults: { country: '', flag: '', type: '', processing: '', note: '', price: '', about: '', documentsRequired: [], documentsProvided: [], published: true, order: 0 },
    fields: [
      { name: 'country', label: 'Country', type: 'text', required: true },
      { name: 'flag', label: 'Flag emoji', type: 'text', hint: 'e.g. 🇺🇸' },
      { name: 'type', label: 'Visa type', type: 'text', required: true, hint: 'e.g. B1/B2 Tourist & Business' },
      { name: 'processing', label: 'Processing time', type: 'text', required: true, hint: 'e.g. 3–6 weeks' },
      { name: 'price', label: 'Price', type: 'text', hint: 'e.g. AED 1,200' },
      { name: 'note', label: 'Short note', type: 'text', colSpan: 2 },
      { name: 'about', label: 'About this visa', type: 'textarea', colSpan: 2, rows: 4 },
      { name: 'order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'toggle' },
      { name: 'documentsRequired', label: 'Documents required', type: 'array', colSpan: 2 },
      { name: 'documentsProvided', label: 'What we provide', type: 'array', colSpan: 2 },
    ],
  },

  testimonials: {
    key: 'testimonials',
    path: 'testimonials',
    singular: 'Testimonial',
    title: 'Testimonials',
    subtitle: 'Customer reviews shown on the site.',
    columns: [
      { key: 'name', label: 'Name', render: (r) => <span className="font-semibold text-navy-900">{r.name}</span> },
      { key: 'trip', label: 'Trip' },
      { key: 'rating', label: 'Rating', render: (r) => '★'.repeat(r.rating) },
      { key: 'quote', label: 'Quote', render: (r) => <span className="line-clamp-1 max-w-xs text-navy-500">{r.quote}</span> },
      publishedCol,
    ],
    defaults: { name: '', trip: '', rating: 5, quote: '', published: true, order: 0 },
    fields: [
      { name: 'name', label: 'Customer name', type: 'text', required: true },
      { name: 'trip', label: 'Trip / package', type: 'text' },
      { name: 'rating', label: 'Rating (1–5)', type: 'number' },
      { name: 'order', label: 'Sort order', type: 'number' },
      { name: 'quote', label: 'Quote', type: 'textarea', required: true, colSpan: 2, rows: 4 },
      { name: 'published', label: 'Published', type: 'toggle' },
    ],
  },

  faqs: {
    key: 'faqs',
    path: 'faqs',
    singular: 'FAQ',
    title: 'FAQs',
    subtitle: 'Frequently asked questions.',
    columns: [
      { key: 'question', label: 'Question', render: (r) => <span className="font-semibold text-navy-900">{r.question}</span> },
      { key: 'answer', label: 'Answer', render: (r) => <span className="line-clamp-1 max-w-md text-navy-500">{r.answer}</span> },
      publishedCol,
    ],
    defaults: { question: '', answer: '', published: true, order: 0 },
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true, colSpan: 2 },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true, colSpan: 2, rows: 4 },
      { name: 'order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'toggle' },
    ],
  },

  services: {
    key: 'services',
    path: 'services',
    singular: 'Service',
    title: 'Services',
    subtitle: 'Service cards and “Why choose us” highlights.',
    columns: [
      { key: 'title', label: 'Title', render: (r) => <span className="font-semibold text-navy-900">{r.title}</span> },
      { key: 'group', label: 'Group', render: (r) => <Badge tone={r.group === 'why' ? 'contacted' : 'new'}>{r.group === 'why' ? 'Why choose us' : 'Service'}</Badge> },
      { key: 'icon', label: 'Icon' },
      { key: 'description', label: 'Description', render: (r) => <span className="line-clamp-1 max-w-md text-navy-500">{r.description}</span> },
      publishedCol,
    ],
    defaults: { icon: 'Globe', title: '', description: '', group: 'service', published: true, order: 0 },
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'icon', label: 'Icon', type: 'select', options: iconOptions },
      { name: 'group', label: 'Group', type: 'select', options: [
        { value: 'service', label: 'Service card' },
        { value: 'why', label: 'Why choose us' },
      ] },
      { name: 'order', label: 'Sort order', type: 'number' },
      { name: 'description', label: 'Description', type: 'textarea', required: true, colSpan: 2, rows: 3 },
      { name: 'published', label: 'Published', type: 'toggle' },
    ],
  },
}
