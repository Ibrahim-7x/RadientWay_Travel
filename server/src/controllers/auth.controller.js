import db from '../db.js'
import { verifyPassword, signToken } from '../lib/auth.js'
import { badRequest, unauthorized } from '../lib/httpError.js'
import { asyncHandler } from '../middleware/error.js'

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) throw badRequest('Email and password are required')

  const user = await db.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (!user || !user.active) throw unauthorized('Invalid credentials')

  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) throw unauthorized('Invalid credentials')

  await db.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name })
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  })
})

// Returns the current user from the token (used by the client on boot).
export const me = asyncHandler(async (req, res) => {
  const user = await db.adminUser.findUnique({ where: { id: req.user.id } })
  if (!user) throw unauthorized()
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role })
})
