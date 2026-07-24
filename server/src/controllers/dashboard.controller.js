import prisma from '../prisma.js'
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
    prisma.package.count(),
    prisma.package.count({ where: { published: true } }),
    prisma.destination.count(),
    prisma.visa.count(),
    prisma.testimonial.count(),
    prisma.faq.count(),
    prisma.service.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'new' } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'new' } }),
    prisma.subscriber.count(),
    prisma.booking.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
    prisma.lead.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
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
