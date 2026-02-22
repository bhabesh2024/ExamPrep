import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
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
      // 2. Node.js Backend Proxies (Naye raste add kiye)
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
// 👇 YEH NAYI LINE ADD KAREIN 👇
'/api/leaderboard': {
  target: 'http://localhost:5000',
  changeOrigin: true,
}
    }
  }
})