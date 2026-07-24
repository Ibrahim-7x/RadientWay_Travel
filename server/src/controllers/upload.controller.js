import { asyncHandler } from '../middleware/error.js'
import { badRequest } from '../lib/httpError.js'

const PUBLIC_URL = process.env.PUBLIC_URL || ''

// Admin — accepts a single image file (field name "image") and returns its URL.
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw badRequest('No file uploaded (expected field "image")')
  const base = PUBLIC_URL || `${req.protocol}://${req.get('host')}`
  const url = `${base}/uploads/${req.file.filename}`
  res.status(201).json({ url, filename: req.file.filename })
})
