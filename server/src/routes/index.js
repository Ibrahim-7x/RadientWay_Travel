import { Router } from 'express'
import publicRoutes from './public.routes.js'
import adminRoutes from './admin.routes.js'
import { login, me } from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { loginLimiter } from '../middleware/rateLimit.js'

const router = Router()

router.get('/health', (_req, res) => res.json({ ok: true, service: 'radiantway-api' }))

// Auth
router.post('/auth/login', loginLimiter, login)
router.get('/auth/me', requireAuth, me)

// Public content + submissions
router.use('/', publicRoutes)

// Protected admin API
router.use('/admin', adminRoutes)

export default router
