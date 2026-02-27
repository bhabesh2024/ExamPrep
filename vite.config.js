import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // 🔥 FIX 1: Ye line automatically aapke laptop ko phone ke network (Wi-Fi) par expose kar degi
    host: true, 
    
    proxy: {
      // 1. Groq API Proxy
      '/api/groq': {
        target: 'https://api.groq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/groq/, ''),
        headers: {
          'Origin': 'https://api.groq.com'
        }
      },
      // 2. Node.js Backend Proxies
      '/api/questions': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api/signup': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api/login': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api/results': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api/leaderboard': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api/create-order': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api/verify-payment': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api/admin': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api/support': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api/notifications': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api/community': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // 🔥 FIX 2: MISSING CURRENT AFFAIRS PROXY ADDED HERE
      '/api/ca': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    }
  }
})