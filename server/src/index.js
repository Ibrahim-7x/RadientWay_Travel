import 'dotenv/config'
import { requireSecrets } from './lib/env.js'
import { createApp } from './app.js'
import db from './db.js'

// First statement that runs: a production process which fell back to the
// repo's example JWT_SECRET would serve forged admin tokens quite happily.
// (Imports hoist, so this cannot sit between them — it has to be here.)
requireSecrets(['JWT_SECRET'])

const PORT = process.env.PORT || 4000
const app = createApp()

const server = app.listen(PORT, () => {
  console.log(`\n  RadiantWay API listening on http://localhost:${PORT}`)
  console.log(`  Health check:  http://localhost:${PORT}/api/health\n`)
})

// Graceful shutdown.
const shutdown = async () => {
  await db.$disconnect()
  server.close(() => process.exit(0))
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
