import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    // Serve config from data/ in dev (fallback to example if missing)
    {
      name: 'serve-config',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const root = server.config.root
          if (req.method !== 'GET') return next()
          if (req.url === '/config.json') {
            const file = fs.existsSync(path.join(root, 'data/config.json'))
              ? path.join(root, 'data/config.json')
              : path.join(root, 'docs/config.json.example')
            res.setHeader('Content-Type', 'application/json')
            res.end(fs.readFileSync(file, 'utf-8'))
            return
          }
          if (req.url === '/context.json') {
            const file = fs.existsSync(path.join(root, 'data/context.json'))
              ? path.join(root, 'data/context.json')
              : path.join(root, 'docs/context.json.example')
            res.setHeader('Content-Type', 'application/json')
            res.end(fs.readFileSync(file, 'utf-8'))
            return
          }
          next()
        })
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
