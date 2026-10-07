import { createHmac, randomInt, timingSafeEqual } from 'node:crypto'
import { secret } from './auth.js'

// Stateless arithmetic captcha. The token is an expiry plus an HMAC of
// (answer, expiry), so the server stores nothing and the answer never leaves it.
// ponytail: a solved token can be replayed until it expires; the form rate
// limit caps the damage. Track used tokens (or move to Turnstile) if spam gets through.
const TTL_MS = 15 * 60 * 1000

const sign = (answer, exp) => createHmac('sha256', secret()).update(`captcha:${answer}:${exp}`).digest('base64url')

export function newCaptcha() {
  const a = randomInt(1, 10)
  const b = randomInt(1, 10)
  const exp = Date.now() + TTL_MS
  return { question: `What is ${a} + ${b}?`, token: `${exp}.${sign(a + b, exp)}` }
}

export function checkCaptcha(token, answer) {
  const [exp, mac = ''] = String(token || '').split('.')
  if (!(Number(exp) > Date.now())) return false
  const given = Buffer.from(mac)
  const expected = Buffer.from(sign(Number(String(answer ?? '').trim()), exp))
  return given.length === expected.length && timingSafeEqual(given, expected)
}
