import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command, mode }) => {
  // بارگذاری متغیرهای محیطی بر اساس mode (development/production)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      vueDevTools(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            strategies: 'generateSW',
            manifest: {
                name: 'Leadana',
                prefer_related_applications: false,
                short_name: 'Leadana',
                description: '...',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/',
                orientation: 'portrait',
                scope: '/',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: ({ url }) => url.pathname === '/',
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'html-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 2 * 60 * 60 // 2 hours instead of 24 hours
                            }
                        }
                    },
                    {
                        urlPattern: ({request}) => request.destination === 'document',
                        handler: 'StaleWhileRevalidate',
                    },
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'images-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days instead of 30 days
                            },
                        },
                    },
                    {
                        urlPattern: /\.(?:js|css)$/,
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'static-resources',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 24 * 60 * 60, // 1 day for JS/CSS
                            },
                        },
                    }
                ],
                // Dynamic cache ID that changes with each build
                cacheId: `leadana-cache-v${Date.now()}`,
                // Automatically skip waiting and activate new service worker
                skipWaiting: true,
                clientsClaim: true,
                // Clean up old caches automatically
                cleanupOutdatedCaches: true,
            },
            includeAssets: [
                'favicon.ico',
                'robots.txt',
                'webfonts/**/*.woff2'
            ],
            devOptions: {
                enabled: false, // Disable in development to avoid conflicts
                type: 'module',
                navigateFallback: 'index.html'
            }
        }),
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