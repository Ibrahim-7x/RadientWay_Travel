import { Router } from 'express'
import * as R from '../controllers/resources.js'
import * as bookings from '../controllers/bookings.controller.js'
import * as leads from '../controllers/leads.controller.js'
import * as subscribers from '../controllers/subscribers.controller.js'
import { stats } from '../controllers/dashboard.controller.js'
import { updateCompany, getCompany } from '../controllers/settings.controller.js'
import { uploadImage } from '../controllers/upload.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

// All routes here require a valid admin token.
const router = Router()
router.use(requireAuth)

router.get('/dashboard', stats)

// Image upload
router.post('/upload', upload.single('image'), uploadImage)

// Settings
router.get('/settings', getCompany)
router.put('/settings', updateCompany)

// Generic CRUD for each content resource.
const resource = (path, ctrl, { slug = false } = {}) => {
  router.get(`/${path}`, ctrl.list)
  router.get(`/${path}/:id`, ctrl.getById)
  router.post(`/${path}`, ctrl.create)
  router.put(`/${path}/:id`, ctrl.update)
  router.delete(`/${path}/:id`, ctrl.remove)
}

resource('packages', R.packages)
resource('destinations', R.destinations)
resource('visas', R.visas)
resource('testimonials', R.testimonials)
resource('faqs', R.faqs)
resource('services', R.services)

// Bookings (lead management)
router.get('/bookings', bookings.list)
router.patch('/bookings/:id', bookings.updateStatus)
router.delete('/bookings/:id', bookings.remove)

// Contact leads
router.get('/leads', leads.list)
router.patch('/leads/:id', leads.updateStatus)
router.delete('/leads/:id', leads.remove)

// Subscribers
router.get('/subscribers', subscribers.list)
router.delete('/subscribers/:id', subscribers.remove)

export default router
