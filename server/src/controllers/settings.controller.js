import prisma from '../prisma.js'
import { asyncHandler } from '../middleware/error.js'
import { parseJson } from '../lib/json.js'

const COMPANY_KEY = 'company'

// Public + admin — read the company settings blob.
export const getCompany = asyncHandler(async (_req, res) => {
  const row = await prisma.setting.findUnique({ where: { key: COMPANY_KEY } })
  res.json(row ? parseJson(row.value, {}) : {})
})

// Admin — replace the company settings blob.
export const updateCompany = asyncHandler(async (req, res) => {
  const value = JSON.stringify(req.body || {})
  const row = await prisma.setting.upsert({
    where: { key: COMPANY_KEY },
    update: { value },
    create: { key: COMPANY_KEY, value },
  })
  res.json(parseJson(row.value, {}))
})
