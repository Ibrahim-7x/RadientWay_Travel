import { crud } from '../lib/crud.js'

// Central registry of the content resources managed via the generic CRUD layer.
// Each entry yields a set of Express handlers (list, create, update, …).

export const packages = crud({
  model: 'package',
  jsonFields: ['gallery', 'tags', 'includes', 'highlights', 'itinerary'],
  orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  required: ['slug', 'name', 'country', 'region', 'city', 'price'],
  allowed: [
    'slug', 'name', 'country', 'region', 'city', 'tagline', 'nights', 'days',
    'occupancy', 'price', 'currency', 'hotelStars', 'rating', 'featured',
    'published', 'order', 'image', 'gallery', 'tags', 'includes', 'highlights',
    'itinerary',
  ],
  defaults: { currency: 'AED', hotelStars: 4, rating: 5, featured: false, published: true },
})

export const destinations = crud({
  model: 'destination',
  orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  required: ['name', 'blurb', 'image', 'priceFrom'],
  allowed: ['name', 'blurb', 'image', 'priceFrom', 'packageSlug', 'published', 'order'],
  defaults: { published: true },
})

export const visas = crud({
  model: 'visa',
  jsonFields: ['documentsRequired', 'documentsProvided'],
  orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  required: ['country', 'type', 'processing'],
  allowed: [
    'country', 'flag', 'type', 'processing', 'note', 'price', 'about',
    'documentsRequired', 'documentsProvided', 'published', 'order',
  ],
  defaults: { published: true },
})

export const testimonials = crud({
  model: 'testimonial',
  orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  required: ['name', 'quote'],
  allowed: ['name', 'trip', 'rating', 'quote', 'published', 'order'],
  defaults: { rating: 5, published: true },
})

export const faqs = crud({
  model: 'faq',
  orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  required: ['question', 'answer'],
  allowed: ['question', 'answer', 'published', 'order'],
  defaults: { published: true },
})

export const services = crud({
  model: 'service',
  orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  required: ['title', 'description'],
  allowed: ['icon', 'title', 'description', 'group', 'published', 'order'],
  defaults: { icon: 'Globe', group: 'service', published: true },
})
