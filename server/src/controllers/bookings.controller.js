import db from '../db.js'
import { asyncHandler } from '../middleware/error.js'
import { badRequest, notFound } from '../lib/httpError.js'

const STATUSES = ['new', 'contacted', 'confirmed', 'cancelled']

// Public — create a booking request (from the BookNow wizard).
export const create = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body || {}
  if (!name || !email || !phone) throw badRequest('Name, email and phone are required')

  let packageName = req.body.packageName
  if (!packageName && req.body.packageSlug) {
    const pkg = await db.package.findUnique({ where: { slug: req.body.packageSlug } })
    packageName = pkg?.name
  }

  const booking = await db.booking.create({
    data: {
      packageSlug: req.body.packageSlug || null,
      packageName: packageName || null,
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      date: req.body.date || null,
      travellers: Number(req.body.travellers) || 1,
      occupancy: req.body.occupancy || '',
      notes: req.body.notes || '',
    },
  })
  res.status(201).json({ ok: true, id: booking.id })
})

// Admin — list, optionally filtered by ?status=
export const list = asyncHandler(async (req, res) => {
  const where = {}
  if (req.query.status && STATUSES.includes(req.query.status)) where.status = req.query.status
  const rows = await db.booking.findMany({ where, orderBy: { createdAt: 'desc' } })
  res.json(rows)
})

export const updateStatus = asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  const { status, notes } = req.body || {}
  if (status && !STATUSES.includes(status)) throw badRequest('Invalid status')
  const data = {}
  if (status) data.status = status
  if (notes !== undefined) data.notes = notes
  const row = await db.booking.update({ where: { id }, data }).catch(() => null)
  if (!row) throw notFound('Booking not found')
  res.json(row)
})

export const remove = asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  await db.booking.delete({ where: { id } })
  res.json({ ok: true, id })
})
