import prisma from '../prisma.js'
import { asyncHandler } from '../middleware/error.js'
import { badRequest } from '../lib/httpError.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Public — subscribe to the newsletter (idempotent).
export const subscribe = asyncHandler(async (req, res) => {
  const email = String(req.body?.email || '').toLowerCase().trim()
  if (!EMAIL_RE.test(email)) throw badRequest('A valid email is required')

  await prisma.subscriber.upsert({
    where: { email },
    update: { active: true },
    create: { email },
  })
  res.status(201).json({ ok: true })
})

export const list = asyncHandler(async (_req, res) => {
  const rows = await prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(rows)
})

export const remove = asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  await prisma.subscriber.delete({ where: { id } })
  res.json({ ok: true, id })
})
