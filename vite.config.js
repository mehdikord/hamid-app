import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ command, mode }) => {
  // بارگذاری متغیرهای محیطی بر اساس mode (development/production)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      mainFields: [
        'browser',
        'module',
        'main',
        'jsnext:main',
        'jsnext'
      ]
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000', // مقدار پیش‌فرض
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/storage': {
          target: env.VITE_API_URL || 'http://localhost:8000', // مقدار پیش‌فرض
          changeOrigin: true
        }
      }
    }
  }
})