import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    // PENTING: Ganti '/ScholarDraft/' dengan nama repository GitHub Anda jika berbeda
    base: '/ScholarDraft/', 
    define: {
      // Mapping process.env agar kompatibel dengan kode yang ada
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})