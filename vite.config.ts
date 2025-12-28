import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://capstone-backend-ow52.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/uploads': {
        target: 'https://capstone-backend-ow52.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})