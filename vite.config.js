import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The API that the dev server proxies /api to. Defaults to a host-run API on
// localhost:4001 (see server/README.md); the docker-compose dev stack sets
// API_PROXY_TARGET=http://server:4001 so the containerised Vite can reach the
// API container (inside a container, "localhost" is the container itself).
const apiTarget = process.env.API_PROXY_TARGET ?? 'http://localhost:4001'

// Bind-mounted source on a Windows host emits no inotify events inside the Linux
// container, so Vite never sees edits and keeps serving stale transforms. The
// compose dev service sets VITE_USE_POLLING=true; host-run dev leaves it unset
// and keeps native (free) watching.
const usePolling = process.env.VITE_USE_POLLING === 'true'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // React, the router and framer-motion are ~250kB that changes only on a
        // dependency bump, while app code changes every deploy. Splitting them
        // out means a content edit no longer invalidates the whole bundle for
        // returning visitors.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  server: {
    port: 5173,
    // No browser to open inside a container; compose sets VITE_OPEN=false.
    open: process.env.VITE_OPEN !== 'false',
    watch: usePolling ? { usePolling: true, interval: 300 } : undefined,
    proxy: {
      // Only used when VITE_API_URL is relative ("/api"). Running on the host,
      // src/lib/api.js calls http://localhost:4001/api directly and skips this.
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
})
