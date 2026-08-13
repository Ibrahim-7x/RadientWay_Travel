import rateLimit from 'express-rate-limit'

// Rate limits for the two endpoint groups a stranger can reach: the admin login
// (brute-force target) and the public form submissions (spam target).
//
// Counting is per client IP and held in memory, which is correct for the
// single API container this project deploys. Run more than one and each keeps
// its own tally, so the effective limit multiplies by the replica count — that
// is the point to move to the Redis store.
// ponytail: in-memory store, swap for rate-limit-redis if the API is scaled out.

const shared = {
  standardHeaders: 'draft-7', // RateLimit / RateLimit-Policy response headers
  legacyHeaders: false,
}

// Ten attempts per quarter hour, and only failures count — someone legitimately
// working in the admin panel is never throttled by their own successful logins.
export const loginLimiter = rateLimit({
  ...shared,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
})

// Enquiries, bookings and newsletter signups. Generous enough that a family
// sharing an IP can all get in touch, tight enough to stop a spam script.
export const formLimiter = rateLimit({
  ...shared,
  windowMs: 60 * 60 * 1000,
  limit: 20,
  message: { error: 'Too many submissions from this address. Please try again later.' },
})
