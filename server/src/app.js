import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import routes from './routes/index.js'
import { notFoundHandler, errorHandler } from './middleware/error.js'
import { UPLOAD_DIR } from './middleware/upload.js'

export function createApp() {
  const app = express()

  const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  app.use(
    cors({
      origin: (origin, cb) => {
        // Allow tools with no origin (curl, same-origin) and whitelisted origins.
        if (!origin || origins.includes(origin)) return cb(null, true)
        cb(new Error(`Origin not allowed by CORS: ${origin}`))
      },
      credentials: true,
    }),
  )

  app.use(express.json({ limit: '2mb' }))
  app.use(cookieParser())
  app.use(morgan('dev'))

  // Serve uploaded images.
  app.use('/uploads', express.static(UPLOAD_DIR))

  // API
  app.use('/api', routes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
