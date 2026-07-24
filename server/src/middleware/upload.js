import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const UPLOAD_DIR = path.resolve(__dirname, '../../uploads')

// Ensure the uploads directory exists.
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9]+/gi, '-')
      .toLowerCase()
      .slice(0, 40)
    // Timestamp keeps names unique without Math.random().
    cb(null, `${base || 'image'}-${Date.now()}${ext}`)
  },
})

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.includes(file.mimetype)) return cb(null, true)
    const err = new Error('Only image files (jpeg, png, webp, gif, avif, svg) are allowed')
    err.status = 400
    cb(err)
  },
})
