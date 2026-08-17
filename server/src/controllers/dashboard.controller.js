import db from '../db.js'
import { asyncHandler } from '../middleware/error.js'

// Admin dashboard — headline counts + recent activity.
export const stats = asyncHandler(async (_req, res) => {
  const [
    packages,
    publishedPackages,
    destinations,
    visas,
    testimonials,
    faqs,
    services,
    bookings,
    newBookings,
    leads,
    newLeads,
    subscribers,
    recentBookings,
    recentLeads,
  ] = await Promise.all([
    db.package.count(),
    db.package.count({ where: { published: true } }),
    db.destination.count(),
    db.visa.count(),
    db.testimonial.count(),
    db.faq.count(),
    db.service.count(),
    db.booking.count(),
    db.booking.count({ where: { status: 'new' } }),
    db.lead.count(),
    db.lead.count({ where: { status: 'new' } }),
    db.subscriber.count(),
    db.booking.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
    db.lead.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
  ])

  res.json({
    counts: {
      packages,
      publishedPackages,
      destinations,
      visas,
      testimonials,
      faqs,
      services,
      bookings,
      newBookings,
      leads,
      newLeads,
      subscribers,
    },
    recentBookings,
    recentLeads,
  })
})
