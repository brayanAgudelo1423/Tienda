import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cpSync, existsSync } from 'node:fs'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? (process.env.VITE_BASE || '/') : '/',
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      '/uploads': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        if (command === 'build' && existsSync('dist/index.html')) {
          cpSync('dist/index.html', 'dist/404.html')
        }
      },
    },
  ],
}))
