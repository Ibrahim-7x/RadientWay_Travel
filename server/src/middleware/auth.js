import { verifyToken } from '../lib/auth.js'
import { unauthorized, forbidden } from '../lib/httpError.js'

// Reads a Bearer token (or `token` cookie) and attaches req.user.
export function requireAuth(req, _res, next) {
  const header = req.headers.authorization || ''
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : null
  const token = bearer || req.cookies?.token

  if (!token) return next(unauthorized('Missing authentication token'))

  try {
    req.user = verifyToken(token)
    next()
  } catch {
    next(unauthorized('Invalid or expired token'))
  }
}

// Restrict to specific roles (call after requireAuth).
export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(unauthorized())
    if (!roles.includes(req.user.role)) return next(forbidden('Insufficient permissions'))
    next()
  }
}
