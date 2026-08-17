import db from '../db.js'
import { asyncHandler } from '../middleware/error.js'
import { badRequest, notFound } from '../lib/httpError.js'

const STATUSES = ['new', 'read', 'replied', 'archived']

// Public — create a contact message.
export const create = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body || {}
  if (!name || !email || !message) throw badRequest('Name, email and message are required')

  const lead = await db.lead.create({
    data: {
      name: String(name).trim(),
      email: String(email).trim(),
      phone: (req.body.phone || '').trim(),
      message: String(message).trim(),
    },
  })
  res.status(201).json({ ok: true, id: lead.id })
})

export const list = asyncHandler(async (req, res) => {
  const where = {}
  if (req.query.status && STATUSES.includes(req.query.status)) where.status = req.query.status
  const rows = await db.lead.findMany({ where, orderBy: { createdAt: 'desc' } })
  res.json(rows)
})

export const updateStatus = asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  const { status } = req.body || {}
  if (!STATUSES.includes(status)) throw badRequest('Invalid status')
  const row = await db.lead.update({ where: { id }, data: { status } }).catch(() => null)
  if (!row) throw notFound('Lead not found')
  res.json(row)
})

export const remove = asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  await db.lead.delete({ where: { id } })
  res.json({ ok: true, id })
})
