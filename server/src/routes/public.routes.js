import { Router } from 'express'
import * as R from '../controllers/resources.js'
import * as bookings from '../controllers/bookings.controller.js'
import * as leads from '../controllers/leads.controller.js'
import * as subscribers from '../controllers/subscribers.controller.js'
import { getCompany } from '../controllers/settings.controller.js'
import { getGoogleRating } from '../controllers/reviews.controller.js'

// Read-only content + public form submissions. No auth.
const router = Router()

// Content (published only)
router.get('/packages', R.packages.listPublished)
router.get('/packages/:slug', R.packages.getBySlug)
router.get('/destinations', R.destinations.listPublished)
router.get('/visas', R.visas.listPublished)
router.get('/testimonials', R.testimonials.listPublished)
router.get('/faqs', R.faqs.listPublished)
router.get('/services', R.services.listPublished)
router.get('/settings', getCompany)
router.get('/reviews/google', getGoogleRating)

// Submissions
router.post('/bookings', bookings.create)
router.post('/contact', leads.create)
router.post('/subscribe', subscribers.subscribe)

export default router
