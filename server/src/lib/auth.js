import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Resolved per call rather than captured at import: a module-level constant is
// read before index.js can run its production check, which made the dev
// fallback reachable from anything that imported this file. Production has no
// fallback at all — signing without a real secret throws instead.
function secret() {
  const configured = process.env.JWT_SECRET
  if (configured) return configured
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is not set; refusing to issue or verify tokens')
  }
  return 'dev-secret-change-me'
}

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10)
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash)
}

export function signToken(payload) {
  return jwt.sign(payload, secret(), { expiresIn: EXPIRES_IN })
}

export function verifyToken(token) {
  return jwt.verify(token, secret())
}
