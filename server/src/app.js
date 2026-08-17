import path from 'node:path'
import express from 'express'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import routes from './routes/index.js'
import { notFoundHandler, errorHandler } from './middleware/error.js'
import { UPLOAD_DIR } from './middleware/upload.js'

/**
 * @param {object}  [options]
 * @param {string}  [options.staticDir] Directory holding the built frontend.
 *   Passing it puts this process at the network edge, serving the site itself
 *   instead of sitting behind nginx — see server.js in the repo root. It then
 *   also takes over the jobs nginx would otherwise do: compression, cache
 *   policy, security headers and the SPA fallback. Leave it unset for the
 *   Docker stack, where nginx still handles all of that.
 */
export function createApp({ staticDir } = {}) {
  const app = express()

  // Don't advertise the framework.
  app.disable('x-powered-by')

  // nginx proxies /api, so without this every request carries the proxy's IP
  // and the rate limiters would count the whole internet as one client —
  // throttling all users the moment anyone hits a limit. The value is a hop
  // count, not `true`: it trusts only the N proxies nearest this app, so a
  // client can't spoof its address by sending its own X-Forwarded-For.
  // Raise it if you add another proxy in front (a CDN, a load balancer).
  app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS ?? 1))

  // PUBLIC_URL is this site's own address, so it is always a legitimate origin.
  const origins = [
    ...(process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(','),
    process.env.PUBLIC_URL || '',
  ]
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean)

  // A request whose Origin is this very host is same-origin: the browser sends
  // an Origin header on cross-site-capable methods (POST included) even when
  // the page and the API share a domain, and in the single-process deployment
  // they always do — server.js serves dist/ and /api together.
  //
  // Recognising that from the request itself rather than from configuration is
  // what stops the site rejecting its own admin login when PUBLIC_URL is unset,
  // which is exactly what happened in production. req.hostname honours
  // X-Forwarded-Host, so it is the public domain behind the host's proxy.
  // Scheme is not compared: the proxy terminates TLS and forwards plain HTTP,
  // so requiring a match would fail on every request it forwards.
  const isSameOrigin = (origin, req) => {
    try {
      return new URL(origin).hostname === req.hostname
    } catch {
      return false
    }
  }

  const corsMw = cors((req, cb) => {
    const origin = req.headers.origin
    // No Origin at all means a non-browser caller (curl, a health check) or a
    // plain same-origin GET — nothing for CORS to protect against.
    if (!origin || isSameOrigin(origin, req) || origins.includes(origin.replace(/\/$/, ''))) {
      return cb(null, { origin: true, credentials: true })
    }
    const err = new Error(`Origin not allowed by CORS: ${origin}`)
    err.status = 403 // Not a server fault — it was reported to the browser as a 500.
    cb(err)
  })

  app.use(express.json({ limit: '2mb' }))
  app.use(cookieParser())
  app.use(morgan('dev'))

  // CORS is scoped to the API surface, never the whole app. Applied globally it
  // also guarded the static files, and Vite emits <script type="module"
  // crossorigin> — so the browser sends an Origin header even same-origin, the
  // whitelist rejected the site's own address, and the bundle 500'd. The page
  // then rendered as a blank shell with nothing in the console.
  app.use('/uploads', corsMw, express.static(UPLOAD_DIR))
  app.use('/api', corsMw, routes)

  if (staticDir) {
    // Without nginx in front, an uncompressed bundle is ~384kB instead of
    // ~125kB, so this is not optional.
    app.use(compression())

    // Same headers the nginx config sets. Skipped when nginx is present so the
    // client doesn't receive each one twice.
    app.use((_req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('X-Frame-Options', 'SAMEORIGIN')
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
      res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
      next()
    })

    // index:false so "/" falls through to the SPA handler below and gets one
    // consistent cache policy. Only /assets/ is fingerprinted by Vite, so only
    // it is safe to freeze for a year.
    app.use(
      express.static(staticDir, {
        index: false,
        setHeaders: (res, filePath) => {
          const hashed = filePath.includes(`${path.sep}assets${path.sep}`)
          res.setHeader(
            'Cache-Control',
            hashed ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
          )
        },
      }),
    )

    // SPA fallback: any other GET is a client-side route. Written as plain
    // middleware rather than app.get('*') because the '*' pattern stopped
    // being valid in Express 5. /api and /uploads fall through to the 404
    // handler so a mistyped endpoint returns JSON, not the HTML shell.
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next()
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next()
      res.setHeader('Cache-Control', 'no-cache')
      res.sendFile(path.join(staticDir, 'index.html'))
    })
  }

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
