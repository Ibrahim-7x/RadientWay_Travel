import 'dotenv/config'
import { createApp } from './app.js'
import prisma from './prisma.js'

const PORT = process.env.PORT || 4000
const app = createApp()

const server = app.listen(PORT, () => {
  console.log(`\n  RadiantWay API listening on http://localhost:${PORT}`)
  console.log(`  Health check:  http://localhost:${PORT}/api/health\n`)
})

// Graceful shutdown.
const shutdown = async () => {
  await prisma.$disconnect()
  server.close(() => process.exit(0))
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
