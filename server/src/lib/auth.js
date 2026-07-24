import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10)
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash)
}

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN })
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET)
}
