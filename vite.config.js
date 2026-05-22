import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cpSync } from 'node:fs'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/OZONO/' : '/',
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        if (command === 'build') {
          cpSync('dist/index.html', 'dist/404.html')
        }
      },
    },
  ],
}))
