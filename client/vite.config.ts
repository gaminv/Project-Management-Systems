import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: '.', 
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://server:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
