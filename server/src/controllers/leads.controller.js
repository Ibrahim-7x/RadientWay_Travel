import db from '../db.js'
import { asyncHandler } from '../middleware/error.js'
import { badRequest, notFound } from '../lib/httpError.js'
import { newCaptcha, checkCaptcha } from '../lib/captcha.js'

const STATUSES = ['new', 'read', 'replied', 'archived']

// Whole number in [min, 99]; blank/missing falls back to `fallback`.
const count = (value, min, fallback) => {
  const n = value === undefined || value === '' ? fallback : Number(value)
  return Number.isInteger(n) && n >= min && n <= 99 ? n : null
}

// Public — a fresh captcha question for the contact form.
export const captcha = (req, res) => res.json(newCaptcha())

// Public — create a contact message.
export const create = asyncHandler(async (req, res) => {
  const { name, email, phone, message, captchaToken, captchaAnswer } = req.body || {}
  if (!name || !email || !String(phone || '').trim() || !message) {
    throw badRequest('Name, email, contact number and message are required')
  }
  if (!checkCaptcha(captchaToken, captchaAnswer)) throw badRequest('Wrong answer to the security question')
  const adults = count(req.body.adults, 1, 1)
  const children = count(req.body.children, 0, 0)
  if (adults === null || children === null) throw badRequest('Adults must be 1–99 and children 0–99')

  const lead = await db.lead.create({
    data: {
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      adults,
      children,
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
