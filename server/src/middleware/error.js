// 404 for unmatched routes.
export function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` })
}

// Central error handler. Translates known Prisma errors into friendly messages.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  // Prisma unique-constraint violation
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field'
    return res.status(409).json({ error: `A record with that ${field} already exists.` })
  }
  // Prisma record-not-found (update/delete on missing id)
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found.' })
  }

  const status = err.status || 500
  if (status >= 500) console.error(err)

  res.status(status).json({
    error: err.message || 'Internal server error',
    ...(err.details ? { details: err.details } : {}),
  })
}

// Wraps an async route handler so thrown errors reach the error middleware.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
